const maintenanceService = require("../services/maintenance.service");

// CREATE
// Pour assigner des employés, passer un champ 'employesIds' (array d'ID) dans le body
const createMaintenance = async (req, res) => {
  try {
    // if (!req.body.denomination) {
    //   return res.status(400).json({ error: "La denomination est requise" });
    // }
    // On attend un champ 'employesIds' dans le body (ex: [1,2,3])
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
    // Récupération des paramètres de pagination depuis la query string
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 20;

    // On peut aussi ajouter des filtres dynamiques si besoin
    const filters = { ...req.query };
    delete filters.page;
    delete filters.pageSize;

    const result = await maintenanceService.getMaintenances(filters, { page, pageSize });
    res.json(result);
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

// GET - Maintenances ponctuelles
const getPonctualMaintenances = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 20;
    const result = await maintenanceService.getPonctualMaintenances({ page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des maintenances ponctuelles",
      details: error.message
    });
  }
};

// GET - Maintenances récurrentes
const getRecurrentMaintenances = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 20;
    const result = await maintenanceService.getRecurrentMaintenances({ page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des maintenances récurrentes",
      details: error.message
    });
  }
};

// PATCH - Mise à jour du statut d'une maintenance
const updateMaintenanceStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const { statut } = req.body;
    if (!statut) {
      return res.status(400).json({ error: "Le champ 'statut' est requis" });
    }
    const result = await maintenanceService.updateMaintenanceStatus(id, statut);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour du statut",
      details: error.message
    });
  }
};

module.exports = {
  createMaintenance,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  getPonctualMaintenances,
  getRecurrentMaintenances,
  updateMaintenanceStatus
};