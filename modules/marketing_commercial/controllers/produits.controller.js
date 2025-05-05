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

  getProductDetails: async (req, res) => {
    try {
      const { productId } = req.params;
      const produit = await produitsService.getProductDetails(productId);
      res.json({ success: true, produit });
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
};

module.exports = produitsController;