const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: Gestion des clients et authentification
 *   - name: Produits Marketing
 *     description: Gestion du catalogue de produits marketing
 *   - name: Commandes Marketing
 *     description: Gestion des commandes clients marketing
 *   - name: Services DCAT
 *     description: Gestion des services proposés par DCAT
 *   - name: Affiches
 *     description: Gestion des affiches promotionnelles
 * 
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id_client:
 *           type: integer
 *           description: Identifiant unique du client
 *         nom:
 *           type: string
 *           description: Nom du client
 *         email:
 *           type: string
 *           format: email
 *           description: Email du client
 *         contact:
 *           type: string
 *           description: Numéro de téléphone du client
 *         role:
 *           type: string
 *           description: Rôle du client (par défaut "client")
 *
 *     Produit:
 *       type: object
 *       properties:
 *         id_produit:
 *           type: integer
 *           description: Identifiant unique du produit
 *         code_produit:
 *           type: string
 *           description: Code unique du produit
 *         desi_produit:
 *           type: string
 *           description: Désignation du produit
 *         desc_produit:
 *           type: string
 *           description: Description détaillée du produit
 *         prix_produit:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *         image_produit:
 *           type: string
 *           description: URL de l'image du produit
 *         id_famille:
 *           type: integer
 *           description: ID de la famille du produit
 *
 *     Famille:
 *       type: object
 *       properties:
 *         id_famille:
 *           type: integer
 *           description: Identifiant unique de la famille
 *         libelle_famille:
 *           type: string
 *           description: Libellé de la famille de produits
 *
 *     Commande:
 *       type: object
 *       properties:
 *         id_commande:
 *           type: integer
 *           description: Identifiant unique de la commande
 *         date_de_commande:
 *           type: string
 *           format: date
 *           description: Date de la commande
 *         etat_commande:
 *           type: string
 *           description: État de la commande
 *         mode_de_paiement:
 *           type: string
 *           description: Mode de paiement utilisé
 *         id_client:
 *           type: integer
 *           description: ID du client ayant passé la commande
 *
 *     Service:
 *       type: object
 *       properties:
 *         id_service:
 *           type: integer
 *           description: Identifiant unique du service
 *         titre_service:
 *           type: string
 *           description: Titre du service
 *         sous_titre_service:
 *           type: string
 *           description: Sous-titre du service
 *         detail_service:
 *           type: string
 *           description: Description détaillée du service
 *         image_service:
 *           type: string
 *           description: URL de l'image du service
 *
 *     Affiche:
 *       type: object
 *       properties:
 *         id_affiche:
 *           type: integer
 *           description: Identifiant unique de l'affiche
 *         titre_promotion:
 *           type: string
 *           description: Titre de la promotion
 *         sous_titre_promotion:
 *           type: string
 *           description: Sous-titre de la promotion
 *         image:
 *           type: string
 *           description: URL de l'image de l'affiche
 */

// Import des sous-routes
const clientsRoutes = require("./clients.routes");
const produitsRoutes = require("./produits.routes");
const commandesRoutes = require("./commandes.routes");
const servicesDcatRoutes = require("./services_dcat.routes");
const affichesRoutes = require("./affiches.routes");

/**
 * @swagger
 * /api/clients:
 *   description: Routes liées aux clients
 *   get:
 *     summary: Accède à la gestion des clients
 *     tags: [Clients]
 */
router.use("/clients", clientsRoutes);

/**
 * @swagger
 * /api/produits:
 *   description: Routes liées aux produits marketing
 *   get:
 *     summary: Accède au catalogue de produits marketing
 *     tags: [Produits Marketing]
 */
router.use("/produits", produitsRoutes);

/**
 * @swagger
 * /api/commandes:
 *   description: Routes liées aux commandes marketing
 *   get:
 *     summary: Accède aux commandes clients marketing
 *     tags: [Commandes Marketing]
 */
router.use("/commandes", commandesRoutes);

/**
 * @swagger
 * /api/services:
 *   description: Routes liées aux services DCAT
 *   get:
 *     summary: Accède aux services proposés par DCAT
 *     tags: [Services DCAT]
 */
router.use("/services", servicesDcatRoutes);

/**
 * @swagger
 * /api/affiches:
 *   description: Routes liées aux affiches promotionnelles
 *   get:
 *     summary: Accède aux affiches promotionnelles
 *     tags: [Affiches]
 */
router.use("/affiches", affichesRoutes);

module.exports = router;
