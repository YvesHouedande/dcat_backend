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
 * components:
 *   schemas:
 *     Affiche:
 *       type: object
 *       properties:
 *         id_affiche:
 *           type: integer
 *           description: ID unique de l'affiche
 *         image:
 *           type: string
 *           description: Chemin vers l'image de l'affiche
 *         titre_promotion:
 *           type: string
 *           description: Titre principal de l'affiche promotionnelle
 *         sous_titre_promotion:
 *           type: string
 *           description: Sous-titre de l'affiche promotionnelle
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'affiche
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Dernière date de mise à jour de l'affiche
 * 
 * /marketing_commercial/affiches:
 *   get:
 *     summary: Liste toutes les affiches
 *     description: Retourne la liste complète des affiches promotionnelles
 *     tags: [Affiches]
 *     responses:
 *       200:
 *         description: Liste des affiches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Affiche'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', affichesController.getAllAffiches);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   get:
 *     summary: Récupère une affiche par son ID
 *     description: Retourne les détails d'une affiche promotionnelle spécifique
 *     tags: [Affiches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche
 *     responses:
 *       200:
 *         description: Affiche récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Affiche'
 *       404:
 *         description: Affiche non trouvée
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', affichesController.getAfficheById);

/**
 * @swagger
 * /marketing_commercial/affiches:
 *   post:
 *     summary: Crée une nouvelle affiche
 *     description: Ajoute une nouvelle affiche promotionnelle avec image et textes
 *     tags: [Affiches]
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
 *               - titre_promotion
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image de l'affiche (JPG, PNG)
 *               titre_promotion:
 *                 type: string
 *                 description: Titre principal de l'affiche
 *               sous_titre_promotion:
 *                 type: string
 *                 description: Sous-titre ou description de l'affiche
 *     responses:
 *       201:
 *         description: Affiche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Affiche'
 *                 message:
 *                   type: string
 *                   example: Affiche créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur ou erreur d'upload
 */
router.post('/', uploadMiddleware.single('image'), affichesController.createAffiche);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   put:
 *     summary: Met à jour une affiche
 *     description: Modifie une affiche promotionnelle existante
 *     tags: [Affiches]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche à modifier
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
 *               titre_promotion:
 *                 type: string
 *                 description: Nouveau titre de l'affiche
 *               sous_titre_promotion:
 *                 type: string
 *                 description: Nouveau sous-titre de l'affiche
 *     responses:
 *       200:
 *         description: Affiche mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Affiche'
 *                 message:
 *                   type: string
 *                   example: Affiche mise à jour avec succès
 *       404:
 *         description: Affiche non trouvée
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur ou erreur d'upload
 */
router.put('/:id', uploadMiddleware.single('image'), affichesController.updateAffiche);

/**
 * @swagger
 * /marketing_commercial/affiches/{id}:
 *   delete:
 *     summary: Supprime une affiche
 *     description: Supprime définitivement une affiche promotionnelle et son image
 *     tags: [Affiches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'affiche à supprimer
 *     responses:
 *       200:
 *         description: Affiche supprimée avec succès
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
 *                   example: Affiche supprimée avec succès
 *       404:
 *         description: Affiche non trouvée
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', affichesController.deleteAffiche);

module.exports = router;