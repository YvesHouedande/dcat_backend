const express = require("express");
const router = express.Router();
const controller = require("../controllers/typesProduit.controller");

// CRUD Routes
// router.post("/", controller.createTypeProduit);
// router.get("/", controller.getTypeProduits);
// router.get("/:id", controller.getTypeProduitById);
// router.put("/:id", controller.updateTypeProduit);
// router.delete("/:id", controller.deleteTypeProduit);

// /**
//  * @swagger
//  * /api/type-produits:
//  *   post:
//  *     summary: Crée un nouveau type de produit
//  *     tags: [Types de Produits]
//  */
router.post("/", controller.createTypeProduit);

// /**
//  * @swagger
//  * /api/type-produits:
//  *   get:
//  *     summary: Récupère tous les types de produits
//  *     tags: [Types de Produits]
//  */
router.get("/", controller.getTypeProduits);

// /**
//  * @swagger
//  * /api/type-produits/{id}:
//  *   get:
//  *     summary: Récupère un type de produit par ID
//  *     tags: [Types de Produits]
//  */
router.get("/:id", controller.getTypeProduitById);

// /**
//  * @swagger
//  * /api/type-produits/{id}:
//  *   put:
//  *     summary: Met à jour un type de produit par ID
//  *     tags: [Types de Produits]
//  */
router.put("/:id", controller.updateTypeProduit);

// /**
//  * @swagger
//  * /api/type-produits/{id}:
//  *   delete:
//  *     summary: Supprime un type de produit par ID
//  *     tags: [Types de Produits]
//  */
router.delete("/:id", controller.deleteTypeProduit);

module.exports = router;
