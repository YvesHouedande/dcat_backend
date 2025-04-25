const produitService = require("../services/produit.service");
const upload = require("../../utils/middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

// Configuration du dossier d'upload (depuis la racine du projet)
const UPLOAD_DIR = path.join(process.cwd(), 'media', 'images', 'stock_moyensgeneraux', 'produits');

const createProduit = async (req, res) => {
  try {
    // Configuration du chemin d'upload pour cette requête
    req.uploadPath = UPLOAD_DIR;
    
    // Utilisation du middleware Multer pour gérer l'upload
    upload.single('image_produit')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          error: "Erreur lors de l'upload de l'image",
          details: err.message 
        });
      }

      // Préparation des données du produit
      const produitData = {
        ...req.body,
        // Si un fichier a été uploadé, on stocke le chemin relatif
        image_produit: req.file 
          ? path.join('media', 'images', 'stock_moyensgeneraux', 'produits', req.file.filename)
          : null
      };

      const result = await produitService.createProduit(produitData);
      return res.status(201).json(result);
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la création du produit", 
      details: error.message 
    });
  }
};

const getProduits = async (req, res) => {
  try {
    const produits = await produitService.getProduits();
    
    // Transformer les chemins d'images en URLs accessibles si nécessaire
    const result = produits.map(produit => ({
      ...produit,
      image_url: produit.image_produit 
        ? `${req.protocol}://${req.get('host')}/${produit.image_produit.replace(/\\/g, '/')}`
        : null
    }));

    return res.status(200).json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la récupération des produits", 
      details: error.message 
    });
  }
};

const getProduitsByTypes = async (req, res) => {
  try {
    const idType = parseInt(req.params.idType);
    if (isNaN(idType)) {
      return res.status(400).json({ error: "ID de type de produit invalide" });
    }
    
    const produits = await produitService.getProduitsByTypes(Number(idType));
    
    // Transformer les chemins d'images en URLs accessibles si nécessaire
    const result = produits.map(produit => ({
      ...produit,
      image_url: produit.image_produit 
        ? `${req.protocol}://${req.get('host')}/${produit.image_produit.replace(/\\/g, '/')}`
        : null
    }));

    return res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la récupération des produits par type", 
      details: error.message 
    });
  }
};

const getProduitById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }
    
    const produit = await produitService.getProduitById(Number(id));
    
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Ajouter l'URL complète de l'image si elle existe
    const result = {
      ...produit,
      image_url: produit.image_produit 
        ? `${req.protocol}://${req.get('host')}/${produit.image_produit.replace(/\\/g, '/')}`
        : null
    };

    return res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la récupération du produit", 
      details: error.message 
    });
  }
};

const updateProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }

    req.uploadPath = UPLOAD_DIR;
    
    upload.single('image_produit')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          error: "Erreur lors de l'upload de l'image",
          details: err.message 
        });
      }

      // Récupérer l'ancien produit pour supprimer l'image existante si nécessaire
      const existingProduit = await produitService.getProduitById(id);
      if (!existingProduit) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }

      // Préparation des données de mise à jour
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      if (req.file) {
        // Si une nouvelle image est uploadée
        updateData.image_produit = path.join('media', 'images', 'stock_moyensgeneraux', 'produits', req.file.filename);
        
        // Supprimer l'ancienne image si elle existe
        if (existingProduit.image_produit) {
          const oldImagePath = path.join(process.cwd(), existingProduit.image_produit);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const result = await produitService.updateProduit(id, updateData);
      return res.json(result);
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la mise à jour du produit", 
      details: error.message 
    });
  }
};

const deleteProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produit invalide" });
    }

    // Récupérer le produit avant suppression pour supprimer son image
    const produit = await produitService.getProduitById(id);
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const result = await produitService.deleteProduit(id);

    // Supprimer l'image associée si elle existe
    if (produit.image_produit) {
      const imagePath = path.join(process.cwd(), produit.image_produit);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la suppression du produit", 
      details: error.message 
    });
  }
};

module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  getProduitsByTypes
};