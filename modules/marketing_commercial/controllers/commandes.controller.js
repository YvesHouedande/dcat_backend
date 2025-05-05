const commandesService = require('../services/commandes.service');

const commandesController = {
  createCommande: async (req, res) => {
    try {
      const commande = await commandesService.createCommande(req.body);
      res.status(201).json({ success: true, commande });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getClientCommandes: async (req, res) => {
    try {
      const { clientId } = req.params;
      const commandes = await commandesService.getClientCommandes(clientId);
      res.json({ success: true, commandes });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getCommandesByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const commandes = await commandesService.getCommandesByStatus(status);
      res.json({ success: true, commandes });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
};

module.exports = commandesController;