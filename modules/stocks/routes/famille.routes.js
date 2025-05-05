const express = require("express");
const router = express.Router();
const controller = require("../controllers/famille.controller");

// CRUD Routes
// router.post("/", controller.createFamille);
// router.get("/", controller.getFamilles);
// router.get("/:id", controller.getFamilleById);
// router.put("/:id", controller.updateFamille);
// router.delete("/:id", controller.deleteFamille);

/**
 * @swagger
 * /api/familles:
 *   post:
 *     summary: Crée une nouvelle famille
 *     tags: [Familles]
 */
router.post("/", controller.createFamille);

/**
 * @swagger
 * /api/familles:
 *   get:
 *     summary: Récupère toutes les familles
 *     tags: [Familles]
 */
router.get("/", controller.getFamilles);

/**
 * @swagger
 * /api/familles/{id}:
 *   get:
 *     summary: Récupère une famille par ID
 *     tags: [Familles]
 */
router.get("/:id", controller.getFamilleById);

/**
 * @swagger
 * /api/familles/{id}:
 *   put:
 *     summary: Met à jour une famille par ID
 *     tags: [Familles]
 */
router.put("/:id", controller.updateFamille);

/**
 * @swagger
 * /api/familles/{id}:
 *   delete:
 *     summary: Supprime une famille par ID
 *     tags: [Familles]
 */
router.delete("/:id", controller.deleteFamille);


module.exports = router;