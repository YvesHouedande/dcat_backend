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
 * /technique/livrables:
 *   get:
 *     summary: Liste tous les livrables
 *     tags:
 *       - Livrables
 */
router.get("/", livrableController.getAllLivrables);

/**
 * @swagger
 * /technique/livrables/{id}:
 *   get:
 *     summary: Récupère un livrable par son ID
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 */
router.get("/:id", livrableController.getLivrableById);

/**
 * @swagger
 * /technique/livrables:
 *   post:
 *     summary: Crée un nouveau livrable
 *     tags:
 *       - Livrables
 */
router.post("/", livrableController.createLivrable);

/**
 * @swagger
 * /technique/livrables/{id}:
 *   put:
 *     summary: Met à jour un livrable
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 */
router.put("/:id", livrableController.updateLivrable);

/**
 * @swagger
 * /technique/livrables/{id}:
 *   delete:
 *     summary: Supprime un livrable
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 */
router.delete("/:id", livrableController.deleteLivrable);

// Documents liés au livrable
/**
 * @swagger
 * /technique/livrables/{id}/documents:
 *   post:
 *     summary: Ajoute un document à un livrable
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
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
 * /technique/livrables/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un livrable
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 */
router.get("/:id/documents", livrableController.getLivrableDocuments);

/**
 * @swagger
 * /technique/livrables/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'un livrable
 *     tags:
 *       - Livrables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du document
 */
router.delete("/:id/documents/:documentId", livrableController.deleteDocument);

module.exports = router;