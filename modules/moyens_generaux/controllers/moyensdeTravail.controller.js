const moyenstravailService = require("../services/moyensdeTravail.service");

// CREATE
const createMoyensTravail = async (req, res) => {
  try {
    if (!req.body.denomination) {
      return res.status(400).json({ error: "La denomination est requise" });
    }
    const result = await moyenstravailService.createMoyensTravail(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création",
      details: error.message 
    });
  }
};

// READ ALL
const getMoyensTravails = async (req, res) => {
  try {
    // Récupération des paramètres de pagination depuis la requête
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;

    // Vérification des valeurs de pagination
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Le paramètre 'page' doit être un entier positif." });
    }
    if (isNaN(pageSize) || pageSize < 1) {
      return res.status(400).json({ error: "Le paramètre 'pageSize' doit être un entier positif." });
    }

    const result = await moyenstravailService.getMoyensTravails({ page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getMoyensTravailById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await moyenstravailService.getMoyensTravailById(id);
    if (!result) {
      return res.status(404).json({ error: "MoyensTravail non trouvée" });
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
const updateMoyensTravail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await moyenstravailService.updateMoyensTravail(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteMoyensTravail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await moyenstravailService.deleteMoyensTravail(id);
    res.json({ message: "MoyensTravail supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createMoyensTravail,
  getMoyensTravails,
  getMoyensTravailById,
  updateMoyensTravail,
  deleteMoyensTravail
};