const produitService = require('../services/produits_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllProduits: async (req, res, next) => {
    try {
      const produits = await produitService.getAllProduits();
      res.json(produits);
    } catch (error) {
      logger.error(`Erreur dans getAllProduits: ${error.message}`);
      next(error);
    }
  },

  getProduitByIdAndCode: async (req, res, next) => {
    try {
      const produit = await produitService.getProduitByIdAndCode(
        parseInt(req.params.id),
        req.params.code
      );
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      res.json(produit);
    } catch (error) {
      logger.error(`Erreur dans getProduitByIdAndCode: ${error.message}`);
      next(error);
    }
  },

  createProduit: async (req, res, next) => {
    try {
      logger.info(`Création d'un produit avec les données: ${JSON.stringify(req.body)}`);
      const newProduit = await produitService.createProduit(req.body);
      res.status(201).json(newProduit);
    } catch (error) {
      logger.error(`Erreur dans createProduit: ${error.message}`);
      next(error);
    }
  },

  updateProduit: async (req, res, next) => {
    try {
      const updatedProduit = await produitService.updateProduit(
        parseInt(req.params.id),
        req.params.code,
        req.body
      );
      res.json(updatedProduit);
    } catch (error) {
      logger.error(`Erreur dans updateProduit: ${error.message}`);
      next(error);
    }
  },

  deleteProduit: async (req, res, next) => {
    try {
      await produitService.deleteProduit(
        parseInt(req.params.id),
        req.params.code
      );
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteProduit: ${error.message}`);
      next(error);
    }
  },

  // Bonus: Produits par famille
  getProduitsByFamilleId: async (req, res, next) => {
    try {
      const produits = await produitService.getProduitsByFamilleId(parseInt(req.params.familleId));
      res.json(produits);
    } catch (error) {
      logger.error(`Erreur dans getProduitsByFamilleId: ${error.message}`);
      next(error);
    }
  },
}; 