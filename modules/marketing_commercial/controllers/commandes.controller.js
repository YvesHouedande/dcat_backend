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

  updateCommandeStatus: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { etat_commande } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de commande invalide" 
        });
      }
      
      if (!etat_commande) {
        return res.status(400).json({ 
          success: false, 
          error: "L'état de la commande est requis" 
        });
      }
      
      const updatedCommande = await commandesService.updateCommandeStatus(id, etat_commande);
      
      res.json({ 
        success: true, 
        message: "État de la commande mis à jour avec succès",
        data: updatedCommande
      });
    } catch (error) {
      // Gestion spécifique des erreurs
      if (error.message.includes("État de commande invalide")) {
        return res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      } else if (error.message === "Commande non trouvée") {
        return res.status(404).json({ 
          success: false, 
          error: "Commande non trouvée" 
        });
      }
      
      // Erreur générique
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de l'état de la commande: " + error.message 
      });
    }
  }
};

module.exports = commandesController;