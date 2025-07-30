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

// LECTURE DE TOUS LES MOYENS DE TRAVAIL (adapté au service)
const getMoyensTravails = async (req, res) => {
  try {
    // Récupération des paramètres de pagination et de filtrage depuis la requête
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const id_section = req.query.id_section ? parseInt(req.query.id_section) : undefined;
    const date_acquisition = req.query.date_acquisition ? req.query.date_acquisition : undefined;

    // Vérification des valeurs de pagination
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Le paramètre 'page' doit être un entier positif." });
    }
    if (isNaN(pageSize) || pageSize < 1) {
      return res.status(400).json({ error: "Le paramètre 'pageSize' doit être un entier positif." });
    }
    if (req.query.id_section && isNaN(id_section)) {
      return res.status(400).json({ error: "Le paramètre 'id_section' doit être un entier." });
    }

    // Passage des options de pagination et de filtrage au service
    const options = { page, pageSize };
    if (id_section !== undefined) options.id_section = id_section;
    if (date_acquisition !== undefined) options.date_acquisition = date_acquisition;

    const result = await moyenstravailService.getMoyensTravails(options);
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
    const result = await moyenstravailService.deleteMoyensTravail(id);
    if (!result) {
      return res.status(404).json({ error: "MoyensTravail non trouvée ou déjà supprimée" });
    }
    res.status(200).json({ message: "MoyensTravail supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};

const updateEtatMoyensTravail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { etat } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    if (!etat || typeof etat !== 'string') {
      return res.status(400).json({ error: "Le champ 'etat' est requis et doit être une chaîne de caractères." });
    }
    const result = await moyenstravailService.updateEtatMoyensTravail(id, etat);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors du changement d'état du moyen de travail",
      details: error.message
    });
  }
};

module.exports = {
  createMoyensTravail,
  getMoyensTravails,
  getMoyensTravailById,
  updateMoyensTravail,
  deleteMoyensTravail,
  updateEtatMoyensTravail,
};