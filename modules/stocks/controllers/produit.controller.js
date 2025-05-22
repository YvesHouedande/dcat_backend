const produitService = require("../services/produit.service");
const upload = require("../../utils/middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

// Configuration du dossier d'upload
const UPLOAD_DIR = path.join(
  process.cwd(),
  "media",
  "images",
  "stock_moyensgeneraux",
  "produits"
);

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
      prixMin,
      prixMax,
      qteMin,
      qteMax,
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      typeId: typeId ? parseInt(typeId) : undefined,
      familleLibelle: familleLibelle ? familleLibelle : undefined,
      marqueLibelle: marqueLibelle ? marqueLibelle : undefined,
      prixMin: prixMin ? parseFloat(prixMin) : undefined,
      prixMax: prixMax ? parseFloat(prixMax) : undefined,
      qteMin: qteMin ? parseInt(qteMin) : undefined,
      qteMax: qteMax ? parseInt(qteMax) : undefined,
    };

    const result = await produitService.getProduits(options);

    // Transformer les chemins d'images en URLs complètes
    result.data = result.data.map((item) => ({
      ...item,
      images: item.images
        ? item.images.map((img) => ({
            ...img,
            url: `${req.protocol}://${req.get("host")}/${img.lien_image.replace(
              /\\/g,
              "/"
            )}`,
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
    const { limit = 50, offset = 0 } = req.query;
    if (isNaN(idType)) {
      return res.status(400).json({ error: "ID de type invalide" });
    }

    const produits = await produitService.getProduitsByTypes(idType, {
      limit: Number(limit),
      offset: Number(offset),
    });

    // Ajouter les URLs accessibles aux images
    const result = produits.map((produit) => ({
      ...produit,
      images: produit.images.map((img) => ({
        ...img,
        url: `${req.protocol}://${req.get("host")}${img.lien_image}`,
      })),
    }));

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des produits par type",
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

      const updatedProduit = await produitService.updateProduit(id, updateData);

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
    return res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de l'image",
      details: error.message,
    });
  }
};


module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  deleteImage,
  getProduitsByTypes,
};
