const express = require('express');
const router = express.Router();
const servicesDcatController = require('../controllers/services_dcat.controller');
const uploadMiddleware = require('../../utils/middleware/uploadMiddleware');
const uploadOriginalNameMiddleware = require('../../utils/middleware/uploadOriginalNameMiddleware');
const path = require('path');

// Configuration du chemin d'upload
router.use((req, res, next) => {
  req.uploadPath = path.join(process.cwd(), 'media/images/services_dcat');
  next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id_service:
 *           type: integer
 *           description: ID unique du service
 *         titre_service:
 *           type: string
 *           description: Titre principal du service proposé
 *         sous_titre_service:
 *           type: string
 *           description: Sous-titre ou brève description du service
 *         detail_service:
 *           type: string
 *           description: Description détaillée du service
 *         image_service:
 *           type: string
 *           description: Chemin vers l'image illustrant le service
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création du service
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Dernière date de mise à jour du service
 *
 * /api/marketing_commercial/services:
 *   get:
 *     summary: Liste tous les services DCAT
 *     description: Retourne la liste complète des services proposés par DCAT
 *     tags: [Services DCAT]
 *     responses:
 *       200:
 *         description: Liste des services récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', servicesDcatController.getAllServices);

/**
 * @swagger
 * /api/marketing_commercial/services/{id}:
 *   get:
 *     summary: Récupère un service DCAT par son ID
 *     description: Retourne les détails d'un service spécifique
 *     tags: [Services DCAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service non trouvé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', servicesDcatController.getServiceById);

/**
 * @swagger
 * /api/marketing_commercial/services:
 *   post:
 *     summary: Crée un nouveau service DCAT
 *     description: Ajoute un nouveau service avec son image et sa description
 *     tags: [Services DCAT]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titre_service
 *               - detail_service
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image illustrant le service (JPG, PNG)
 *               titre_service:
 *                 type: string
 *                 description: Titre principal du service
 *               sous_titre_service:
 *                 type: string
 *                 description: Sous-titre ou brève description du service
 *               detail_service:
 *                 type: string
 *                 description: Description détaillée du service
 *     responses:
 *       201:
 *         description: Service créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *                   example: Service créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur ou erreur d'upload
 */
router.post('/', uploadMiddleware.single('image'), servicesDcatController.createService);

/**
 * @swagger
 * /api/marketing_commercial/services/{id}:
 *   put:
 *     summary: Met à jour un service DCAT
 *     description: Modifie un service existant
 *     tags: [Services DCAT]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à modifier
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle image (optionnelle)
 *               titre_service:
 *                 type: string
 *                 description: Nouveau titre du service
 *               sous_titre_service:
 *                 type: string
 *                 description: Nouveau sous-titre du service
 *               detail_service:
 *                 type: string
 *                 description: Nouvelle description détaillée du service
 *     responses:
 *       200:
 *         description: Service mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *                   example: Service mis à jour avec succès
 *       404:
 *         description: Service non trouvé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur ou erreur d'upload
 */
router.put('/:id', uploadMiddleware.single('image'), servicesDcatController.updateService);

/**
 * @swagger
 * /api/marketing_commercial/services/{id}:
 *   delete:
 *     summary: Supprime un service DCAT
 *     description: Supprime définitivement un service et son image
 *     tags: [Services DCAT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à supprimer
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
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
 *                   example: Service supprimé avec succès
 *       404:
 *         description: Service non trouvé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', servicesDcatController.deleteService);

/**
 * @swagger
 * /api/marketing_commercial/services/upload-image:
 *   post:
 *     summary: Télécharge une image de service DCAT
 *     description: Télécharge une image en conservant son nom original
 *     tags: [Services DCAT]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image à télécharger (JPG, PNG)
 *     responses:
 *       201:
 *         description: Image téléchargée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imagePath:
 *                   type: string
 *                   example: "media/images/services_dcat/image.jpg"
 *                 message:
 *                   type: string
 *                   example: "Image téléchargée avec succès"
 *       400:
 *         description: Aucune image envoyée ou format invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/upload-image', uploadOriginalNameMiddleware.single('image'), servicesDcatController.uploadServiceImage);

module.exports = router;