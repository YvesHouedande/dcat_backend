const express = require("express");
const router = express.Router();
const controller = require("../controllers/commande.controller");

/**
 * @swagger
 * /stocks/commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     description: Enregistre une nouvelle commande avec les produits associés
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produitsQuantites
 *               - partenaireId
 *             properties:
 *               produitsQuantites:
 *                 type: object
 *                 description: Dictionnaire des ID produits avec leurs quantités
 *                 example: {"3": 2}
 *               partenaireId:
 *                 type: integer
 *                 description: ID du partenaire associé
 *                 example: 2
 *               lieuLivraison:
 *                 type: string
 *                 description: Lieu de livraison de la commande
 *                 example: "Nakata"
 *               dateLivraison:
 *                 type: string
 *                 format: date
 *                 description: Date prévue de livraison (YYYY-MM-DD)
 *                 example: "2025-05-31"
 *               modePaiement:
 *                 type: string
 *                 description: Mode de paiement utilisé
 *                 example: "espèce"
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", controller.createCommande);

/**
 * @swagger
 * /stocks/commandes:
 *   get:
 *     summary: Récupère toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes avec leurs partenaires
 *         content:
 *           application/json:
 *             example:
 *               - commandes:
 *                   id_commande: 13
 *                   date_de_commande: "2025-04-28"
 *                   etat_commande: "en cours"
 *                   date_livraison: "2025-04-30"
 *                   lieu_de_livraison: "Hit radio"
 *                   mode_de_paiement: "espèce"
 *                   id_client: null
 *                   created_at: "2025-04-28T16:19:41.229Z"
 *                   updated_at: "2025-04-28T16:19:41.229Z"
 *                 partenaire_commandes:
 *                   id_partenaire: 3
 *                   id_commande: 13
 *                   created_at: "2025-04-28T16:19:41.241Z"
 *                   updated_at: "2025-04-28T16:19:41.241Z"
 *                 partenaires:
 *                   id_partenaire: 3
 *                   nom_partenaire: "Axo"
 *                   telephone_partenaire: "0303030303"
 *                   email_partenaire: "test-3@gmail.com"
 *                   specialite: "test-3"
 *                   localisation: "test-3"
 *                   type_partenaire: "test-3"
 *                   statut: "test-3"
 *                   id_entite: 1
 *                   created_at: "2025-04-23T11:12:51.310Z"
 *                   updated_at: "2025-04-23T11:12:51.310Z"
 */

router.get("/", controller.getAllCommandes);
/**
 * @swagger
 * /stocks/commandes/{id}:
 *   get:
 *     summary: Récupère une commande par son ID
 *     description: Retourne les détails complets d'une commande incluant les informations sur le partenaire, les produits associés, leurs exemplaires et le montant total
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à récupérer
 *         schema:
 *           type: integer
 *           example: 9
 *     responses:
 *       200:
 *         description: Détails de la commande récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_commande:
 *                   type: integer
 *                   example: 9
 *                 date_de_commande:
 *                   type: string
 *                   format: date
 *                   example: "2025-05-22"
 *                 etat_commande:
 *                   type: string
 *                   example: "en cours"
 *                 date_livraison:
 *                   type: string
 *                   format: date
 *                   example: "2025-05-31"
 *                 lieu_de_livraison:
 *                   type: string
 *                   example: "Nakata"
 *                 mode_de_paiement:
 *                   type: string
 *                   example: "espèce"
 *                 id_client:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-22T16:53:56.596Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-22T16:53:56.596Z"
 *                 partenaire:
 *                   $ref: '#/components/schemas/Partenaire'
 *                 produits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       produit:
 *                         $ref: '#/components/schemas/Produit'
 *                       quantite:
 *                         type: integer
 *                         example: 2
 *                       prix_unitaire:
 *                         type: string
 *                         example: "180000.00"
 *                       categorie:
 *                         $ref: '#/components/schemas/Categorie'
 *                       type:
 *                         $ref: '#/components/schemas/TypeProduit'
 *                       modele:
 *                         $ref: '#/components/schemas/Modele'
 *                       famille:
 *                         $ref: '#/components/schemas/Famille'
 *                       marque:
 *                         $ref: '#/components/schemas/Marque'
 *                       images:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Image'
 *                 montant_total:
 *                   type: integer
 *                   example: 360000
 *                 exemplaires:
 *                   type: array
 *                   items: {}
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Partenaire:
 *       type: object
 *       properties:
 *         id_partenaire:
 *           type: integer
 *           example: 2
 *         nom_partenaire:
 *           type: string
 *           example: "test-2"
 *         telephone_partenaire:
 *           type: string
 *           example: "0202020202"
 *         email_partenaire:
 *           type: string
 *           example: "test-2"
 *         specialite:
 *           type: string
 *           example: "test-2"
 *         localisation:
 *           type: string
 *           example: "test-2"
 *         type_partenaire:
 *           type: string
 *           example: "test-2"
 *         statut:
 *           type: string
 *           example: "test-2"
 *         id_entite:
 *           type: integer
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T16:52:15.555Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T16:52:15.555Z"
 * 
 *     Produit:
 *       type: object
 *       properties:
 *         id_produit:
 *           type: integer
 *           example: 3
 *         code_produit:
 *           type: string
 *           example: "AV001"
 *         desi_produit:
 *           type: string
 *           example: "Caméra de surveillance intérieure Somfy"
 *         desc_produit:
 *           type: string
 *           example: "Caméra WiFi avec détection de mouvement et sirène."
 *         qte_produit:
 *           type: integer
 *           example: 7
 *         emplacement_produit:
 *           type: string
 *           nullable: true
 *           example: null
 *         caracteristiques_produit:
 *           type: string
 *           example: "1080p, vision nocturne, app mobile"
 *         prix_produit:
 *           type: string
 *           example: "180000.00"
 *         id_categorie:
 *           type: integer
 *           example: 5
 *         id_type_produit:
 *           type: integer
 *           example: 1
 *         id_modele:
 *           type: integer
 *           example: 6
 *         id_famille:
 *           type: integer
 *           example: 3
 *         id_marque:
 *           type: integer
 *           example: 6
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:48:30.558Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T16:53:56.614Z"
 * 
 *     Categorie:
 *       type: object
 *       properties:
 *         id_categorie:
 *           type: integer
 *           example: 5
 *         libelle:
 *           type: string
 *           example: "haut de gamme"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:34:02.509Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:34:02.509Z"
 * 
 *     TypeProduit:
 *       type: object
 *       properties:
 *         id_type_produit:
 *           type: integer
 *           example: 1
 *         libelle:
 *           type: string
 *           example: "equipement"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:39:33.549Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:39:33.549Z"
 * 
 *     Modele:
 *       type: object
 *       properties:
 *         id_modele:
 *           type: integer
 *           example: 6
 *         libelle_modele:
 *           type: string
 *           example: "Tahoma Switch"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:37:17.349Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:37:17.349Z"
 * 
 *     Famille:
 *       type: object
 *       properties:
 *         id_famille:
 *           type: integer
 *           example: 3
 *         libelle_famille:
 *           type: string
 *           example: "Domotique"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:36:24.497Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:36:24.497Z"
 * 
 *     Marque:
 *       type: object
 *       properties:
 *         id_marque:
 *           type: integer
 *           example: 6
 *         libelle_marque:
 *           type: string
 *           example: "Somfy"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:48:16.624Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:48:16.624Z"
 * 
 *     Image:
 *       type: object
 *       properties:
 *         id_image:
 *           type: integer
 *           example: 1
 *         libelle_image:
 *           type: string
 *           nullable: true
 *           example: null
 *         lien_image:
 *           type: string
 *           example: "media\\images\\stock_moyensgeneraux\\produits\\CameradesurveillanceinterieureSomfy_1747388910447.jpeg"
 *         numero_image:
 *           type: string
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T09:48:30.606102"
 */

router.get("/:id", controller.getCommandeById);

/**
 * @swagger
 * /stocks/commandes/{id}:
 *   put:
 *     summary: Met à jour une commande par ID
 *     tags: [Commandes]
 */
router.put("/:id", controller.updateCommande);

/**
 * @swagger
 * /stocks/commandes/{id}:
 *   delete:
 *     summary: Supprime une commande par ID
 *     tags: [Commandes]
 */
router.delete("/:id/:type_sortie", controller.deleteCommande);

module.exports = router;
