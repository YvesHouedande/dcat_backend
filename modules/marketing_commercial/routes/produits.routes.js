const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Produit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du produit
 *         designation:
 *           type: string
 *           description: Nom commercial du produit
 *         description:
 *           type: string
 *           description: Description détaillée du produit
 *         image:
 *           type: string
 *           description: Chemin vers l'image du produit
 *         prix:
 *           type: number
 *           format: float
 *           description: Prix de vente du produit
 *         caracteristiques:
 *           type: string
 *           description: Caractéristiques techniques du produit
 *         famille_id:
 *           type: integer
 *           description: ID de la famille du produit
 *         famille_libelle:
 *           type: string
 *           description: Libellé de la famille du produit
 *     Famille:
 *       type: object
 *       properties:
 *         id_famille:
 *           type: integer
 *           description: ID unique de la famille
 *         libelle_famille:
 *           type: string
 *           description: Nom de la famille/catégorie
 *
 * /api/marketing_commercial/produits/famille/{familleId}:
 *   get:
 *     summary: Récupère les équipements par famille
 *     description: Retourne tous les produits de type équipement appartenant à une famille spécifique
 *     tags: [Produits Marketing]
 *     parameters:
 *       - in: path
 *         name: familleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la famille de produits
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
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/famille/:familleId', produitsController.getEquipementsByFamille);

/**
 * @swagger
 * /api/marketing_commercial/produits:
 *   get:
 *     summary: Liste tous les équipements
 *     description: Retourne tous les produits de type équipement disponibles dans le catalogue
 *     tags: [Produits Marketing]
 *     responses:
 *       200:
 *         description: Liste des équipements récupérée avec succès
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
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/', produitsController.getAllEquipements);

/**
 * @swagger
 * /api/marketing_commercial/produits/nouveautes:
 *   get:
 *     summary: Récupère les derniers produits ajoutés
 *     description: Retourne les produits les plus récemment ajoutés au catalogue
 *     tags: [Produits Marketing]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre maximum de produits à retourner
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
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/nouveautes', produitsController.getLatestProducts);

/**
 * @swagger
 * /api/marketing_commercial/produits/{productId}/details:
 *   get:
 *     summary: Récupère les détails d'un produit
 *     description: Retourne les informations détaillées d'un produit spécifique
 *     tags: [Produits Marketing]
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
 *       400:
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/:productId/details', produitsController.getProductDetails);

/**
 * @swagger
 * /api/marketing_commercial/produits/familles:
 *   get:
 *     summary: Liste toutes les familles de produits
 *     description: Retourne toutes les familles/catégories disponibles pour les produits
 *     tags: [Produits Marketing]
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
 *       400:
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/familles', produitsController.getAllFamilles);

/**
 * @swagger
 * /api/marketing_commercial/produits/{productId}/similaires:
 *   get:
 *     summary: Récupère des produits similaires
 *     description: Utilise les mots-clés du libellé et de la description pour trouver des produits similaires
 *     tags: [Produits Marketing]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit de référence
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Nombre maximum de produits similaires à retourner
 *     responses:
 *       200:
 *         description: Liste des produits similaires récupérée avec succès
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
 *       404:
 *         description: Produit de référence non trouvé
 *       400:
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/:productId/similaires', produitsController.getSimilarProductsByLibelle);

/**
 * @swagger
 * /api/marketing_commercial/produits/{productId}/images:
 *   get:
 *     summary: Récupère les images d'un produit
 *     description: Retourne toutes les images associées à un produit spécifique
 *     tags: [Produits Marketing]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Images récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_image:
 *                         type: integer
 *                         description: ID unique de l'image
 *                       lien_image:
 *                         type: string
 *                         description: Chemin vers l'image du produit
 *       404:
 *         description: Produit non trouvé
 *       400:
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/:productId/images', produitsController.getProductImages);

/**
 * @swagger
 * /api/marketing_commercial/produits/paginated:
 *   get:
 *     summary: Liste les équipements avec pagination
 *     description: Retourne une liste paginée de produits de type équipement
 *     tags: [Produits Marketing]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: familleId
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de famille (optionnel)
 *     responses:
 *       200:
 *         description: Liste paginée des produits récupérée avec succès
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
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Page actuelle
 *                     limit:
 *                       type: integer
 *                       description: Nombre d'éléments par page
 *                     total:
 *                       type: integer
 *                       description: Nombre total d'éléments
 *                     totalPages:
 *                       type: integer
 *                       description: Nombre total de pages
 *                     hasMore:
 *                       type: boolean
 *                       description: Indique s'il y a d'autres pages à charger
 *       400:
 *         description: Erreur de requête
 *       500:
 *         description: Erreur serveur
 */
router.get('/paginated', produitsController.getPaginatedEquipements);

module.exports = router;