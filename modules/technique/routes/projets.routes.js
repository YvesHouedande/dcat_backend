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
router.get("/", projetsController.getAllProjets);
router.get("/:id", projetsController.getProjetById);
router.post("/", projetsController.createProjet);
router.put("/:id", projetsController.updateProjet);
router.delete("/:id", projetsController.deleteProjet);

// Routes pour la gestion des documents
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

router.get("/:id/documents", projetsController.getProjetDocuments);
router.delete("/:id/documents/:documentId", projetsController.deleteDocument);

// Routes pour la gestion des partenaires
router.post("/:id/partenaires", projetsController.addPartenaireToProjet);
router.delete("/:id/partenaires/:partenaireId", projetsController.removePartenaireFromProjet);
router.get("/:id/partenaires", projetsController.getProjetPartenaires);
router.get("/:id/livrables-with-documents", projetsController.getProjetLivrablesWithDocuments);

module.exports = router;
