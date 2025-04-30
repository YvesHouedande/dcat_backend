const servicesDcatService = require('../services/services_dcat.service');
const path = require('path');

const servicesDcatController = {
  getAllServices: async (req, res) => {
    try {
      const services = await servicesDcatService.getAllServices();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération des services" 
      });
    }
  },

  getServiceById: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      const service = await servicesDcatService.getServiceById(id);
      if (!service) {
        return res.status(404).json({ success: false, error: "Service non trouvé" });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération du service" 
      });
    }
  },

  createService: async (req, res) => {
    try {
      if (!req.file || !req.body.titre_service || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          error: "Titre, description et image sont requis" 
        });
      }

      if (req.body.titre_service.length > 50) {
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }

      const relativePath = path.join('media/images/services_dcat', req.file.filename)
        .replace(/\\/g, '/');

      const serviceData = {
        titre_service: req.body.titre_service.trim(),
        description: req.body.description.trim(),
        image: relativePath
      };

      const service = await servicesDcatService.createService(serviceData);
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la création du service" 
      });
    }
  },

  updateService: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      if (!req.body.titre_service || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          error: "Titre et description sont requis" 
        });
      }

      if (req.body.titre_service.length > 50) {
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }

      const serviceData = {
        titre_service: req.body.titre_service.trim(),
        description: req.body.description.trim()
      };

      if (req.file) {
        const relativePath = path.join('media/images/services_dcat', req.file.filename)
          .replace(/\\/g, '/');
        serviceData.image = relativePath;
      }

      const service = await servicesDcatService.updateService(id, serviceData);
      if (!service) {
        return res.status(404).json({ success: false, error: "Service non trouvé" });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour du service" 
      });
    }
  },

  deleteService: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      const deleted = await servicesDcatService.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Service non trouvé" });
      }
      res.json({ success: true, message: "Service supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la suppression du service" 
      });
    }
  }
};

module.exports = servicesDcatController;