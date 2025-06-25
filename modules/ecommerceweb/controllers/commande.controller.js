const commandeService = require('../services/commande.service');
const emailService = require('../services/email.service');


exports.creerCommande = async (req, res) => {
  try {
    const { panier } = req.body;
    const id_client = req.user.id_client; // Récupéré du middleware

    // Validation supplémentaire
    if (!panier?.infos?.adresse_livraison || !panier?.infos?.methode_paiement) {
      return res.status(400).json({
        success: false,
        message: 'Adresse de livraison et méthode de paiement sont requises'
      });
    }

    const commande = await commandeService.creerCommande({
      ...panier,
      id_client
    });

    // Envoi de la notification par email
    emailService.sendOrderNotification(commande.id_commande)
    .catch(e => console.error('Erreur secondaire lors de l\'envoi du mail:', e));
    console.log('Notification email envoyée pour la commande:', commande.id_commande);

    res.status(201).json({
      success: true,
      commande
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getHistoriqueCommandes = async (req, res) => {
  try {
    // Vérification de l'authentification
    if (!req.user?.id_client) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    // Appel au service
    const historique = await commandeService.getHistoriqueCommandes(req.user.id_client);
    
    // Réponse formatée
    res.json({
      success: true,
      commandes: historique
    });

  } catch (error) {
    console.error('Erreur dans getHistoriqueCommandes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};


exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const idClient = req.user.id_client;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande invalide'
      });
    }

    const commande = await commandeService.getOrderDetails(parseInt(id), idClient);

    res.json({
      success: true,
      commande: {
        ...commande,
        produits: commande.produits.map(p => ({
          ...p,
          prix_unitaire: p.prix_unitaire.toString() // Conversion pour le frontend
        }))
      }
    });

  } catch (error) {
    console.error('Erreur dans getOrderDetails:', error);
    res.status(error.message.includes('non trouvée') ? 404 : 500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const idClient = req.user.id_client;

    await commandeService.cancelOrder(parseInt(id), idClient);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
