const express = require("express");
const router = express.Router();
const controller = require("../controllers/commande.controller");


/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Commandes]
 */
router.post("/", controller.createCommande);

/**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Récupère toutes les commandes
 *     tags: [Commandes]
 */
router.get("/", controller.getAllCommandes);

/**
 * @swagger
 * /api/commandes/{id}:
 *   get:
 *     summary: Récupère une commande par ID
 *     tags: [Commandes]
 */
router.get("/:id", controller.getCommandeById);

/**
 * @swagger
 * /api/commandes/{id}:
 *   put:
 *     summary: Met à jour une commande par ID
 *     tags: [Commandes]
 */
router.put("/:id", controller.updateCommande);

/**
 * @swagger
 * /api/commandes/{id}:
 *   delete:
 *     summary: Supprime une commande par ID
 *     tags: [Commandes]
 */
router.delete("/:id", controller.deleteCommande);


module.exports = router;
