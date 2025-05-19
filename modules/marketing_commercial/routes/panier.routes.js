const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panier.controller');
const { authMiddleware, checkRoles } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     PanierProduit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID du produit
 *         designation:
 *           type: string
 *           description: Nom du produit
 *         description:
 *           type: string
 *           description: Description du produit
 *         prix:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *         image:
 *           type: string
 *           description: URL de l'image principale du produit
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               lien:
 *                 type: string
 *               numero:
 *                 type: integer
 *           description: Liste des images du produit
 *         quantite:
 *           type: integer
 *           description: Quantité dans le panier
 *         montant:
 *           type: number
 *           format: float
 *           description: Prix total (prix * quantité)
 *     Panier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID du panier
 *         client_id:
 *           type: integer
 *           description: ID du client
 *         produits:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PanierProduit'
 *           description: Liste des produits dans le panier
 *         montant_total:
 *           type: number
 *           format: float
 *           description: Montant total du panier
 *         nombre_produits:
 *           type: integer
 *           description: Nombre total de produits dans le panier
 */

// Le middleware d'authentification a été remplacé par une implémentation robuste// importée depuis '../middleware/auth'

/**
 * @swagger
 * /api/marketing_commercial/panier:
 *   get:
 *     summary: Récupère le panier de l'utilisateur connecté
 *     description: Retourne le panier de l'utilisateur actuellement connecté
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, panierController.getPanier);

/**
 * @swagger
 * /api/marketing_commercial/panier/produit:
 *   post:
 *     summary: Ajoute un produit au panier
 *     description: Ajoute un produit au panier de l'utilisateur connecté
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produitId
 *             properties:
 *               produitId:
 *                 type: integer
 *                 description: ID du produit à ajouter
 *               quantite:
 *                 type: integer
 *                 description: Quantité à ajouter
 *                 default: 1
 *     responses:
 *       200:
 *         description: Produit ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/produit', authMiddleware, panierController.addProduit);

/**
 * @swagger
 * /api/marketing_commercial/panier/produit/quantite:
 *   put:
 *     summary: Met à jour la quantité d'un produit
 *     description: Met à jour la quantité d'un produit dans le panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produitId
 *               - quantite
 *             properties:
 *               produitId:
 *                 type: integer
 *                 description: ID du produit à mettre à jour
 *               quantite:
 *                 type: integer
 *                 description: Nouvelle quantité du produit
 *     responses:
 *       200:
 *         description: Quantité mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/produit/quantite', authMiddleware, panierController.updateQuantite);

/**
 * @swagger
 * /api/marketing_commercial/panier/produit/{produitId}:
 *   delete:
 *     summary: Supprime un produit du panier
 *     description: Supprime un produit du panier de l'utilisateur connecté
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/produit/:produitId', authMiddleware, panierController.removeProduit);

/**
 * @swagger
 * /api/marketing_commercial/panier:
 *   delete:
 *     summary: Vide le panier
 *     description: Supprime tous les produits du panier de l'utilisateur connecté
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier vidé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/', authMiddleware, panierController.clearPanier);

/**
 * @swagger
 * /api/marketing_commercial/panier/sync:
 *   post:
 *     summary: Synchronise le panier local avec le serveur
 *     description: Remplace le contenu du panier serveur avec les produits du panier local
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produits
 *             properties:
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID du produit
 *                     quantite:
 *                       type: integer
 *                       description: Quantité du produit
 *                       default: 1
 *     responses:
 *       200:
 *         description: Panier synchronisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Erreur de requête
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/sync', authMiddleware, panierController.syncPanier);

module.exports = router;
