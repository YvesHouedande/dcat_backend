const livraisonService = require("../services/livraison.service");

// CREATE
const createLivraison = async (req, res) => {
  try {
    const result = await livraisonService.createLivraison(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création",
      details: error.message,
    });
  }
};

// READ ALL
const getLivraisons = async (req, res) => {
  try {
    const result = await livraisonService.getLivraisons();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération",
      details: error.message,
    });
  }
};

// READ ONE
const getLivraisonById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await livraisonService.getLivraisonById(id);
    if (!result) {
      return res.status(404).json({ error: "Livraison non trouvée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération",
      details: error.message,
    });
  }
};

// UPDATE
const updateLivraison = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await livraisonService.updateLivraison(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour",
      details: error.message,
    });
  }
};

// DELETE
const deleteLivraison = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await livraisonService.deleteLivraison(id);
    res.json({ message: "Livraison supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la suppression",
      details: error.message,
    });
  }
};

// Voir les exemplaires ajoutés lors d’une livraisons
const getLivraisonExemplaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await livraisonService.getLivraisonExemplaire(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

module.exports = {
  createLivraison,
  getLivraisons,
  getLivraisonById,
  updateLivraison,
  deleteLivraison,
  getLivraisonExemplaire
};
