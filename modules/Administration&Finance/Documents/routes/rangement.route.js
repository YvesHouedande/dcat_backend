/**
 * @swagger
 * tags:
 *   name: Rangement
 *   description: Gestion des dossiers et documents
 */

/**
 * @swagger
 * /administration/rangement/create:
 *   post:
 *     summary: Créer un nouveau dossier
 *     tags: [Rangement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_dossier:
 *                 type: string
 *               type_dossier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dossier créé avec succès
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement:
 *   get:
 *     summary: Récupérer tous les dossiers
 *     tags: [Rangement]
 *     responses:
 *       200:
 *         description: Liste des dossiers
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/rangement/{id}:
 *   get:
 *     summary: Récupérer un dossier par son ID
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dossier trouvé
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
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Dossier mis à jour
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
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *     summary: Supprimer un document par son ID
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *     tags: [Rangement]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des dossiers du type demandé
 *       404:
 *         description: Aucun dossier trouvé pour ce type
 *       500:
 *         description: Erreur serveur
 */

const express = require('express');
const router = express.Router();
const rangementController = require('../controllers/rangement.controller');

router.post('/create', rangementController.createDossier);
router.get('/', rangementController.getDossiers);
router.get('/:id', rangementController.getDossierById);
router.put('/:id', rangementController.updateDossier);
router.delete('/:id', rangementController.deleteDossier);
router.delete('/document/:id', rangementController.deleteDocumentById);
router.get('/type/:type', rangementController.getDossierByType);

module.exports = router;
