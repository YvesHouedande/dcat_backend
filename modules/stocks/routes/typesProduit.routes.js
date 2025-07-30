const express = require("express");
const router = express.Router();
const controller = require("../controllers/typesProduit.controller");

// CRUD Routes
// router.post("/", controller.createTypeProduit);
// router.get("/", controller.getTypeProduits);
// router.get("/:id", controller.getTypeProduitById);
// router.put("/:id", controller.updateTypeProduit);
// router.delete("/:id", controller.deleteTypeProduit);

/**
 * @swagger
 * /stocks/types-produits:
 *   post:
 *     summary: Crée un nouveau type de produit
 *     tags: [Types de Produits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle:
 *                 type: string
 *                 description: Libellé du type de produit .par exemple "equipement" ou "outil"
 *                 enum: [equipement, outil]
 *                 example: equipement
 *     responses:
 *       201:
 *         description: Type de produit créé avec succès
 *       400:
 *         description: Données invalides ou champ manquant
 *       500:
 *         description: Erreur serveur
 */
router.post("/", controller.createTypeProduit);

/**
 * @swagger
 * /stocks/types-produits:
 *   get:
 *     summary: Récupère tous les types de produits
 *     tags: [Types de Produits]
 */
router.get("/", controller.getTypeProduits);

/**
 * @swagger
 * /stocks/types-produits/{id}:
 *   get:
 *     summary: Récupère un type de produit par ID
 *     tags: [Types de Produits]
 */
router.get("/:id", controller.getTypeProduitById);

/**
 * @swagger
 * /stocks/types-produits/{id}:
 *   put:
 *     summary: Met à jour un type de produit par ID
 *     tags: [Types de Produits]
 */
router.put("/:id", controller.updateTypeProduit);

/**
 * @swagger
 * /stocks/types-produits/{id}:
 *   delete:
 *     summary: Supprime un type de produit par ID
 *     tags: [Types de Produits]
 */
router.delete("/:id", controller.deleteTypeProduit);

module.exports = router;
