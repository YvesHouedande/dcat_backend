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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Numéro de la page à récupérer (par défaut 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *         description: Nombre d'éléments par page (par défaut 20)
 *     responses:
 *       200:
 *         description: Liste paginée des moyens de travail
 *         content:
 *           application/json:
 *             example:
 *               total: 42
 *               page: 1
 *               pageSize: 20
 *               data:
 *                 - id_moyens_de_travail: 1
 *                   denomination: "Ordinateur portable"
 *                   description: "Dell Latitude 5420"
 *                   created_at: "2024-06-01T12:00:00.000Z"
 *                   updated_at: "2024-06-01T12:00:00.000Z"
 *                 - id_moyens_de_travail: 2
 *                   denomination: "Imprimante"
 *                   description: "HP LaserJet Pro"
 *                   created_at: "2024-06-01T12:00:00.000Z"
 *                   updated_at: "2024-06-01T12:00:00.000Z"
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
