const commandesService = require('../services/commandes.service');

const commandesController = {
  createCommande: async (req, res) => {
    try {
      // Validation des données
      if (!req.body.lieu_de_livraison || !req.body.mode_de_paiement || !req.body.id_client) {
        return res.status(400).json({ 
          success: false, 
          error: "Lieu de livraison, mode de paiement et ID client sont requis" 
        });
      }
      
      if (!req.body.produits || !Array.isArray(req.body.produits) || req.body.produits.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "La commande doit contenir au moins un produit" 
        });
      }
      
      // Vérifier que chaque produit a un id_produit et une quantité valide
      const produitsInvalides = req.body.produits.filter(
        produit => !produit.id_produit || !produit.quantite || produit.quantite < 1
      );
      
      if (produitsInvalides.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Certains produits ont des données invalides (id_produit ou quantité manquants)" 
        });
      }
      
      const commande = await commandesService.createCommande(req.body);
      
      // Récupérer la commande complète avec les produits
      const commandeComplete = await commandesService.getCommandeById(commande.id_commande);
      
      res.status(201).json({ success: true, commande: commandeComplete });
    } catch (error) {
      console.error("Erreur création commande:", error);
      res.status(400).json({ success: false, error: "Erreur lors de la création de la commande" });
    }
  },

  getCommandeById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de commande invalide" 
        });
      }
      
      const commande = await commandesService.getCommandeById(id);
      res.json({ success: true, commande });
    } catch (error) {
      console.error("Erreur récupération commande:", error);
      if (error.message === "Commande non trouvée") {
        return res.status(404).json({ success: false, error: "Commande non trouvée" });
      }
      res.status(500).json({ success: false, error: "Erreur lors de la récupération de la commande" });
    }
  },

  getClientCommandes: async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      
      if (isNaN(clientId)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de client invalide" 
        });
      }
      
      const commandes = await commandesService.getClientCommandes(clientId);
      res.json({ success: true, commandes });
    } catch (error) {
      console.error("Erreur récupération commandes client:", error);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des commandes" });
    }
  },

  getCommandesByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      
      if (!status) {
        return res.status(400).json({ 
          success: false, 
          error: "Statut de commande requis" 
        });
      }
      
      const commandes = await commandesService.getCommandesByStatus(status);
      res.json({ success: true, commandes });
    } catch (error) {
      console.error("Erreur récupération commandes par statut:", error);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des commandes" });
    }
  },

  getCommandeProducts: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de commande invalide" 
        });
      }
      
      // Vérifier d'abord si la commande existe
      try {
        await commandesService.getCommandeById(id);
      } catch (error) {
        console.error("Erreur vérification existence commande:", error);
        if (error.message === "Commande non trouvée") {
          return res.status(404).json({ success: false, error: "Commande non trouvée" });
        }
        throw error;
      }
      
      const produits = await commandesService.getCommandeProducts(id);
      res.json({ success: true, produits });
    } catch (error) {
      console.error("Erreur récupération produits commande:", error);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des produits de la commande" });
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
      console.error("Erreur mise à jour statut commande:", error);
      // Gestion spécifique des erreurs
      if (error.message.includes("État de commande invalide")) {
        return res.status(400).json({ 
          success: false, 
          error: "État de commande invalide" 
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
        error: "Erreur lors de la mise à jour de l'état de la commande" 
      });
    }
  },

  updateLivraisonDate: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { date_livraison } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de commande invalide" 
        });
      }
      
      if (!date_livraison) {
        return res.status(400).json({ 
          success: false, 
          error: "La date de livraison est requise" 
        });
      }
      
      const updatedCommande = await commandesService.updateLivraisonDate(id, date_livraison);
      
      res.json({ 
        success: true, 
        message: "Date de livraison mise à jour avec succès",
        data: updatedCommande
      });
    } catch (error) {
      console.error("Erreur mise à jour date livraison:", error);
      if (error.message === "Commande non trouvée") {
        return res.status(404).json({ 
          success: false, 
          error: "Commande non trouvée" 
        });
      } else if (error.message === "Date de livraison invalide") {
        return res.status(400).json({ 
          success: false, 
          error: "Date de livraison invalide" 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de la date de livraison" 
      });
    }
  },

  updateCommandeStatusAndDate: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { etat_commande, date_livraison } = req.body;
      
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
      
      const updatedCommande = await commandesService.updateCommandeStatusAndDate(id, etat_commande, date_livraison);
      
      res.json({ 
        success: true, 
        message: "Commande mise à jour avec succès",
        data: updatedCommande
      });
    } catch (error) {
      console.error("Erreur mise à jour statut et date commande:", error);
      if (error.message.includes("État de commande invalide")) {
        return res.status(400).json({ 
          success: false, 
          error: "État de commande invalide" 
        });
      } else if (error.message === "Commande non trouvée") {
        return res.status(404).json({ 
          success: false, 
          error: "Commande non trouvée" 
        });
      } else if (error.message === "Date de livraison invalide") {
        return res.status(400).json({ 
          success: false, 
          error: "Date de livraison invalide" 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de la commande" 
      });
    }
  }
};

module.exports = commandesController;