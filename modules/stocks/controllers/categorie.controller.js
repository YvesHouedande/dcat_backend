const categorieService = require("../services/categorie.service");

// CREATE
const createCategorie = async (req, res) => {
  try {
    if (!req.body.libelle) {
      return res.status(400).json({ error: "Le libellé est requis" });
    }
    const result = await categorieService.createCategorie(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création",
      details: error.message 
    });
  }
};

// READ ALL
const getCategories = async (req, res) => {
  try {
    const result = await categorieService.getCategories();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getCategorieById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await categorieService.getCategorieById(id);
    if (!result) {
      return res.status(404).json({ error: "Categorie non trouvée" });
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
const updateCategorie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await categorieService.updateCategorie(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteCategorie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await categorieService.deleteCategorie(id);
    res.json({ message: "Categorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createCategorie,
  getCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie
};