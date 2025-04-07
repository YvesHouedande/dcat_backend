const missionService = require('../services/missions_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllMissions: async (req, res, next) => {
    try {
      const missions = await missionService.getAllMissions();
      res.json(missions);
    } catch (error) {
      logger.error(`Erreur dans getAllMissions: ${error.message}`);
      next(error);
    }
  },

  getMissionById: async (req, res, next) => {
    try {
      const mission = await missionService.getMissionById(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: 'Mission non trouvée' });
      }
      res.json(mission);
    } catch (error) {
      logger.error(`Erreur dans getMissionById: ${error.message}`);
      next(error);
    }
  },

  createMission: async (req, res, next) => {
    try {
      logger.info(`Création d'une mission avec les données: ${JSON.stringify(req.body)}`);
      const newMission = await missionService.createMission(req.body);
      res.status(201).json(newMission);
    } catch (error) {
      logger.error(`Erreur dans createMission: ${error.message}`);
      next(error);
    }
  },

  updateMission: async (req, res, next) => {
    try {
      const updatedMission = await missionService.updateMission(req.params.id, req.body);
      res.json(updatedMission);
    } catch (error) {
      logger.error(`Erreur dans updateMission: ${error.message}`);
      next(error);
    }
  },

  deleteMission: async (req, res, next) => {
    try {
      await missionService.deleteMission(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteMission: ${error.message}`);
      next(error);
    }
  },

    // Nouveau endpoint
    getMissionEmployes: async (req, res, next) => {
        try {
        const employes = await missionService.getEmployesByMissionId(req.params.missionId);
        res.json(employes);
        } catch (error) {
        logger.error(`Erreur getMissionEmployes: ${error.message}`);
        next(error);
        }
    },

    searchMissions: async (req, res, next) => {
        try {
            const missions = await missionService.searchMissions(req.query); // Récupère les filtres depuis l'URL
            res.json(missions);
        } catch (error) {
            logger.error(`Erreur searchMissions: ${error.message}`);
            next(error);
        }
    },

    getMissionsByCompletion: async (req, res, next) => {
        try {
          const isCompleted = req.query.status === 'completed';
          const missions = await missionService.getMissionsByStatus(isCompleted);
          res.json(missions);
        } catch (error) {
          logger.error(`Erreur getMissionsByCompletion: ${error.message}`);
          next(error);
        }
    },
    
    updateMissionStatus: async (req, res, next) => {
        try {
            const updatedMission = await missionService.updateMissionStatus(
            req.params.id,
            req.body.status
            );
            res.json(updatedMission);
        } catch (error) {
            logger.error(`Erreur updateMissionStatus: ${error.message}`);
            next(error);
        }
    }

    
};