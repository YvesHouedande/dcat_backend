const express = require("express");
const router = express.Router();
const controller = require("../controllers/section.controller");

// CRUD Routes
/**
 * @swagger
 * /moyens-generaux/sections:
 *   post:
 *     summary: Crée une nouvelle section
 *     tags: [sections]
 */
router.post("/", controller.createSection);

/**
 * @swagger
 * /moyens-generaux/sections:
 *   get:
 *     summary: Récupère toutes les sections
 *     tags: [sections]
 *     responses:
 *       200:
 *         description: Liste des sections
 *         content:
 *           application/json:
 *             example:
 *               - id_section: 1
 *                 recurrence: "1 an"
 *                 operations: "test-1"
 *                 recommandations: "test-1"
 *                 type_section: "test-1"
 *                 autre_intervenant: null
 *                 id_partenaire: null
 *                 created_at: "2025-04-30T16:39:23.040Z"
 *                 updated_at: "2025-04-30T16:39:23.040Z"
 *               - id_section: 2
 *                 recurrence: "1 an"
 *                 operations: "test-2"
 *                 recommandations: "test-2"
 *                 type_section: "test-2"
 *                 autre_intervenant: null
 *                 id_partenaire: null
 *                 created_at: "2025-04-30T16:39:41.009Z"
 *                 updated_at: "2025-04-30T16:39:41.009Z"
 */

router.get("/", controller.getSections);

/**
 * @swagger
 * /moyens-generaux/sections/{id}:
 *   get:
 *     summary: Récupère une section par ID
 *     tags: [sections]
 */
router.get("/:id", controller.getSectionById);

/**
 * @swagger
 * /moyens-generaux/sections/{id}:
 *   put:
 *     summary: Met à jour une section par ID
 *     tags: [sections]
 */
router.put("/:id", controller.updateSection);

/**
 * @swagger
 * /moyens-generaux/sections/{id}:
 *   delete:
 *     summary: Supprime une section par ID
 *     tags: [sections]
 */
router.delete("/:id", controller.deleteSection);

module.exports = router;
