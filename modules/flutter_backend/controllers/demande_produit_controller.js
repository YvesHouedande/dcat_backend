const demandeProduitService = require('../services/demandes_produit_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllDemandesProduit: async (req, res, next) => {
    try {
      const demandes = await demandeProduitService.getAllDemandesProduit();
      res.json(demandes);
    } catch (error) {
      logger.error(`Erreur dans getAllDemandesProduit: ${error.message}`);
      next(error);
    }
  },

  createDemandeProduit: async (req, res, next) => {
    try {
      logger.info(`Création demande produit: ${JSON.stringify(req.body)}`);
      const newDemande = await demandeProduitService.createDemandeProduit(req.body);
      res.status(201).json(newDemande);
    } catch (error) {
      logger.error(`Erreur dans createDemandeProduit: ${error.message}`);
      next(error);
    }
  },

  updateStatutDemande: async (req, res, next) => {
    try {
      const updatedDemande = await demandeProduitService.updateStatutDemandeProduit(
        req.params.id,
        req.body.status
      );
      res.json(updatedDemande);
    } catch (error) {
      logger.error(`Erreur dans updateStatutDemande: ${error.message}`);
      next(error);
    }
  }
};