const express = require("express");
const router = express.Router();


// Import des sous-routes
const clientsRoutes = require("./clients.routes");
const produitsRoutes = require("./produits.routes");
const commandesRoutes = require("./commandes.routes");
const servicesDcatRoutes = require("./services_dcat.routes");
const affichesRoutes = require("./affiches.routes");
const panierRoutes = require("./panier.routes");
const notificationRoutes = require("./notification_websocket.routes");

/**
 * @swagger
 * /marketing_commercial/clients:
 *   description: Routes liées aux clients
 *   get:
 *     summary: Accède à la gestion des clients
 *     tags: [Clients]
 */
router.use("/clients", clientsRoutes);

/**
 * @swagger
 * /marketing_commercial/produits:
 *   description: Routes liées aux produits marketing
 *   get:
 *     summary: Accède au catalogue de produits marketing
 *     tags: [Produits Marketing]
 */
router.use("/produits", produitsRoutes);

/**
 * @swagger
 * /marketing_commercial/commandes:
 *   description: Routes liées aux commandes marketing
 *   get:
 *     summary: Accède aux commandes clients marketing
 *     tags: [Commandes Marketing]
 */
router.use("/commandes", commandesRoutes);

/**
 * @swagger
 * /marketing_commercial/services:
 *   description: Routes liées aux services DCAT
 *   get:
 *     summary: Accède aux services proposés par DCAT
 *     tags: [Services DCAT]
 */
router.use("/services", servicesDcatRoutes);

/**
 * @swagger
 * /marketing_commercial/affiches:
 *   description: Routes liées aux affiches promotionnelles
 *   get:
 *     summary: Accède aux affiches promotionnelles
 *     tags: [Affiches]
 */
router.use("/affiches", affichesRoutes);

/**
 * @swagger
 * /marketing_commercial/panier:
 *   description: Routes liées au panier d'achat
 *   get:
 *     summary: Accède au panier d'achat de l'utilisateur
 *     tags: [Panier]
 */
router.use("/panier", panierRoutes);

/**
 * @swagger
 * /marketing_commercial/notifications:
 *   description: Routes liées aux notifications utilisateur
 *   get:
 *     summary: Accède aux notifications de l'utilisateur
 *     tags: [Notifications]
 */
router.use("/notifications", notificationRoutes);

module.exports = router;
