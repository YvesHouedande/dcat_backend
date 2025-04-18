const tacheService = require('../services/taches_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllTaches: async (req, res, next) => {
    try {
      const taches = await tacheService.getAllTaches();
      res.json(taches);
    } catch (error) {
      logger.error(`Erreur dans getAllTaches: ${error.message}`);
      next(error);
    }
  },

  getTacheById: async (req, res, next) => {
    try {
      const tache = await tacheService.getTacheById(req.params.id);
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.json(tache);
    } catch (error) {
      logger.error(`Erreur dans getTacheById: ${error.message}`);
      next(error);
    }
  },

  createTache: async (req, res, next) => {
    try {
      logger.info(`Création d'une tâche avec les données: ${JSON.stringify(req.body)}`);
      const newTache = await tacheService.createTache(req.body);
      res.status(201).json(newTache);
    } catch (error) {
      logger.error(`Erreur dans createTache: ${error.message}`);
      next(error);
    }
  },

  updateTache: async (req, res, next) => {
    try {
      const updatedTache = await tacheService.updateTache(req.params.id, req.body);
      res.json(updatedTache);
    } catch (error) {
      logger.error(`Erreur dans updateTache: ${error.message}`);
      next(error);
    }
  },

  deleteTache: async (req, res, next) => {
    try {
      await tacheService.deleteTache(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteTache: ${error.message}`);
      next(error);
    }
  },

  // Bonus: Récupérer les tâches d'une mission
  getTachesByMissionId: async (req, res, next) => {
    try {
      const taches = await tacheService.getTachesByMissionId(req.params.missionId);
      res.json(taches);
    } catch (error) {
      logger.error(`Erreur dans getTachesByMissionId: ${error.message}`);
      next(error);
    }
  },
};