const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients.controller");

/**
 * @swagger
 * /marketing_commercial/clients/login:
 *   post:
 *     summary: Connecte un client
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', clientsController.login);

/**
 * @swagger
 * /marketing_commercial/clients/register:
 *   post:
 *     summary: Enregistre un nouveau client
 *     tags:
 *       - Clients
 */
router.post('/register', clientsController.register);

/**
 * @swagger
 * /marketing_commercial/clients/verify-token:
 *   get:
 *     summary: Vérifie la validité d'un token
 *     tags:
 *       - Clients
 */
router.get('/verify-token', clientsController.verifyToken);

/**
 * @swagger
 * /marketing_commercial/clients/refresh-token:
 *   post:
 *     summary: Rafraîchit un token d'authentification
 *     tags:
 *       - Clients
 */
router.post('/refresh-token', clientsController.refreshToken);

/**
 * @swagger
 * /marketing_commercial/clients/logout:
 *   post:
 *     summary: Déconnecte un client
 *     tags:
 *       - Clients
 */
router.post('/logout', clientsController.logout);

module.exports = router;
