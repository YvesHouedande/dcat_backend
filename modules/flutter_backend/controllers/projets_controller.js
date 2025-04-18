const projectsService = require('../services/projets_service');
const logger = require('../../../core/utils/logger');

module.exports = {
  getAllProjects: async (req, res, next) => {
    try {
      const projects = await projectsService.getAllProjects();
      res.json(projects);
    } catch (error) {
      logger.error(`Erreur dans getAllProjects: ${error.message}`);
      next(error);
    }
  },

  getProjectById: async (req, res, next) => {
    try {
      const project = await projectsService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      res.json(project);
    } catch (error) {
      logger.error(`Erreur dans getProjectById: ${error.message}`);
      next(error);
    }
  },

  createProject: async (req, res, next) => {
    try {
      const newProject = await projectsService.createProject(req.body);
      res.status(201).json(newProject);
    } catch (error) {
      logger.error(`Erreur dans createProject: ${error.message}`);
      next(error);
    }
  },

  updateProject: async (req, res, next) => {
    try {
      const updatedProject = await projectsService.updateProject(req.params.id, req.body);
      res.json(updatedProject);
    } catch (error) {
      logger.error(`Erreur dans updateProject: ${error.message}`);
      next(error);
    }
  },

  deleteProject: async (req, res, next) => {
    try {
      await projectsService.deleteProject(req.params.id);
      res.status(204).send("suppression réussie");
    } catch (error) {
      logger.error(`Erreur dans deleteProject: ${error.message}`);
      next(error);
    }
  },


  searchProjets: async (req, res, next) => {
    try {
      const projets = await projetService.searchProjets(req.query);
      res.json(projets);
    } catch (error) {
      logger.error(`Erreur searchProjets: ${error.message}`);
      next(error);
    }
  },
  
  getProjetDetails: async (req, res, next) => {
    try {
      const details = await projetService.getProjetDetails(req.params.id);
      res.json(details);
    } catch (error) {
      logger.error(`Erreur getProjetDetails: ${error.message}`);
      next(error);
    }
  },

  getProjetsByCompletion: async (req, res, next) => {
    try {
      const isCompleted = req.query.status === 'completed';
      const projets = await projetService.getProjetsByCompletion(isCompleted);
      res.json(projets);
    } catch (error) {
      logger.error(`Erreur getProjetsByCompletion: ${error.message}`);
      next(error);
    }
  },
  
  getProjectStats: async (req, res, next) => {
    try {
      const stats = await projetService.getProjectStats();
      res.json(stats);
    } catch (error) {
      logger.error(`Erreur getProjectStats: ${error.message}`);
      next(error);
    }
  }

};