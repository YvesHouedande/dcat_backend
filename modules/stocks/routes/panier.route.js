const express = require("express");
const router = express.Router();
const controller = require("../controllers/panier.controller");

/**
 * @swagger
 * /stocks/panier:
 *   post:
 *     summary: Ajouter un produit au panier
 *     tags: [Panier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_client
 *               - id_produit
 *               - quantite
 *             properties:
 *               id_client:
 *                 type: integer
 *               id_produit:
 *                 type: integer
 *               quantite:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Produit ajouté au panier
 */
router.post("/", controller.addToPanier);

/**
 * @swagger
 * /stocks/panier:
 *   delete:
 *     summary: Supprimer un produit du panier
 *     tags: [Panier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_client
 *               - id_produit
 *             properties:
 *               id_client:
 *                 type: integer
 *               id_produit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produit supprimé du panier
 */
router.delete("/", controller.removeFromPanier);

/**
 * @swagger
 * /stocks/panier/{id_client}:
 *   get:
 *     summary: Récupérer le panier d’un client
 *     tags: [Panier]
 *     parameters:
 *       - in: path
 *         name: id_client
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Détails du panier du client
 */
router.get("/:id_client", controller.getPanierByClient);

module.exports = router;
//test
