const interventionService = require('../services/interventions_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllInterventions: async (req, res, next) => {
    try {
      const interventions = await interventionService.getAllInterventions();
      res.json({
        success: true,
        message: "Liste des interventions récupérée avec succès",
        data: interventions
      });
    } catch (error) {
      logger.error(`Erreur dans getAllInterventions: ${error.message}`);
      next(error);
    }
  },

  createIntervention: async (req, res, next) => {
    try {
      logger.info(`Création d'une intervention avec les données: ${JSON.stringify(req.body)}`);
      const newIntervention = await interventionService.createIntervention(req.body);
      res.status(201).json({
        success: true,
        message: "Intervention créée avec succès",
        data: {
          intervention: newIntervention,
          details: {
            dateCreation: new Date().toISOString(),
            creePar: req.user?.username || 'system'
          }
        }
      });
    } catch (error) {
      logger.error(`Erreur dans createIntervention: ${error.message}`);
      next(error);
    }
  },

  updateIntervention: async (req, res, next) => {
    try {
      const updatedIntervention = await interventionService.updateIntervention(req.params.id, req.body);
      res.json({
        success: true,
        message: "Intervention mise à jour avec succès",
        data: {
          ancien: req.body,
          nouveau: updatedIntervention,
          details: {
            dateMiseAJour: new Date().toISOString(),
            modifiePar: req.user?.username || 'system'
          }
        }
      });
    } catch (error) {
      logger.error(`Erreur dans updateIntervention: ${error.message}`);
      next(error);
    }
  },

  deleteIntervention: async (req, res, next) => {
    try {
      await interventionService.deleteIntervention(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteIntervention: ${error.message}`);
      next(error);
    }
  },

  searchInterventions: async (req, res, next) => {
    try {
      const interventions = await interventionService.searchInterventions(req.query);
      res.json(interventions);
    } catch (error) {
      logger.error(`Erreur searchInterventions: ${error.message}`);
      next(error);
    }
  },
  
  getInterventionDetails: async (req, res, next) => {
    try {
      const details = await interventionService.getInterventionDetails(req.params.id);
      res.json(details);
    } catch (error) {
      logger.error(`Erreur getInterventionDetails: ${error.message}`);
      next(error);
    }
  }
  
};