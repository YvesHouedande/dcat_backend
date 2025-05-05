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

module.exports = router;