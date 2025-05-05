const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

/**
 * @swagger
 * /api/produits/famille/{familleId}:
 *   get:
 *     summary: Récupère les équipements par famille
 *     tags: [Produits Marketing]
 */
router.get('/famille/:familleId', produitsController.getEquipementsByFamille);

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Liste tous les équipements
 *     tags: [Produits Marketing]
 */
router.get('/', produitsController.getAllEquipements);

/**
 * @swagger
 * /api/produits/nouveautes:
 *   get:
 *     summary: Récupère les derniers produits ajoutés
 *     tags: [Produits Marketing]
 */
router.get('/nouveautes', produitsController.getLatestProducts);

/**
 * @swagger
 * /api/produits/{productId}/details:
 *   get:
 *     summary: Récupère les détails d'un produit
 *     tags: [Produits Marketing]
 */
router.get('/:productId/details', produitsController.getProductDetails);

/**
 * @swagger
 * /api/produits/familles:
 *   get:
 *     summary: Liste toutes les familles de produits
 *     tags: [Produits Marketing]
 */
router.get('/familles', produitsController.getAllFamilles);

module.exports = router;