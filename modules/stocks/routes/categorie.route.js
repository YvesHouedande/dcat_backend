const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorie.controller");

// CRUD Routes


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Catégories]
 */
router.post("/", controller.createCategorie);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupère toutes les catégories
 *     tags: [Catégories]
 */
router.get("/", controller.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par ID
 *     tags: [Catégories]
 */
router.get("/:id", controller.getCategorieById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie par ID
 *     tags: [Catégories]
 */
router.put("/:id", controller.updateCategorie);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie par ID
 *     tags: [Catégories]
 */
router.delete("/:id", controller.deleteCategorie);


module.exports = router;