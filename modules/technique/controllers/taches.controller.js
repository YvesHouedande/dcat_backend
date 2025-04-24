const tachesService = require("../services/taches.service");

// CREATE
const createTache = async (req, res) => {
  try {
    if (!req.body.titre_tache || !req.body.id_projet) {
      return res.status(400).json({ error: "Le titre de la tâche et l'ID du projet sont requis" });
    }
    const result = await tachesService.createTache(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création de la tâche",
      details: error.message 
    });
  }
};

// READ ALL
const getTaches = async (req, res) => {
  try {
    const result = await tachesService.getTaches();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des tâches",
      details: error.message 
    });
  }
};

// READ ONE
const getTacheById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await tachesService.getTacheById(id);
    if (!result) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération de la tâche",
      details: error.message 
    });
  }
};

// READ BY PROJECT
const getTachesByProjet = async (req, res) => {
  try {
    const projetId = parseInt(req.params.projetId);
    if (isNaN(projetId)) {
      return res.status(400).json({ error: "ID de projet invalide" });
    }
    const result = await tachesService.getTachesByProjet(projetId);
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des tâches du projet",
      details: error.message 
    });
  }
};

// UPDATE
const updateTache = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await tachesService.updateTache(id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Tâche non trouvée ou non modifiée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour de la tâche",
      details: error.message 
    });
  }
};

// DELETE
const deleteTache = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await tachesService.deleteTache(id);
    if (!result) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression de la tâche",
      details: error.message 
    });
  }
};

module.exports = {
  createTache,
  getTaches,
  getTacheById,
  updateTache,
  deleteTache,
  getTachesByProjet
};
