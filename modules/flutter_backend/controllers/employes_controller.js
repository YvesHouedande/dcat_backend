const employeService = require('../services/employes_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllEmployes: async (req, res, next) => {
    try {
      const employes = await employeService.getAllEmployes();
      res.json(employes);
    } catch (error) {
      logger.error(`Erreur dans getAllEmployes: ${error.message}`);
      next(error);
    }
  },

  getEmployeById: async (req, res, next) => {
    try {
      const employe = await employeService.getEmployeById(req.params.id);
      if (!employe) {
        return res.status(404).json({ message: 'Employé non trouvé' });
      }
      res.json(employe);
    } catch (error) {
      logger.error(`Erreur dans getEmployeById: ${error.message}`);
      next(error);
    }
  },

  getEmployeByKeycloakId: async (req, res, next) => {
    try {
      const employe = await employeService.getEmployeByKeycloakId(req.params.keycloakId);
      if (!employe) {
        return res.status(404).json({ message: 'Employé non trouvé' });
      }
      res.json(employe);
    } catch (error) {
      logger.error(`Erreur dans getEmployeByKeycloakId: ${error.message}`);
      next(error);
    }
  },

  createEmploye: async (req, res, next) => {
    try {
      logger.info(`Création d'un employé avec les données: ${JSON.stringify(req.body)}`);
      const newEmploye = await employeService.createEmploye(req.body);
      res.status(201).json(newEmploye);
    } catch (error) {
      logger.error(`Erreur dans createEmploye: ${error.message}`);
      next(error);
    }
  },

  updateEmploye: async (req, res, next) => {
    try {
      const updatedEmploye = await employeService.updateEmploye(req.params.id, req.body);
      res.json(updatedEmploye);
    } catch (error) {
      logger.error(`Erreur dans updateEmploye: ${error.message}`);
      next(error);
    }
  },

  deleteEmploye: async (req, res, next) => {
    try {
      await employeService.deleteEmploye(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur dans deleteEmploye: ${error.message}`);
      next(error);
    }
  },

  // Bonus: Employés par fonction
  getEmployesByFonctionId: async (req, res, next) => {
    try {
      const employes = await employeService.getEmployesByFonctionId(req.params.fonctionId);
      res.json(employes);
    } catch (error) {
      logger.error(`Erreur dans getEmployesByFonctionId: ${error.message}`);
      next(error);
    }
  },
};