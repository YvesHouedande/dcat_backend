const produitsService = require('../services/produits.service');

const produitsController = {
  getEquipementsByFamille: async (req, res) => {
    try {
      const { familleId } = req.params;
      const produits = await produitsService.getEquipementsByFamille(familleId);
      res.json({ success: true, produits });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getAllEquipements: async (req, res) => {
    try {
      const produits = await produitsService.getAllEquipements();
      res.json({ success: true, produits });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getLatestProducts: async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const produits = await produitsService.getLatestProducts(limit);
      res.json({ success: true, produits });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const { productId } = req.params;
      const produit = await produitsService.getProductDetails(productId);
      res.json({ success: true, produit });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  getProductImages: async (req, res) => {
    try {
      const { productId } = req.params;
      const images = await produitsService.getProductImages(productId);
      res.json({ success: true, images });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  getAllFamilles: async (req, res) => {
    try {
      const familles = await produitsService.getAllFamilles();
      res.json({ success: true, familles });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Récupérer des produits similaires basés sur le libellé
  getSimilarProductsByLibelle: async (req, res) => {
    try {
      const { productId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 4;
      
      const produits = await produitsService.getSimilarProductsByLibelle(productId, limit);
      res.json({ success: true, produits });
    } catch (error) {
      // Si le produit n'est pas trouvé, renvoyer 404
      if (error.message.includes("trouvé")) {
        return res.status(404).json({ success: false, error: error.message });
      }
      // Pour les autres erreurs, renvoyer 400
      res.status(400).json({ success: false, error: error.message });
    }
  },
};

module.exports = produitsController;