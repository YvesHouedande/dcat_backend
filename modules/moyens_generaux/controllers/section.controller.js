const sectionService = require("../services/section.service");

// CREATE
const createSection = async (req, res) => {
  try {
    // if (!req.body.denomination) {
    //   return res.status(400).json({ error: "La denomination est requise" });
    // }
    const result = await sectionService.createSection(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création",
      details: error.message 
    });
  }
};

// READ ALL
const getSections = async (req, res) => {
  try {
    const result = await sectionService.getSections();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getSectionById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await sectionService.getSectionById(id);
    if (!result) {
      return res.status(404).json({ error: "Section non trouvée" });
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
const updateSection = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await sectionService.updateSection(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteSection = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await sectionService.deleteSection(id);
    res.json({ message: "Section supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection
};