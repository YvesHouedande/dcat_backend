const servicesDcatService = require('../services/services_dcat.service');
const path = require('path');
const fs = require('fs').promises;

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
    let uploadedImagePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: "L'image est requise" 
        });
      }

      if (!req.body.titre_service || !req.body.sous_titre_service || !req.body.detail) {
        // Si l'image a été uploadée mais que les autres données sont manquantes,
        // on supprime l'image pour éviter de la conserver inutilement
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({ 
          success: false, 
          error: "le titre, sous-titre et detail sont requis",
          received: {
            titre_service: !!req.body.titre_service,
            sous_titre_service: !!req.body.sous_titre_service,
            detail: !!req.body.detail
          }
        });
      }

      if (req.body.titre_service.length > 100) {
        // Supprimer l'image si la validation échoue
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }
      
      if (req.body.sous_titre_service.length > 200) {
        // Supprimer l'image si la validation échoue
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          error: "Le sous-titre ne doit pas dépasser 50 caractères"
        });
      }

      const relativePath = path.join('media/images/services_dcat', req.file.filename)
        .replace(/\\/g, '/');
      
      // Sauvegarder le chemin complet de l'image pour pouvoir la supprimer en cas d'erreur
      uploadedImagePath = path.join(process.cwd(), relativePath);

      const serviceData = {
        titre: req.body.titre_service.trim(),
        sous_titre: req.body.sous_titre_service.trim(),
        detail: req.body.detail.trim(),
        image: relativePath
      };

      const service = await servicesDcatService.createService(serviceData);
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      // En cas d'erreur, on supprime l'image si elle a été uploadée
      if (uploadedImagePath) {
        try {
          await fs.unlink(uploadedImagePath);
        } catch (unlinkError) {
          // Si la suppression de l'image échoue, on ne fait rien de plus
        }
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la création du service",
        details: error.message
      });
    }
  },

  updateService: async (req, res) => {
    const id = parseInt(req.params.id);
    let uploadedImagePath = null;
    
    if (isNaN(id)) {
      // Supprimer l'image si la validation échoue et qu'une nouvelle image a été envoyée
      if (req.file && req.file.path) {
        await fs.unlink(req.file.path);
      }
      
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      if (!req.body.titre_service || !req.body.detail || !req.body.sous_titre_service) {
        // Supprimer l'image si la validation échoue et qu'une nouvelle image a été envoyée
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({ 
          success: false, 
          error: "Titre, sous-titre et detail sont requis" 
        });
      }

      if (req.body.titre_service.length > 50) {
        // Supprimer l'image si la validation échoue et qu'une nouvelle image a été envoyée
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }
      
      if (req.body.sous_titre_service.length > 50) {
        // Supprimer l'image si la validation échoue et qu'une nouvelle image a été envoyée
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          error: "Le sous-titre ne doit pas dépasser 50 caractères"
        });
      }

      const serviceData = {
        titre: req.body.titre_service.trim(),
        sous_titre: req.body.sous_titre_service.trim(),
        detail: req.body.detail.trim()
      };

      if (req.file) {
        const relativePath = path.join('media/images/services_dcat', req.file.filename)
          .replace(/\\/g, '/');
        serviceData.image = relativePath;
        
        // Sauvegarder le chemin complet de l'image pour pouvoir la supprimer en cas d'erreur
        uploadedImagePath = path.join(process.cwd(), relativePath);
      }

      const service = await servicesDcatService.updateService(id, serviceData);
      if (!service) {
        // Supprimer l'image si le service n'existe pas et qu'une nouvelle image a été envoyée
        if (uploadedImagePath) {
          await fs.unlink(uploadedImagePath);
        }
        
        return res.status(404).json({ success: false, error: "Service non trouvé" });
      }
      
      res.json({ success: true, data: service });
    } catch (error) {
      // En cas d'erreur, on supprime la nouvelle image si elle a été uploadée
      if (uploadedImagePath) {
        try {
          await fs.unlink(uploadedImagePath);
        } catch (unlinkError) {
          // Si la suppression de l'image échoue, on ne fait rien de plus
        }
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour du service",
        details: error.message
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
        error: "Erreur lors de la suppression du service",
        details: error.message 
      });
    }
  }
};

module.exports = servicesDcatController;