const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const livrableController = require("../controllers/livrable.controller");
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

// Définition des chemins de stockage
const UPLOAD_PATHS = {
  LIVRABLES: 'media/documents/technique/livrables'
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Livrable:
 *       type: object
 *       properties:
 *         id_livrable:
 *           type: integer
 *           description: ID unique du livrable
 *         libelle_livrable:
 *           type: string
 *           description: Libellé du livrable
 *         date:
 *           type: string
 *           format: date
 *           description: Date du livrable
 *         realisations:
 *           type: string
 *           description: Réalisations liées au livrable
 *         reserves:
 *           type: string
 *           description: Réserves émises sur le livrable
 *         approbation:
 *           type: string
 *           description: Approbation du livrable
 *         recommandation:
 *           type: string
 *           description: Recommandations pour le livrable
 *         id_projet:
 *           type: integer
 *           description: ID du projet auquel le livrable est rattaché
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'enregistrement
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *           description: ID unique du document
 *         libelle_document:
 *           type: string
 *           description: Libellé du document
 *         classification_document:
 *           type: string
 *           description: Classification du document
 *         date_document:
 *           type: string
 *           description: Date du document
 *         lien_document:
 *           type: string
 *           description: Chemin d'accès au document
 *         etat_document:
 *           type: string
 *           description: État du document (Actif, Archivé)
 */

/**
 * @swagger
 * /api/livrables:
 *   get:
 *     summary: Liste tous les livrables
 *     description: Récupère la liste complète des livrables avec leurs informations
 *     tags: [Livrables]
 *     responses:
 *       200:
 *         description: Liste des livrables récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 livrables:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Livrable'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", livrableController.getAllLivrables);

/**
 * @swagger
 * /api/livrables/{id}:
 *   get:
 *     summary: Récupère un livrable par son ID
 *     description: Retourne les détails d'un livrable spécifique
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 *     responses:
 *       200:
 *         description: Détails du livrable récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 livrable:
 *                   $ref: '#/components/schemas/Livrable'
 *       404:
 *         description: Livrable non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", livrableController.getLivrableById);

/**
 * @swagger
 * /api/livrables:
 *   post:
 *     summary: Crée un nouveau livrable
 *     description: Enregistre un nouveau livrable dans le système
 *     tags: [Livrables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelle_livrable
 *               - id_projet
 *             properties:
 *               libelle_livrable:
 *                 type: string
 *                 description: Libellé du livrable
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du livrable (YYYY-MM-DD)
 *               realisations:
 *                 type: string
 *                 description: Réalisations liées au livrable
 *               reserves:
 *                 type: string
 *                 description: Réserves émises sur le livrable
 *               approbation:
 *                 type: string
 *                 description: Approbation du livrable
 *               recommandation:
 *                 type: string
 *                 description: Recommandations pour le livrable
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel le livrable est rattaché
 *     responses:
 *       201:
 *         description: Livrable créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 livrable:
 *                   $ref: '#/components/schemas/Livrable'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", livrableController.createLivrable);

/**
 * @swagger
 * /api/livrables/{id}:
 *   put:
 *     summary: Met à jour un livrable
 *     description: Modifie les informations d'un livrable existant
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle_livrable:
 *                 type: string
 *                 description: Libellé du livrable
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du livrable (YYYY-MM-DD)
 *               realisations:
 *                 type: string
 *                 description: Réalisations liées au livrable
 *               reserves:
 *                 type: string
 *                 description: Réserves émises sur le livrable
 *               approbation:
 *                 type: string
 *                 description: Approbation du livrable
 *               recommandation:
 *                 type: string
 *                 description: Recommandations pour le livrable
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel le livrable est rattaché
 *     responses:
 *       200:
 *         description: Livrable mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 livrable:
 *                   $ref: '#/components/schemas/Livrable'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Livrable non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", livrableController.updateLivrable);

/**
 * @swagger
 * /api/livrables/{id}:
 *   delete:
 *     summary: Supprime un livrable
 *     description: Supprime un livrable existant par son ID
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable à supprimer
 *     responses:
 *       200:
 *         description: Livrable supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Livrable supprimé avec succès
 *       404:
 *         description: Livrable non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", livrableController.deleteLivrable);

/**
 * @swagger
 * /api/livrables/{id}/documents:
 *   post:
 *     summary: Ajoute un document à un livrable
 *     description: Télécharge et associe un document à un livrable existant
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - libelle_document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à télécharger
 *               libelle_document:
 *                 type: string
 *                 description: Nom du document
 *               classification_document:
 *                 type: string
 *                 description: Classification du document
 *               date_document:
 *                 type: string
 *                 description: Date du document
 *               id_nature_document:
 *                 type: integer
 *                 description: ID de la nature du document
 *     responses:
 *       201:
 *         description: Document ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 document:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Données invalides ou erreur de téléchargement
 *       404:
 *         description: Livrable non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/documents",
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.LIVRABLES);
      
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
  livrableController.addDocumentToLivrable
);

/**
 * @swagger
 * /api/livrables/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un livrable
 *     description: Retourne la liste des documents associés à un livrable spécifique
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livrable
 *     responses:
 *       200:
 *         description: Liste des documents récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       404:
 *         description: Livrable non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/documents", livrableController.getLivrableDocuments);

/**
 * @swagger
 * /api/livrables/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'un livrable
 *     description: Supprime un document associé à un livrable spécifique
 *     tags: [Livrables]
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
 *         description: ID du document à supprimer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document supprimé avec succès
 *       404:
 *         description: Livrable ou document non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/documents/:documentId", livrableController.deleteDocument);

/**
 * @swagger
 * /api/livrables/projet/{projetId}:
 *   get:
 *     summary: Récupère les livrables associés à un projet
 *     description: Retourne la liste des livrables appartenant à un projet spécifique
 *     tags: [Livrables]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des livrables du projet récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 livrables:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Livrable'
 *       404:
 *         description: Projet non trouvé ou aucun livrable associé
 *       500:
 *         description: Erreur serveur
 */
router.get("/projet/:projetId", livrableController.getLivrablesByProjet);

module.exports = router;