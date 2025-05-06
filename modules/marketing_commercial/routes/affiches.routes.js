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
 * /api/affiches:
 *   get:
 *     summary: Liste toutes les affiches
 *     tags: [Affiches]
 */
router.get('/', affichesController.getAllAffiches);

/**
 * @swagger
 * /api/affiches/{id}:
 *   get:
 *     summary: Récupère une affiche par son ID
 *     tags: [Affiches]
 */
router.get('/:id', affichesController.getAfficheById);

/**
 * @swagger
 * /api/affiches:
 *   post:
 *     summary: Crée une nouvelle affiche
 *     tags: [Affiches]
 */
router.post('/', uploadMiddleware.single('image'), affichesController.createAffiche);

/**
 * @swagger
 * /api/affiches/{id}:
 *   put:
 *     summary: Met à jour une affiche
 *     tags: [Affiches]
 */
router.put('/:id', uploadMiddleware.single('image'), affichesController.updateAffiche);

/**
 * @swagger
 * /api/affiches/{id}:
 *   delete:
 *     summary: Supprime une affiche
 *     tags: [Affiches]
 */
router.delete('/:id', affichesController.deleteAffiche);

module.exports = router;