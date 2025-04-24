const interventionsService = require("../services/interventions.service");

// CREATE
const createIntervention = async (req, res) => {
  try {
    if (!req.body.titre_intervention || !req.body.date_intervention) {
      return res.status(400).json({ error: "Le titre et la date de l'intervention sont requis" });
    }
    const result = await interventionsService.createIntervention(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la création de l'intervention",
      details: error.message 
    });
  }
};

// READ ALL
const getInterventions = async (req, res) => {
  try {
    const result = await interventionsService.getInterventions();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des interventions",
      details: error.message 
    });
  }
};

// READ ONE
const getInterventionById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await interventionsService.getInterventionById(id);
    if (!result) {
      return res.status(404).json({ error: "Intervention non trouvée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération de l'intervention",
      details: error.message 
    });
  }
};

// READ BY TACHE
const getInterventionsByTache = async (req, res) => {
  try {
    const tacheId = parseInt(req.params.tacheId);
    if (isNaN(tacheId)) {
      return res.status(400).json({ error: "ID de tâche invalide" });
    }
    const result = await interventionsService.getInterventionsByTache(tacheId);
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des interventions par tâche",
      details: error.message 
    });
  }
};

// UPDATE
const updateIntervention = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await interventionsService.updateIntervention(id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Intervention non trouvée ou non modifiée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour de l'intervention",
      details: error.message 
    });
  }
};

// DELETE
const deleteIntervention = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await interventionsService.deleteIntervention(id);
    if (!result) {
      return res.status(404).json({ error: "Intervention non trouvée" });
    }
    res.json({ message: "Intervention supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression de l'intervention",
      details: error.message 
    });
  }
};

// ASSIGN EMPLOYE
const assignEmployeToIntervention = async (req, res) => {
  try {
    const interventionId = parseInt(req.params.id);
    const employeId = parseInt(req.body.id_employes);
    if (isNaN(interventionId) || isNaN(employeId)) {
      return res.status(400).json({ error: "IDs invalides" });
    }
    const result = await interventionsService.assignEmployeToIntervention(interventionId, employeId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de l'assignation de l'employé à l'intervention",
      details: error.message 
    });
  }
};

// REMOVE EMPLOYE
const removeEmployeFromIntervention = async (req, res) => {
  try {
    const interventionId = parseInt(req.params.id);
    const employeId = parseInt(req.params.employeId);
    if (isNaN(interventionId) || isNaN(employeId)) {
      return res.status(400).json({ error: "IDs invalides" });
    }
    await interventionsService.removeEmployeFromIntervention(interventionId, employeId);
    res.json({ message: "Employé retiré de l'intervention avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors du retrait de l'employé de l'intervention",
      details: error.message 
    });
  }
};

// GET EMPLOYES BY INTERVENTION
const getEmployesByIntervention = async (req, res) => {
  try {
    const interventionId = parseInt(req.params.id);
    if (isNaN(interventionId)) {
      return res.status(400).json({ error: "ID d'intervention invalide" });
    }
    const result = await interventionsService.getEmployesByIntervention(interventionId);
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des employés de l'intervention",
      details: error.message 
    });
  }
};

module.exports = {
  createIntervention,
  getInterventions,
  getInterventionById,
  getInterventionsByTache,
  updateIntervention,
  deleteIntervention,
  assignEmployeToIntervention,
  removeEmployeFromIntervention,
  getEmployesByIntervention
};
