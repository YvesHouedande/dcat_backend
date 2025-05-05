const express = require('express');
const router = express.Router();
const servicesDcatController = require('../controllers/services_dcat.controller');
const uploadMiddleware = require('../../utils/middleware/uploadMiddleware');
const path = require('path');

// Configuration du chemin d'upload
router.use((req, res, next) => {
  req.uploadPath = path.join(process.cwd(), 'media/images/services_dcat');
  next();
});

/**
 * @swagger
 * /marketing_commercial/services:
 *   get:
 *     summary: Liste tous les services DCAT
 *     tags:
 *       - Services DCAT
 */
router.get('/', servicesDcatController.getAllServices);

/**
 * @swagger
 * /marketing_commercial/services/{id}:
 *   get:
 *     summary: Récupère un service DCAT par son ID
 *     tags:
 *       - Services DCAT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service
 */
router.get('/:id', servicesDcatController.getServiceById);

/**
 * @swagger
 * /marketing_commercial/services:
 *   post:
 *     summary: Crée un nouveau service DCAT
 *     tags:
 *       - Services DCAT
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
router.post('/', uploadMiddleware.single('image'), servicesDcatController.createService);

/**
 * @swagger
 * /marketing_commercial/services/{id}:
 *   put:
 *     summary: Met à jour un service DCAT
 *     tags:
 *       - Services DCAT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service
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
router.put('/:id', uploadMiddleware.single('image'), servicesDcatController.updateService);

/**
 * @swagger
 * /marketing_commercial/services/{id}:
 *   delete:
 *     summary: Supprime un service DCAT
 *     tags:
 *       - Services DCAT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service
 */
router.delete('/:id', servicesDcatController.deleteService);

module.exports = router;