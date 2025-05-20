const panierService = require("../services/panier.service");

// ✅ Ajouter un produit au panier
const addToPanier = async (req, res) => {
  try {
    const { id_client, id_produit, quantite } = req.body;

    if (!id_client || !id_produit || !quantite) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const result = await panierService.addToPanier({
      id_client,
      id_produit,
      quantite,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de l'ajout au panier",
      details: error.message,
    });
  }
};

// ✅ Supprimer un produit du panier
const removeFromPanier = async (req, res) => {
  try {
    const { id_client, id_produit } = req.body;

    if (!id_client || !id_produit) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const result = await panierService.removeFromPanier({
      id_client,
      id_produit,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du panier",
      details: error.message,
    });
  }
};

// ✅ Récupérer le panier d’un client
const getPanierByClient = async (req, res) => {
  try {
    const id_client = parseInt(req.params.id_client);
    if (isNaN(id_client)) {
      return res.status(400).json({ error: "ID client invalide" });
    }

    const result = await panierService.getPanierByClient(id_client);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération du panier",
      details: error.message,
    });
  }
};

module.exports = {
  addToPanier,
  removeFromPanier,
  getPanierByClient,
};
