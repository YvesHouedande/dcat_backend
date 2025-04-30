const affichesService = require('../services/affiches.service');
const path = require('path');

const affichesController = {
  getAllAffiches: async (req, res) => {
    try {
      const affiches = await affichesService.getAllAffiches();
      res.json({ success: true, data: affiches });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération des affiches" 
      });
    }
  },

  getAfficheById: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      const affiche = await affichesService.getAfficheById(id);
      if (!affiche) {
        return res.status(404).json({ success: false, error: "Affiche non trouvée" });
      }
      res.json({ success: true, data: affiche });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération de l'affiche" 
      });
    }
  },

  createAffiche: async (req, res) => {
    try {
      // Validation des champs requis
      if (!req.file || !req.body.titre || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          error: "Titre, description et image sont requis" 
        });
      }

      // Validation de la longueur du titre
      if (req.body.titre.length > 50) {
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }

      const relativePath = path.join('media/images/affiches_dcat', req.file.filename)
        .replace(/\\/g, '/');

      const afficheData = {
        titre: req.body.titre.trim(),
        description: req.body.description.trim(),
        image: relativePath
      };

      const affiche = await affichesService.createAffiche(afficheData);
      res.status(201).json({ success: true, data: affiche });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la création de l'affiche" 
      });
    }
  },

  updateAffiche: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      if (!req.body.titre || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          error: "Titre et description sont requis" 
        });
      }

      if (req.body.titre.length > 50) {
        return res.status(400).json({
          success: false,
          error: "Le titre ne doit pas dépasser 50 caractères"
        });
      }

      const afficheData = {
        titre: req.body.titre.trim(),
        description: req.body.description.trim()
      };

      if (req.file) {
        const relativePath = path.join('media/images/affiches_dcat', req.file.filename)
          .replace(/\\/g, '/');
        afficheData.image = relativePath;
      }

      const affiche = await affichesService.updateAffiche(id, afficheData);
      if (!affiche) {
        return res.status(404).json({ success: false, error: "Affiche non trouvée" });
      }
      res.json({ success: true, data: affiche });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de l'affiche" 
      });
    }
  },

  deleteAffiche: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    try {
      const deleted = await affichesService.deleteAffiche(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Affiche non trouvée" });
      }
      res.json({ success: true, message: "Affiche supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la suppression de l'affiche" 
      });
    }
  }
};

module.exports = affichesController;