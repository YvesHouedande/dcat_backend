const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandes.controller');

/**
 * @swagger
 * /marketing_commercial/commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags:
 *       - Commandes
 */
router.post('/', commandesController.createCommande);

/**
 * @swagger
 * /marketing_commercial/commandes/client/{clientId}:
 *   get:
 *     summary: Récupère les commandes d'un client
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client
 */
router.get('/client/:clientId', commandesController.getClientCommandes);

/**
 * @swagger
 * /marketing_commercial/commandes/status/{status}:
 *   get:
 *     summary: Récupère les commandes par statut
 *     tags:
 *       - Commandes
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Statut de la commande (ex. "en attente", "validée", "annulée")
 */
router.get('/status/:status', commandesController.getCommandesByStatus);

module.exports = router;