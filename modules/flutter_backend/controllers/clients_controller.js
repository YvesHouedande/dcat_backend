const partenaireService = require('../services/partenaires_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllPartenairesClients: async (req, res, next) => {
    try {
      const partenaires = await partenaireService.getAllPartenaires('client'); // Filtre clients
      res.json(partenaires);
    } catch (error) {
      logger.error(`Erreur dans getAllPartenairesClients: ${error.message}`);
      next(error);
    }
  },

  getPartenaireById: async (req, res, next) => {
    try {
      const partenaire = await partenaireService.getPartenaireById(req.params.id);
      if (!partenaire) {
        return res.status(404).json({ message: 'Partenaire non trouvé' });
      }
      res.json(partenaire);
    } catch (error) {
      logger.error(`Erreur dans getPartenaireById: ${error.message}`);
      next(error);
    }
  },

  createPartenaireClient: async (req, res, next) => {
    try {
      logger.info(`Création d'un partenaire client avec les données: ${JSON.stringify(req.body)}`);
      const newPartenaire = await partenaireService.createPartenaire({
        ...req.body,
        type: 'client' // Force le type client
      });
      res.status(201).json(newPartenaire);
    } catch (error) {
      logger.error(`Erreur dans createPartenaireClient: ${error.message}`);
      next(error);
    }
  },

  updatePartenaire: async (req, res, next) => {
    try {
      const updatedPartenaire = await partenaireService.updatePartenaire(req.params.id, req.body);
      res.json(updatedPartenaire);
    } catch (error) {
      logger.error(`Erreur dans updatePartenaire: ${error.message}`);
      next(error);
    }
  },

  deletePartenaire: async (req, res, next) => {
    try {
      await partenaireService.deletePartenaire(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deletePartenaire: ${error.message}`);
      next(error);
    }
  },

  // Bonus: Partenaires clients par entité
  getPartenairesClientsByEntiteId: async (req, res, next) => {
    try {
      const partenaires = await partenaireService.getPartenairesByEntiteId(req.params.entiteId);
      res.json(partenaires.filter(p => p.type === 'client')); // Filtre supplémentaire
    } catch (error) {
      logger.error(`Erreur dans getPartenairesClientsByEntiteId: ${error.message}`);
      next(error);
    }
  },
};