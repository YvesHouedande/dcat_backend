const express = require('express');
const router = express.Router();
const affichesController = require('../controllers/affiches.controller');
const uploadMiddleware = require('../../utils/middleware/uploadMiddleware');
const path = require('path');

// Configuration du chemin d'upload
router.use((req, res, next) => {
  req.uploadPath = path.join(process.cwd(), 'media/images/affiches_dcat');
  next();
});

/**
 * @swagger
 * /marketing_commercial/affiches:
 *   get:
 *     summary: Liste toutes les affiches
 *     tags:
 *       - Affiches
 */
router.get('/', affichesController.getAllAffiches);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   get:
 *     summary: Récupère une affiche par son ID
 *     tags:
 *       - Affiches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche
 */
router.get('/:id', affichesController.getAfficheById);

/**
 * @swagger
 * /marketing_commercial/affiches:
 *   post:
 *     summary: Crée une nouvelle affiche
 *     tags:
 *       - Affiches
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post('/', uploadMiddleware.single('image'), affichesController.createAffiche);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   put:
 *     summary: Met à jour une affiche
 *     tags:
 *       - Affiches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.put('/:id', uploadMiddleware.single('image'), affichesController.updateAffiche);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   delete:
 *     summary: Supprime une affiche
 *     tags:
 *       - Affiches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche
 */
router.delete('/:id', affichesController.deleteAffiche);

module.exports = router;