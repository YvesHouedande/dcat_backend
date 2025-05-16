const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du client
 *         nom:
 *           type: string
 *           description: Nom complet du client
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email du client
 *         role:
 *           type: string
 *           description: Rôle du client (client, admin, etc.)
 *         contact:
 *           type: string
 *           description: Numéro de téléphone du client
 *         token:
 *           type: string
 *           description: JWT pour authentifier les requêtes
 *         refreshToken:
 *           type: string
 *           description: Token permettant de rafraîchir le token d'accès
 * 
 * @swagger
 * /api/marketing_commercial/clients/login:
 *   post:
 *     summary: Connecte un client
 *     description: Authentifie un client et renvoie un token d'accès
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email du client
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe du client
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 token:
 *                   type: string
 *                   description: JWT pour authentifier les requêtes ultérieures
 *                 refreshToken:
 *                   type: string
 *                   description: Token permettant de rafraîchir le token d'accès
 *       400:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', clientsController.login);

/**
 * @swagger
 * /api/marketing_commercial/clients/register:
 *   post:
 *     summary: Enregistre un nouveau client
 *     description: Crée un nouveau compte client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom complet du client
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email du client
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe du client
 *               contact:
 *                 type: string
 *                 description: Numéro de téléphone du client
 *     responses:
 *       201:
 *         description: Client enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 token:
 *                   type: string
 *                   description: JWT pour authentifier les requêtes ultérieures
 *       400:
 *         description: Données invalides ou email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', clientsController.register);

/**
 * @swagger
 * /api/marketing_commercial/clients/verify-token:
 *   get:
 *     summary: Vérifie la validité d'un token
 *     description: Vérifie si le token d'authentification fourni est valide
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       401:
 *         description: Token invalide ou expiré
 */
router.get('/verify-token', clientsController.verifyToken);

/**
 * @swagger
 * /api/marketing_commercial/clients/refresh-token:
 *   post:
 *     summary: Rafraîchit un token d'authentification
 *     description: Génère un nouveau token d'accès à partir d'un refresh token
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token précédemment obtenu
 *     responses:
 *       200:
 *         description: Nouveau token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Nouveau JWT pour authentifier les requêtes ultérieures
 *       401:
 *         description: Refresh token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
router.post('/refresh-token', clientsController.refreshToken);

/**
 * @swagger
 * /api/marketing_commercial/clients/logout:
 *   post:
 *     summary: Déconnecte un client
 *     description: Invalide le refresh token du client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token à invalider
 *     responses:
 *       200:
 *         description: Déconnexion réussie
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
 *                   example: Déconnexion réussie
 *       400:
 *         description: Refresh token non fourni
 *       500:
 *         description: Erreur serveur
 */
router.post('/logout', clientsController.logout);

/**
 * @swagger
 * /api/marketing_commercial/clients/admin/all:
 *   get:
 *     summary: Récupère tous les clients
 *     description: Liste tous les clients enregistrés (fonctionnalité admin)
 *     tags: [Clients Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/admin/all', clientsController.getAllClients);

module.exports = router;
