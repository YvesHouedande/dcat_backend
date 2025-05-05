const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

/**
 * @swagger
 * /marketing_commercial/produits/famille/{familleId}:
 *   get:
 *     summary: Récupère les équipements par famille
 *     description: Renvoie la liste des produits appartenant à une famille spécifique
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: familleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la famille
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 produits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Paramètre invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/famille/:familleId', produitsController.getEquipementsByFamille);

/**
 * @swagger
 * /marketing_commercial/produits:
 *   get:
 *     summary: Liste tous les équipements
 *     description: Renvoie la liste complète de tous les produits disponibles
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 produits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produit'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', produitsController.getAllEquipements);

/**
 * @swagger
 * /marketing_commercial/produits/nouveautes:
 *   get:
 *     summary: Récupère les derniers produits ajoutés
 *     description: Renvoie les produits les plus récemment ajoutés au catalogue
 *     tags: [Produits]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre de produits à récupérer
 *     responses:
 *       200:
 *         description: Liste des nouveaux produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 produits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Paramètre limit invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/nouveautes', produitsController.getLatestProducts);

/**
 * @swagger
 * /marketing_commercial/produits/{productId}/details:
 *   get:
 *     summary: Récupère les détails d'un produit
 *     description: Renvoie les informations détaillées d'un produit spécifique
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:productId/details', produitsController.getProductDetails);

/**
 * @swagger
 * /marketing_commercial/produits/familles:
 *   get:
 *     summary: Liste toutes les familles de produits
 *     description: Renvoie la liste complète des familles de produits disponibles
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des familles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 familles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Famille'
 *       500:
 *         description: Erreur serveur
 */
router.get('/familles', produitsController.getAllFamilles);

module.exports = router;