const maintenanceService = require("../services/maintenance.service");

// CREATE
const createMaintenance = async (req, res) => {
  try {
    // if (!req.body.denomination) {
    //   return res.status(400).json({ error: "La denomination est requise" });
    // }
    const result = await maintenanceService.createMaintenance(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création",
      details: error.message 
    });
  }
};

// READ ALL
const getMaintenances = async (req, res) => {
  try {
    const result = await maintenanceService.getMaintenances();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getMaintenanceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await maintenanceService.getMaintenanceById(id);
    if (!result) {
      return res.status(404).json({ error: "Maintenance non trouvée" });
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
const updateMaintenance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await maintenanceService.updateMaintenance(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteMaintenance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await maintenanceService.deleteMaintenance(id);
    res.json({ message: "Maintenance supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createMaintenance,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
};