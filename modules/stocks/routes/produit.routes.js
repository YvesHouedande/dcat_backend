const express = require("express");
const router = express.Router();
const controller = require("../controllers/produit.controller");

// CRUD Routes
// router.post("/", controller.createProduit);
// router.get("/", controller.getProduits);
// router.get("/:id", controller.getProduitById);
// router.get("/:idType", controller.getProduitsByTypes); // afficher tous les outils/équipements
// router.put("/:id", controller.updateProduit);
// router.delete("/:id", controller.deleteProduit);

/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Crée un nouveau produit
 *     tags: [Produits]
 */
router.post("/", controller.createProduit);

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 */
router.get("/", controller.getProduits);

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Récupère un produit par ID
 *     tags: [Produits]
 */
router.get("/:id", controller.getProduitById);

/**
 * @swagger
 * /api/produits/{idType}:
 *   get:
 *     summary: Récupère tous les produits par type (outils/équipements)
 *     tags: [Produits]
 */
router.get("/:idType", controller.getProduitsByTypes);

/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Met à jour un produit par ID
 *     tags: [Produits]
 */
router.put("/:id", controller.updateProduit);

/**
 * @swagger
 * /api/produits/{id}:
 *   delete:
 *     summary: Supprime un produit par ID
 *     tags: [Produits]
 */
router.delete("/:id", controller.deleteProduit);


module.exports = router;
