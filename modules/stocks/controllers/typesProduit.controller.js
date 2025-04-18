const typeProduitService = require("../services/typeProduit.service");

// CREATE
const createTypeProduit = async (req, res) => {
  try {
    if (!req.body.libelle) {
      return res.status(400).json({ error: "Le libellé est requis" });
    }
    const result = await typeProduitService.createTypeProduit(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création",
      details: error.message 
    });
  }
};

// READ ALL
const getTypeProduits = async (req, res) => {
  try {
    const result = await typeProduitService.getTypeProduits();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getTypeProduitById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await typeProduitService.getTypeProduitById(id);
    if (!result) {
      return res.status(404).json({ error: "TypeProduit non trouvée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// UPDATE
const updateTypeProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await typeProduitService.updateTypeProduit(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteTypeProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await typeProduitService.deleteTypeProduit(id);
    res.json({ message: "TypeProduit supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createTypeProduit,
  getTypeProduits,
  getTypeProduitById,
  updateTypeProduit,
  deleteTypeProduit
};