const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

/**
 * @swagger
 * /marketing_commercial/produits/famille/{familleId}:
 *   get:
 *     summary: Récupère les équipements par famille
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: familleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la famille
 */
router.get('/famille/:familleId', produitsController.getEquipementsByFamille);

/**
 * @swagger
 * /marketing_commercial/produits:
 *   get:
 *     summary: Liste tous les équipements
 *     tags:
 *       - Produits
 */
router.get('/', produitsController.getAllEquipements);

/**
 * @swagger
 * /marketing_commercial/produits/{productId}/details:
 *   get:
 *     summary: Récupère les détails d'un produit
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 */
router.get('/:productId/details', produitsController.getProductDetails);

/**
 * @swagger
 * /marketing_commercial/produits/familles:
 *   get:
 *     summary: Liste toutes les familles de produits
 *     tags:
 *       - Produits
 */
router.get('/familles', produitsController.getAllFamilles);

module.exports = router;