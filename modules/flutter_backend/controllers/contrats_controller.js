const contratService = require('../services/contrats_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllContrats: async (req, res, next) => {
    try {
      const contrats = await contratService.getAllContrats();
      res.json(contrats);
    } catch (error) {
      logger.error(`Erreur dans getAllContrats: ${error.message}`);
      next(error);
    }
  },

  getContratById: async (req, res, next) => {
    try {
      const contrat = await contratService.getContratById(req.params.id);
      if (!contrat) {
        return res.status(404).json({ message: 'Contrat non trouvé' });
      }
      res.json(contrat);
    } catch (error) {
      logger.error(`Erreur dans getContratById: ${error.message}`);
      next(error);
    }
  },

  createContrat: async (req, res, next) => {
    try {
      logger.info(`Création d'un contrat avec les données: ${JSON.stringify(req.body)}`);
      const newContrat = await contratService.createContrat(req.body);
      res.status(201).json(newContrat);
    } catch (error) {
      logger.error(`Erreur dans createContrat: ${error.message}`);
      next(error);
    }
  },

  updateContrat: async (req, res, next) => {
    try {
      const updatedContrat = await contratService.updateContrat(req.params.id, req.body);
      res.json(updatedContrat);
    } catch (error) {
      logger.error(`Erreur dans updateContrat: ${error.message}`);
      next(error);
    }
  },

  deleteContrat: async (req, res, next) => {
    try {
      await contratService.deleteContrat(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteContrat: ${error.message}`);
      next(error);
    }
  },

  // Bonus: Contrats d'un partenaire
  getContratsByPartenaireId: async (req, res, next) => {
    try {
      const contrats = await contratService.getContratsByPartenaireId(req.params.partenaireId);
      res.json(contrats);
    } catch (error) {
      logger.error(`Erreur dans getContratsByPartenaireId: ${error.message}`);
      next(error);
    }
  },
};