// Table de liaison entre maintenant et  moyens de travail
// maintenanceMoyenTravail.controller.js
const maintenanceMoyenTravailService = require("../services/maintenanceMoyenTravail.service");

// CREATE
const createMaintenanceMoyenTravail = async (req, res) => {
  try {
    const result = await maintenanceMoyenTravailService.createMaintenanceMoyenTravail(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création",
      details: error.message,
    });
  }
};

// READ ALL
const getMaintenanceMoyenTravails = async (req, res) => {
  try {
    const result = await maintenanceMoyenTravailService.getMaintenanceMoyenTravails();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération",
      details: error.message,
    });
  }
};

// READ ONE
const getMaintenanceMoyenTravailById = async (req, res) => {
  try {
    const id_moyens_de_travail = parseInt(req.params.id_moyens_de_travail);
    const id_maintenance = parseInt(req.params.id_maintenance);
    if (isNaN(id_moyens_de_travail) || isNaN(id_maintenance)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await maintenanceMoyenTravailService.getMaintenanceMoyenTravailById(id_moyens_de_travail, id_maintenance);
    if (!result) {
      return res.status(404).json({ error: "Maintenance Moyen Travail non trouvée" });
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
const updateMaintenanceMoyenTravail = async (req, res) => {
  try {
    const id_moyens_de_travail = parseInt(req.params.id_moyens_de_travail);
    const id_maintenance = parseInt(req.params.id_maintenance);
    if (isNaN(id_moyens_de_travail) || isNaN(id_maintenance)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await maintenanceMoyenTravailService.updateMaintenanceMoyenTravail(id_moyens_de_travail, id_maintenance, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour",
      details: error.message,
    });
  }
};

// DELETE
const deleteMaintenanceMoyenTravail = async (req, res) => {
  try {
    const id_moyens_de_travail = parseInt(req.params.id_moyens_de_travail);
    const id_maintenance = parseInt(req.params.id_maintenance);
    if (isNaN(id_moyens_de_travail) || isNaN(id_maintenance)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await maintenanceMoyenTravailService.deleteMaintenanceMoyenTravail(id_moyens_de_travail, id_maintenance);
    res.json({ message: "Maintenance Moyen Travail supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la suppression",
      details: error.message,
    });
  }
};

module.exports = {
  createMaintenanceMoyenTravail,
  getMaintenanceMoyenTravails,
  getMaintenanceMoyenTravailById,
  updateMaintenanceMoyenTravail,
  deleteMaintenanceMoyenTravail,
};
