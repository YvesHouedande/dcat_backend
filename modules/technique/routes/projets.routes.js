const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const projetsController = require("../controllers/projets.controller");
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

// Définition des chemins de stockage
const UPLOAD_PATHS = {
  PROJETS: 'media/documents/technique/projets'
};

// Routes CRUD de base
/**
 * @swagger
 * /api/projets:
 *   get:
 *     summary: Liste tous les projets
 *     tags: [Projets]
 */
router.get("/", projetsController.getAllProjets);

/**
 * @swagger
 * /api/projets/{id}:
 *   get:
 *     summary: Récupère un projet par son ID
 *     tags: [Projets]
 */
router.get("/:id", projetsController.getProjetById);

/**
 * @swagger
 * /api/projets:
 *   post:
 *     summary: Crée un nouveau projet
 *     tags: [Projets]
 */
router.post("/", projetsController.createProjet);

/**
 * @swagger
 * /api/projets/{id}:
 *   put:
 *     summary: Met à jour un projet
 *     tags: [Projets]
 */
router.put("/:id", projetsController.updateProjet);

/**
 * @swagger
 * /api/projets/{id}:
 *   delete:
 *     summary: Supprime un projet
 *     tags: [Projets]
 */
router.delete("/:id", projetsController.deleteProjet);

// Routes pour la gestion des documents
/**
 * @swagger
 * /api/projets/{id}/documents:
 *   post:
 *     summary: Ajoute un document à un projet
 *     tags: [Projets]
 */
router.post("/:id/documents",
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.PROJETS);
      
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
  projetsController.addDocumentToProjet
);

/**
 * @swagger
 * /api/projets/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un projet
 *     tags: [Projets]
 */
router.get("/:id/documents", projetsController.getProjetDocuments);

/**
 * @swagger
 * /api/projets/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'un projet
 *     tags: [Projets]
 */
router.delete("/:id/documents/:documentId", projetsController.deleteDocument);

// Routes pour la gestion des partenaires
/**
 * @swagger
 * /api/projets/{id}/partenaires:
 *   post:
 *     summary: Ajoute un partenaire à un projet
 *     tags: [Projets]
 */
router.post("/:id/partenaires", projetsController.addPartenaireToProjet);

/**
 * @swagger
 * /api/projets/{id}/partenaires/{partenaireId}:
 *   delete:
 *     summary: Retire un partenaire d'un projet
 *     tags: [Projets]
 */
router.delete("/:id/partenaires/:partenaireId", projetsController.removePartenaireFromProjet);

/**
 * @swagger
 * /api/projets/{id}/partenaires:
 *   get:
 *     summary: Récupère les partenaires d'un projet
 *     tags: [Projets]
 */
router.get("/:id/partenaires", projetsController.getProjetPartenaires);

/**
 * @swagger
 * /api/projets/{id}/livrables-with-documents:
 *   get:
 *     summary: Récupère les livrables avec documents d'un projet
 *     tags: [Projets]
 */
router.get("/:id/livrables-with-documents", projetsController.getProjetLivrablesWithDocuments);

module.exports = router;
