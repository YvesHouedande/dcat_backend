const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const livrableController = require("../controllers/livrable.controller");
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

const UPLOAD_PATHS = {
  LIVRABLES: 'media/documents/technique/livrables'
};

// CRUD Livrable
/**
 * @swagger
 * /api/livrables:
 *   get:
 *     summary: Liste tous les livrables
 *     tags: [Livrables]
 */
router.get("/", livrableController.getAllLivrables);

/**
 * @swagger
 * /api/livrables/{id}:
 *   get:
 *     summary: Récupère un livrable par son ID
 *     tags: [Livrables]
 */
router.get("/:id", livrableController.getLivrableById);

/**
 * @swagger
 * /api/livrables:
 *   post:
 *     summary: Crée un nouveau livrable
 *     tags: [Livrables]
 */
router.post("/", livrableController.createLivrable);

/**
 * @swagger
 * /api/livrables/{id}:
 *   put:
 *     summary: Met à jour un livrable
 *     tags: [Livrables]
 */
router.put("/:id", livrableController.updateLivrable);

/**
 * @swagger
 * /api/livrables/{id}:
 *   delete:
 *     summary: Supprime un livrable
 *     tags: [Livrables]
 */
router.delete("/:id", livrableController.deleteLivrable);

// Documents liés au livrable
/**
 * @swagger
 * /api/livrables/{id}/documents:
 *   post:
 *     summary: Ajoute un document à un livrable
 *     tags: [Livrables]
 */
router.post("/:id/documents",
  (req, res, next) => {
    try {
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.LIVRABLES);
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
  livrableController.addDocumentToLivrable
);

/**
 * @swagger
 * /api/livrables/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un livrable
 *     tags: [Livrables]
 */
router.get("/:id/documents", livrableController.getLivrableDocuments);

/**
 * @swagger
 * /api/livrables/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'un livrable
 *     tags: [Livrables]
 */
router.delete("/:id/documents/:documentId", livrableController.deleteDocument);

module.exports = router;