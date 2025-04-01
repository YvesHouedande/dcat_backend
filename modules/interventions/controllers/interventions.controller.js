const interventionService = require('../services/interventions.service');

module.exports = {
  getAll: (req, res, next) => {
    try {
      const interventions = interventionService.getAllInterventions();
      res.json(interventions);
    } catch (err) {
      next(err);
    }
  },
  create: (req, res, next) => {
    try {
      const newIntervention = interventionService.createIntervention(req.body);
      res.status(201).json(newIntervention);
    } catch (err) {
      next(err);
    }
  }
};