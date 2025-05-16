const express = require("express");
const router = express.Router();
const controller = require("../controllers/moyensdeTravail.controller");

// CRUD Routes
/**
 * @swagger
 * /moyens-generaux/moyens-travails:
 *   post:
 *     summary: Crée un nouveau moyen de travail
 *     tags: [Moyens de Travail]
 */
router.post("/", controller.createMoyensTravail);

/**
 * @swagger
 * /moyens-generaux/moyens-travails:
 *   get:
 *     summary: Récupère tous les moyens de travail
 *     tags: [Moyens de Travail]
 */
router.get("/", controller.getMoyensTravails);

/**
 * @swagger
 * /moyens-generaux/moyens-travails/{id}:
 *   get:
 *     summary: Récupère un moyen de travail par ID
 *     tags: [Moyens de Travail]
 */
router.get("/:id", controller.getMoyensTravailById);

/**
 * @swagger
 * /moyens-generaux/moyens-travails/{id}:
 *   put:
 *     summary: Met à jour un moyen de travail par ID
 *     tags: [Moyens de Travail]
 */
router.put("/:id", controller.updateMoyensTravail);

/**
 * @swagger
 * /moyens-generaux/moyens-travails/{id}:
 *   delete:
 *     summary: Supprime un moyen de travail par ID
 *     tags: [Moyens de Travail]
 */
router.delete("/:id", controller.deleteMoyensTravail);

module.exports = router;
