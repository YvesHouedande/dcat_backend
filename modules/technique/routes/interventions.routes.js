const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const interventionsController = require('../controllers/interventions.controller');
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

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
/**
 * @swagger
 * /api/interventions:
 *   get:
 *     summary: Liste toutes les interventions
 *     tags: [Interventions]
 */
router.get("/", interventionsController.getAllInterventions);

/**
 * @swagger
 * /api/interventions/{id}:
 *   get:
 *     summary: Récupère une intervention par son ID
 *     tags: [Interventions]
 */
router.get("/:id", interventionsController.getInterventionById);

/**
 * @swagger
 * /api/interventions:
 *   post:
 *     summary: Crée une nouvelle intervention
 *     tags: [Interventions]
 */
router.post("/", interventionsController.createIntervention);

/**
 * @swagger
 * /api/interventions/{id}:
 *   put:
 *     summary: Met à jour une intervention
 *     tags: [Interventions]
 */
router.put("/:id", interventionsController.updateIntervention);

/**
 * @swagger
 * /api/interventions/{id}:
 *   delete:
 *     summary: Supprime une intervention
 *     tags: [Interventions]
 */
router.delete("/:id", interventionsController.deleteIntervention);

// Route pour les documents avec gestion des erreurs d'upload
/**
 * @swagger
 * /api/interventions/{id}/documents:
 *   post:
 *     summary: Ajoute un document à une intervention
 *     tags: [Interventions]
 */
router.post("/:id/documents",
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.INTERVENTIONS);
      
      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      req.uploadPath = uploadPath;
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadMiddleware.single("document"),
  interventionsController.addDocumentToIntervention
);

// Routes pour la gestion des employés
/**
 * @swagger
 * /api/interventions/{id}/employes:
 *   post:
 *     summary: Ajoute un employé à une intervention
 *     tags: [Interventions]
 */
router.post("/:id/employes", interventionsController.addEmployeToIntervention);

/**
 * @swagger
 * /api/interventions/{id}/employes/{employeId}:
 *   delete:
 *     summary: Retire un employé d'une intervention
 *     tags: [Interventions]
 */
router.delete("/:id/employes/:employeId", interventionsController.removeEmployeFromIntervention);

/**
 * @swagger
 * /api/interventions/{id}/employes:
 *   get:
 *     summary: Récupère les employés d'une intervention
 *     tags: [Interventions]
 */
router.get("/:id/employes", interventionsController.getInterventionEmployes);


// Routes pour la gestion des documents
/**
 * @swagger
 * /api/interventions/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'une intervention
 *     tags: [Interventions]
 */
router.get("/:id/documents", interventionsController.getInterventionDocuments);

/**
 * @swagger
 * /api/interventions/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'une intervention
 *     tags: [Interventions]
 */
router.delete("/:id/documents/:documentId", interventionsController.deleteDocument);


module.exports = router;
