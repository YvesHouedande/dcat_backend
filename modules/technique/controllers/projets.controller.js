const projetsService = require("../services/projets.service");

// CREATE
const createProjet = async (req, res) => {
  try {
    if (!req.body.titre_projet) {
      return res.status(400).json({ error: "Le titre du projet est requis" });
    }
    const result = await projetsService.createProjet(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création du projet",
      details: error.message 
    });
  }
};

// READ ALL
const getProjets = async (req, res) => {
  try {
    const result = await projetsService.getProjets();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des projets",
      details: error.message 
    });
  }
};

// READ ONE
const getProjetById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await projetsService.getProjetById(id);
    if (!result) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération du projet",
      details: error.message 
    });
  }
};

// UPDATE
const updateProjet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await projetsService.updateProjet(id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Projet non trouvé ou non modifié" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour du projet",
      details: error.message 
    });
  }
};

// DELETE
const deleteProjet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await projetsService.deleteProjet(id);
    if (!result) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }
    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression du projet",
      details: error.message 
    });
  }
};

module.exports = {
  createProjet,
  getProjets,
  getProjetById,
  updateProjet,
  deleteProjet
};
