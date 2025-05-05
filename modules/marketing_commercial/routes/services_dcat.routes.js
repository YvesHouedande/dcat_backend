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
 * /api/services:
 *   get:
 *     summary: Liste tous les services DCAT
 *     tags: [Services DCAT]
 */
router.get('/', servicesDcatController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Récupère un service DCAT par son ID
 *     tags: [Services DCAT]
 */
router.get('/:id', servicesDcatController.getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crée un nouveau service DCAT
 *     tags: [Services DCAT]
 */
router.post('/', uploadMiddleware.single('image'), servicesDcatController.createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Met à jour un service DCAT
 *     tags: [Services DCAT]
 */
router.put('/:id', uploadMiddleware.single('image'), servicesDcatController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Supprime un service DCAT
 *     tags: [Services DCAT]
 */
router.delete('/:id', servicesDcatController.deleteService);

module.exports = router;