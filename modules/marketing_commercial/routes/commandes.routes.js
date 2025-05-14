const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandes.controller');

/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Commandes Marketing]
 */
router.post('/', commandesController.createCommande);

/**
 * @swagger
 * /api/commandes/{id}:
 *   get:
 *     summary: Récupère une commande par son ID
 *     tags: [Commandes Marketing]
 */
router.get('/:id', commandesController.getCommandeById);

/**
 * @swagger
 * /api/commandes/client/{clientId}:
 *   get:
 *     summary: Récupère les commandes d'un client
 *     tags: [Commandes Marketing]
 */
router.get('/client/:clientId', commandesController.getClientCommandes);

/**
 * @swagger
 * /api/commandes/status/{status}:
 *   get:
 *     summary: Récupère les commandes par statut
 *     tags: [Commandes Marketing]
 */
router.get('/status/:status', commandesController.getCommandesByStatus);

/**
 * @swagger
 * /api/commandes/{id}/products:
 *   get:
 *     summary: Récupère les produits d'une commande
 *     tags: [Commandes Marketing]
 */
router.get('/:id/products', commandesController.getCommandeProducts);

/**
 * @swagger
 * /api/commandes/{id}/update-status:
 *   patch:
 *     summary: Met à jour le statut d'une commande
 *     tags: [Commandes Marketing]
 */
router.patch('/:id/update-status', commandesController.updateCommandeStatus);

/**
 * @swagger
 * /api/commandes/{id}/update-date:
 *   patch:
 *     summary: Met à jour la date de livraison d'une commande
 *     tags: [Commandes Marketing]
 */
router.patch('/:id/update-date', commandesController.updateLivraisonDate);

/**
 * @swagger
 * /api/commandes/{id}/update:
 *   patch:
 *     summary: Met à jour le statut et la date de livraison d'une commande
 *     tags: [Commandes Marketing]
 */
router.patch('/:id/update', commandesController.updateCommandeStatusAndDate);

module.exports = router;