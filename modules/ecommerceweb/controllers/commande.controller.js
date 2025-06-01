const commandeService = require('../services/commande.service');

exports.creerCommande = async (req, res) => {
  try {
    const { panier } = req.body;
    const id_client = req.client.id_client; // From middleware

    const commande = await commandeService.creerCommande({
      ...panier,
      id_client
    });

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