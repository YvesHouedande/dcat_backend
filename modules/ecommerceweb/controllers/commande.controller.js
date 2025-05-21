const commandeService = require('../services/commande.services');
const emailService = require('../services/email.service');

exports.creerCommande = async (req, res) => {
  try {
    const panier = req.body;
    
    // 1. Créer la commande en DB
    const commande = await commandeService.creerCommande(panier);
    
    // 2. Envoyer l'email de confirmation
    await emailService.envoyerEmailCommande({
      email: panier.infos.email_client,
      commandeId: commande.id_commande,
      produits: panier.produits
    });

    // 3. Vider le localStorage côté front après confirmation
    res.status(201).json({ 
      success: true,
      commande
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};