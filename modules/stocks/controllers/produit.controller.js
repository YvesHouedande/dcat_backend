const produitService = require("../services/produit.service");
const upload = require("../../utils/middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

const { eq } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { images } = require("../../../core/database/models");

// Configuration du dossier d'upload
const UPLOAD_DIR = path.join(
  process.cwd(),
  "media",
  "images",
  "stock_moyensgeneraux",
  "produits"
);

//ajouter des images au produit ; utile dans le cas où on a deja enregistré le produit et on plus tard on veut lui ajouter d'autres images

const addProduitImages = async (req, res) => {
  try {
    req.uploadPath = UPLOAD_DIR;

    // Utilisation de multer pour plusieurs fichiers
    upload.array("images", 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: "Erreur lors de l'upload des images",
          details: err.message,
        });
      }

      const produitId = parseInt(req.params.id);
      if (isNaN(produitId)) {
        return res.status(400).json({ error: "ID de produit invalide" });
      }

      const { libelles = [], numeros = [] } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Aucune image envoyée" });
      }

      // Validation : libelles et numeros doivent être des tableaux de même longueur
      const libelleArray = Array.isArray(libelles) ? libelles : [libelles];
      const numeroArray = Array.isArray(numeros) ? numeros : [numeros];

      if (
        req.files.length !== libelleArray.length ||
        req.files.length !== numeroArray.length
      ) {
        return res.status(400).json({
          error:
            "Le nombre d'images, de libellés et de numéros doit correspondre",
        });
      }

      const imagesData = req.files.map((file, index) => ({
        libelle: libelleArray[index],
        numero: parseInt(numeroArray[index]),
        lien: path.join(
          "media",
          "images",
          "stock_moyensgeneraux",
          "produits",
          file.filename
        ),
      }));

      const inserted = await produitService.addProduitImages(
        produitId,
        imagesData
      );

      return res
        .status(201)
        .json({ message: "Images enregistrées", images: inserted });
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'images :", error);
    res.status(500).json({
      error: "Erreur interne",
      details: error.message,
    });
  }
};

// Créer un produit avec gestion de plusieurs images
const createProduit = async (req, res) => {
  try {
    req.uploadPath = UPLOAD_DIR;

    upload.array("images", 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: "Erreur lors de l'upload des images",
          details: err.message,
        });
      }

      const produitData = req.body;
      const produit = await produitService.createProduit(produitData);

      // 🎯 Traitement des métadonnées
      const imagesMeta = req.body.imagesMeta
        ? JSON.parse(req.body.imagesMeta)
        : [];

      if (req.files && req.files.length > 0) {
        const imagesInfos = req.files.map((file, index) => ({
          lien: path.join(
            "media",
            "images",
            "stock_moyensgeneraux",
            "produits",
            file.filename
          ),
          libelle: imagesMeta[index]?.libelle || "",
          numero: imagesMeta[index]?.numero || index + 1,
        }));

        await produitService.addProduitImages(produit.id_produit, imagesInfos);
      }

      const completeProduit = await produitService.getProduitById(
        produit.id_produit
      );

      return res.status(201).json(completeProduit);
    });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la création du produit",
      details: error.message,
    });
  }
};

// Récupérer les produits avec pagination et filtres

const getProduits = async (req, res) => {
  try {
    // ---------------------- Query params ----------------------
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      search,
      categoryId,
      typeId,
      familleLibelle,
      marqueLibelle,
      modeleLibelle,
      prixMin,
      prixMax,
      qteMin,
      qteMax,

      // ---- Filtres seuil stock ----
      seuilMode,          // "equal" | "below" | "near"
      nearMargin,         // entier (marge « near »)
    } = req.query;

    // ---------------------- Options pour le service ----------------------
    const options = {
      page:      parseInt(page, 10),
      limit:     parseInt(limit, 10),
      sortBy,
      sortOrder,
      search,

      categoryId:     categoryId     ? parseInt(categoryId, 10)     : undefined,
      typeId:         typeId         ? parseInt(typeId, 10)         : undefined,
      familleLibelle: familleLibelle || undefined,
      marqueLibelle:  marqueLibelle  || undefined,
      modeleLibelle:  modeleLibelle  || undefined,

      prixMin: prixMin ? parseFloat(prixMin) : undefined,
      prixMax: prixMax ? parseFloat(prixMax) : undefined,
      qteMin:  qteMin  ? parseInt(qteMin, 10) : undefined,
      qteMax:  qteMax  ? parseInt(qteMax, 10) : undefined,

      // --- seuil stock ---
      seuilMode: ["equal", "below", "near"].includes(seuilMode) ? seuilMode : undefined,
      nearMargin: nearMargin ? parseInt(nearMargin, 10) : undefined,
    };

    // ---------------------- Appel service ----------------------
    const result = await produitService.getProduits(options);

    // ---------------------- URL complètes pour les images ----------------------
    const hostPrefix = `${req.protocol}://${req.get("host")}/`;

    result.data = result.data.map((item) => ({
      ...item,
      images: item.images
        ? item.images.map((img) => ({
            ...img,
            url: hostPrefix + img.lien_image.replace(/\\/g, "/"),
          }))
        : [],
    }));

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des produits",
      details: error.message,
    });
  }
};


// Récupérer un produit par son ID
const getProduitById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }

    const produit = await produitService.getProduitById(id);

    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Transformer les chemins d'images en URLs complètes
    const result = {
      ...produit,
      images: produit.images
        ? produit.images.map((img) => ({
            ...img,
            url: `${req.protocol}://${req.get("host")}/${img.lien_image.replace(
              /\\/g,
              "/"
            )}`,
          }))
        : [],
    };

    return res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération du produit",
      details: error.message,
    });
  }
};

const getProduitsByTypes = async (req, res) => {
  try {
    const idType = parseInt(req.params.idType);
    if (isNaN(idType)) {
      return res.status(400).json({ error: "ID de type de produit invalide" });
    }

    const { page = 1, limit = 10 } = req.query;

    const result = await produitService.getProduitsByTypes(idType, {
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json(result); // on retourne directement { data, pagination }
  } catch (error) {
    console.error("Erreur getProduitsByTypes:", error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de la récupération des produits par type",
      details: error.message,
    });
  }
};

// Mettre à jour un produit
const updateProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }

    req.uploadPath = UPLOAD_DIR;

    upload.array("images", 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: "Erreur lors de l'upload des images",
          details: err.message,
        });
      }

      // 🔄 Mise à jour des champs du produit
      const updateData = {
        ...req.body,
        updated_at: new Date(),
      };

      await produitService.updateProduit(id, updateData);

      // 📦 Traitement des nouvelles images
      const imagesMeta = req.body.imagesMeta
        ? JSON.parse(req.body.imagesMeta)
        : [];

      if (req.files && req.files.length > 0) {
        const imagesInfos = req.files.map((file, index) => ({
          lien: path.join(
            "media",
            "images",
            "stock_moyensgeneraux",
            "produits",
            file.filename
          ),
          libelle: imagesMeta[index]?.libelle || "",
          numero: imagesMeta[index]?.numero || index + 1,
        }));

        await produitService.addProduitImages(id, imagesInfos);
      }

      // 🔍 Retourner le produit avec toutes ses infos à jour
      const completeProduit = await produitService.getProduitById(id);

      return res.json(completeProduit);
    });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour du produit",
      details: error.message,
    });
  }
};

// Supprimer un produit
const deleteProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }

    // Récupérer le produit avant suppression pour supprimer ses images
    const produit = await produitService.getProduitById(id);
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Supprimer les fichiers image du serveur
    if (produit.images && produit.images.length > 0) {
      produit.images.forEach((img) => {
        const imagePath = path.join(process.cwd(), img.lien_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    const result = await produitService.deleteProduit(id);
    return res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du produit",
      details: error.message,
    });
  }
};

// Supprimer une image d'un produit
const deleteImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId);

    if (isNaN(imageId)) {
      return res.status(400).json({ error: "ID d'image invalide" });
    }

    // Récupérer l'image avant suppression
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id_image, imageId));

    if (!image) {
      return res.status(404).json({ error: "Image non trouvée" });
    }

    // Supprimer le fichier du serveur
    const imagePath = path.join(process.cwd(), image.lien_image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    const result = await produitService.deleteProduitImage(imageId);
    return res
      .status(200)
      .json({ message: "suppression effectuée avec succès", result: result });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de l'image",
      details: error.message,
    });
  }
};

module.exports = {
  addProduitImages,
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  deleteImage,
  getProduitsByTypes,
};
