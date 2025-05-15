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

/**
 * @swagger
 * components:
 *   schemas:
 *     Projet:
 *       type: object
 *       properties:
 *         id_projet:
 *           type: integer
 *           description: ID unique du projet
 *         nom_projet:
 *           type: string
 *           description: Nom du projet
 *         type_projet:
 *           type: string
 *           description: Type de projet
 *         devis_estimatif:
 *           type: number
 *           format: float
 *           description: Montant estimatif du projet
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début du projet
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin prévue du projet
 *         duree_prevu_projet:
 *           type: string
 *           description: Durée prévue du projet
 *         description_projet:
 *           type: string
 *           description: Description détaillée du projet
 *         etat:
 *           type: string
 *           description: État actuel du projet (En cours, Terminé, etc.)
 *         lieu:
 *           type: string
 *           description: Lieu de réalisation du projet
 *         responsable:
 *           type: string
 *           description: Responsable du projet
 *         site:
 *           type: string
 *           description: Site du projet
 *         id_famille:
 *           type: integer
 *           description: ID de la famille du projet
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
 *     Partenaire:
 *       type: object
 *       properties:
 *         id_partenaire:
 *           type: integer
 *           description: ID unique du partenaire
 *         nom_partenaire:
 *           type: string
 *           description: Nom du partenaire
 *         telephone_partenaire:
 *           type: string
 *           description: Numéro de téléphone du partenaire
 *         email_partenaire:
 *           type: string
 *           description: Email du partenaire
 *         specialite:
 *           type: string
 *           description: Spécialité du partenaire
 *         localisation:
 *           type: string
 *           description: Localisation du partenaire
 *         type_partenaire:
 *           type: string
 *           description: Type de partenaire
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
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *           description: Documents associés au livrable
 */

/**
 * @swagger
 * /api/marketing_commercial/projets:
 *   get:
 *     summary: Liste tous les projets
 *     description: Récupère la liste complète des projets avec leurs informations
 *     tags: [Projets]
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Projet'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", projetsController.getAllProjets);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}:
 *   get:
 *     summary: Récupère un projet par son ID
 *     description: Retourne les détails d'un projet spécifique
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Détails du projet récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projet:
 *                   $ref: '#/components/schemas/Projet'
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", projetsController.getProjetById);

/**
 * @swagger
 * /api/marketing_commercial/projets:
 *   post:
 *     summary: Crée un nouveau projet
 *     description: Enregistre un nouveau projet technique
 *     tags: [Projets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_projet
 *               - type_projet
 *             properties:
 *               nom_projet:
 *                 type: string
 *                 description: Nom du projet
 *               type_projet:
 *                 type: string
 *                 description: Type de projet
 *               devis_estimatif:
 *                 type: number
 *                 format: float
 *                 description: Montant estimatif du projet
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début du projet
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue du projet
 *               duree_prevu_projet:
 *                 type: string
 *                 description: Durée prévue du projet
 *               description_projet:
 *                 type: string
 *                 description: Description détaillée du projet
 *               etat:
 *                 type: string
 *                 description: État actuel du projet
 *               lieu:
 *                 type: string
 *                 description: Lieu de réalisation du projet
 *               responsable:
 *                 type: string
 *                 description: Responsable du projet
 *               site:
 *                 type: string
 *                 description: Site du projet
 *               id_famille:
 *                 type: integer
 *                 description: ID de la famille du projet
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projet:
 *                   $ref: '#/components/schemas/Projet'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", projetsController.createProjet);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}:
 *   put:
 *     summary: Met à jour un projet
 *     description: Modifie les informations d'un projet existant
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_projet:
 *                 type: string
 *                 description: Nom du projet
 *               type_projet:
 *                 type: string
 *                 description: Type de projet
 *               devis_estimatif:
 *                 type: number
 *                 format: float
 *                 description: Montant estimatif du projet
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début du projet
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue du projet
 *               duree_prevu_projet:
 *                 type: string
 *                 description: Durée prévue du projet
 *               description_projet:
 *                 type: string
 *                 description: Description détaillée du projet
 *               etat:
 *                 type: string
 *                 description: État actuel du projet
 *               lieu:
 *                 type: string
 *                 description: Lieu de réalisation du projet
 *               responsable:
 *                 type: string
 *                 description: Responsable du projet
 *               site:
 *                 type: string
 *                 description: Site du projet
 *               id_famille:
 *                 type: integer
 *                 description: ID de la famille du projet
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projet:
 *                   $ref: '#/components/schemas/Projet'
 *       404:
 *         description: Projet non trouvé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", projetsController.updateProjet);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}:
 *   delete:
 *     summary: Supprime un projet
 *     description: Supprime un projet existant par son ID
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet à supprimer
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
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
 *                   example: Projet supprimé avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", projetsController.deleteProjet);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/documents:
 *   post:
 *     summary: Ajoute un document à un projet
 *     description: Télécharge et associe un document à un projet existant
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
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
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
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
 * /api/marketing_commercial/projets/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un projet
 *     description: Retourne la liste des documents associés à un projet spécifique
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
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
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/documents", projetsController.getProjetDocuments);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'un projet
 *     description: Supprime un document associé à un projet spécifique
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
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
 *         description: Projet ou document non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/documents/:documentId", projetsController.deleteDocument);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/partenaires:
 *   post:
 *     summary: Ajoute un partenaire à un projet
 *     description: Associe un partenaire à un projet existant
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_partenaire
 *             properties:
 *               id_partenaire:
 *                 type: integer
 *                 description: ID du partenaire à associer
 *     responses:
 *       201:
 *         description: Partenaire ajouté avec succès
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
 *                   example: Partenaire ajouté au projet avec succès
 *       400:
 *         description: Données invalides ou association déjà existante
 *       404:
 *         description: Projet ou partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/partenaires", projetsController.addPartenaireToProjet);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/partenaires/{partenaireId}:
 *   delete:
 *     summary: Retire un partenaire d'un projet
 *     description: Dissocie un partenaire d'un projet existant
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *       - in: path
 *         name: partenaireId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du partenaire à retirer
 *     responses:
 *       200:
 *         description: Partenaire retiré avec succès
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
 *                   example: Partenaire retiré du projet avec succès
 *       404:
 *         description: Projet, partenaire ou association non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/partenaires/:partenaireId", projetsController.removePartenaireFromProjet);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/partenaires:
 *   get:
 *     summary: Récupère les partenaires d'un projet
 *     description: Retourne la liste des partenaires associés à un projet spécifique
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des partenaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 partenaires:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partenaire'
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/partenaires", projetsController.getProjetPartenaires);

/**
 * @swagger
 * /api/marketing_commercial/projets/{id}/livrables-with-documents:
 *   get:
 *     summary: Récupère les livrables avec documents d'un projet
 *     description: Retourne la liste des livrables avec leurs documents associés pour un projet spécifique
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des livrables avec documents récupérée avec succès
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
 *         description: Projet non trouvé ou aucun livrable disponible
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/livrables-with-documents", projetsController.getProjetLivrablesWithDocuments);

module.exports = router;
