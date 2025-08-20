const panierService = require('../services/panier.service');

const panierController = {
  // Récupérer le panier d'un client
  getPanier: async (req, res) => {
    try {
      const clientId = req.user.id;
      const panier = await panierService.getPanierByClientId(clientId);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Ajouter un produit au panier
  addProduit: async (req, res) => {
    try {
      const clientId = req.user.id;
      const { produitId, quantite } = req.body;
      
      if (!produitId) {
        return res.status(400).json({ success: false, error: "L'ID du produit est requis" });
      }
      
      const panier = await panierService.addProduitToPanier(clientId, produitId, quantite || 1);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Mettre à jour la quantité d'un produit
  updateQuantite: async (req, res) => {
    try {
      const clientId = req.user.id;
      const { produitId, quantite } = req.body;
      
      if (!produitId || !quantite) {
        return res.status(400).json({ success: false, error: "L'ID du produit et la quantité sont requis" });
      }
      
      const panier = await panierService.updateProduitQuantite(clientId, produitId, quantite);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Supprimer un produit du panier
  removeProduit: async (req, res) => {
    try {
      const clientId = req.user.id;
      const { produitId } = req.params;
      
      if (!produitId) {
        return res.status(400).json({ success: false, error: "L'ID du produit est requis" });
      }
      
      const panier = await panierService.removeProduitFromPanier(clientId, produitId);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Vider le panier
  clearPanier: async (req, res) => {
    try {
      const clientId = req.user.id;
      const panier = await panierService.clearPanier(clientId);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Synchroniser le panier local avec le panier serveur
  syncPanier: async (req, res) => {
    try {
      const clientId = req.user.id;
      const { produits } = req.body;
      
      if (!produits || !Array.isArray(produits)) {
        return res.status(400).json({ success: false, error: "La liste des produits est requise" });
      }
      
      const panier = await panierService.syncPanier(clientId, produits);
      res.json({ success: true, panier });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

module.exports = panierController;
