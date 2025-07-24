/**
 * @swagger
 * tags:
 *   name: Rangement
 *   description: API pour la gestion des dossiers et documents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dossier:
 *       type: object
 *       required:
 *         - libelle_dossier
 *         - type_dossier
 *       properties:
 *         id_dossier:
 *           type: integer
 *           description: Identifiant unique du dossier
 *         libelle_dossier:
 *           type: string
 *           maxLength: 100
 *           description: Nom du dossier
 *         type_dossier:
 *           type: string
 *           maxLength: 50
 *           description: Type du dossier
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de modification
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *           description: Identifiant unique du document
 *         libelle_document:
 *           type: string
 *           maxLength: 100
 *           description: Nom du document
 *         date_document:
 *           type: string
 *           maxLength: 50
 *           description: Date du document
 *         lien_document:
 *           type: string
 *           maxLength: 255
 *           description: Lien vers le document
 *         etat_document:
 *           type: string
 *           maxLength: 50
 *           enum: [Actif, Archive]
 *           default: Actif
 *           description: État du document
 *         id_dossier:
 *           type: integer
 *           description: Identifiant du dossier parent
 */

/**
 * @swagger
 * /administration/rangement/create:
 *   post:
 *     summary: Créer un nouveau dossier
 *     description: Création d'un nouveau dossier
 *     tags: [Rangement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelle_dossier
 *               - type_dossier
 *             properties:
 *               libelle_dossier:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nom du dossier
 *               type_dossier:
 *                 type: string
 *                 maxLength: 50
 *                 description: Type du dossier
 *     responses:
 *       201:
 *         description: Dossier créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement:
 *   get:
 *     summary: Récupérer tous les dossiers
 *     description: Liste paginée de tous les dossiers
 *     tags: [Rangement]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des dossiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dossier'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 42
 *               data:
 *                 - id_dossier: 1
 *                   libelle_dossier: "Dossier A"
 *                   type_dossier: "Contrat"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *                 - id_dossier: 2
 *                   libelle_dossier: "Dossier B"
 *                   type_dossier: "Facture"
 *                   created_at: "2024-03-02T12:00:00Z"
 *                   updated_at: "2024-03-02T12:00:00Z"
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/{id}:
 *   get:
 *     summary: Récupérer un dossier par ID
 *     description: Détails d'un dossier spécifique
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dossier trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/{id}:
 *   put:
 *     summary: Mettre à jour un dossier
 *     description: Modification des informations d'un dossier
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle_dossier:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nouveau nom du dossier
 *               type_dossier:
 *                 type: string
 *                 maxLength: 50
 *                 description: Nouveau type du dossier
 *     responses:
 *       200:
 *         description: Dossier mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/{id}:
 *   delete:
 *     summary: Supprimer un dossier
 *     description: Suppression d'un dossier et ses documents
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dossier supprimé
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/document/{id}:
 *   delete:
 *     summary: Supprimer un document
 *     description: Suppression d'un document spécifique
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du document
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document supprimé
 *       404:
 *         description: Document non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/type/{type}:
 *   get:
 *     summary: Récupérer les dossiers par type
 *     description: Liste paginée des dossiers d'un type spécifique
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type de dossier
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des dossiers du type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dossier'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 42
 *               data:
 *                 - id_dossier: 1
 *                   libelle_dossier: "Dossier A"
 *                   type_dossier: "Contrat"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *                 - id_dossier: 2
 *                   libelle_dossier: "Dossier B"
 *                   type_dossier: "Facture"
 *                   created_at: "2024-03-02T12:00:00Z"
 *                   updated_at: "2024-03-02T12:00:00Z"
 *       404:
 *         description: Aucun dossier trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/documents/{id}:
 *   get:
 *     summary: Récupérer les documents d'un dossier (paginé)
 *     description: Retourne la liste paginée des documents associés à un dossier spécifique. Les paramètres de pagination sont optionnels.
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des documents du dossier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 42
 *               data:
 *                 - id_documents: 1
 *                   libelle_document: "Contrat 2024"
 *                   date_document: "2024-03-01"
 *                   lien_document: "media/documents/contrat2024.pdf"
 *                   etat_document: "Actif"
 *                   id_dossier: 2
 *                 - id_documents: 2
 *                   libelle_document: "Facture Janvier"
 *                   date_document: "2024-01-15"
 *                   lien_document: "media/documents/facture_janvier.pdf"
 *                   etat_document: "Actif"
 *                   id_dossier: 2
 *       500:
 *         description: Erreur serveur
 */

const express = require('express');
const router = express.Router();
const rangementController = require('../controllers/rangement.controller');
const { protect } = require('../../../../core/auth/middleware');

router.post('/create',rangementController.createDossier);
router.get('/', rangementController.getDossiers);
router.get('/:id', rangementController.getDossierById);
router.put('/:id', rangementController.updateDossier);
router.delete('/:id', rangementController.deleteDossier);
router.delete('/document/:id', rangementController.deleteDocumentById);
router.get('/type/:type', rangementController.getDossierByType);
router.get('/documents/:id', rangementController.getdocumentsBydossier);

module.exports = router;
