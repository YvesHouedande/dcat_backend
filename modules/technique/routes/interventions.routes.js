const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const interventionsController = require('../controllers/interventions.controller');
const uploadMiddleware = require("../utils/middleware/uploadMiddleware");

// Définition des chemins de stockage
const UPLOAD_PATHS = {
  INTERVENTIONS: 'media/documents/technique/interventions'
};

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "Erreur lors du téléchargement du fichier",
      error: err.message
    });
  }
  next(err);
};

// Routes CRUD de base
router.get("/", interventionsController.getAllInterventions);
router.get("/:id", interventionsController.getInterventionById);
router.post("/", interventionsController.createIntervention);
router.put("/:id", interventionsController.updateIntervention);
router.delete("/:id", interventionsController.deleteIntervention);

// Route pour les documents avec gestion des erreurs d'upload
router.post("/:id/documents",
  (req, res, next) => {
    try {
      // Définir le chemin avant l'upload
      req.uploadPath = path.join(process.cwd(), UPLOAD_PATHS.INTERVENTIONS);
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadMiddleware.single("document"),
  interventionsController.addDocumentToIntervention
);

// Routes pour la gestion des employés
router.post("/:id/employes", interventionsController.addEmployeToIntervention);
router.delete("/:id/employes/:employeId", interventionsController.removeEmployeFromIntervention);
router.get("/:id/employes", interventionsController.getInterventionEmployes);


// Routes pour la gestion des documents
router.get("/:id/documents", interventionsController.getInterventionDocuments);
router.delete("/:id/documents/:documentId", interventionsController.deleteDocument);


module.exports = router;
