const express = require("express");
const router = express.Router();
const controller = require("../controllers/commande.controller");


/**
 * @swagger
 * /commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Commandes]
 */
router.post("/", controller.createCommande);

/**
 * @swagger
 * /commandes:
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
 * /commandes/{id}:
 *   get:
 *     summary: Récupère une commande par ID
 *     tags: [Commandes]
 */
router.get("/:id", controller.getCommandeById);

/**
 * @swagger
 * /commandes/{id}:
 *   put:
 *     summary: Met à jour une commande par ID
 *     tags: [Commandes]
 */
router.put("/:id", controller.updateCommande);

/**
 * @swagger
 * /commandes/{id}:
 *   delete:
 *     summary: Supprime une commande par ID
 *     tags: [Commandes]
 */
router.delete("/:id", controller.deleteCommande);


module.exports = router;
