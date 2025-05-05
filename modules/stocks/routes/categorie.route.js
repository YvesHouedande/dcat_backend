const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorie.controller");

// CRUD Routes

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Catégories]
 */
router.post("/", controller.createCategorie);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupère toutes les catégories
 *     tags: [Catégories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             example:
 *               - id_categorie: 1
 *                 libelle: "categorie-001"
 *                 created_at: "2025-04-23T11:40:49.215Z"
 *                 updated_at: "2025-04-23T11:40:49.215Z"
 *               - id_categorie: 2
 *                 libelle: "categorie-002"
 *                 created_at: "2025-04-23T11:40:55.225Z"
 *                 updated_at: "2025-04-23T11:40:55.225Z"
 *               - id_categorie: 3
 *                 libelle: "categorie-003"
 *                 created_at: "2025-04-23T11:41:00.366Z"
 *                 updated_at: "2025-04-23T11:41:00.366Z"
 */
router.get("/", controller.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par ID
 *     tags: [Catégories]
 *      responses:
 *       200:
 *         description: Récupère une catégorie par ID
 *         content:
 *           application/json:
 *             example:
 *               - id_categorie: 1
 *                 libelle: "categorie-001"
 *                 created_at: "2025-04-23T11:40:49.215Z"
 *                 updated_at: "2025-04-23T11:40:49.215Z"
 */
router.get("/:id", controller.getCategorieById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie par ID
 *     tags: [Catégories]
 */
router.put("/:id", controller.updateCategorie);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie par ID
 *     tags: [Catégories]
 */
router.delete("/:id", controller.deleteCategorie);

module.exports = router;
