const express = require("express");
const router = express.Router();
const controller = require("../controllers/client.controller");

// CRUD Routes

/**
 * @swagger
 * /stocks/clients:
 *   post:
 *     summary: Crée une nouvelle famille
 *     tags: [Client]
 */
router.post("/", controller.createClient);

/**
 * @swagger
 * /stocks/clients:
 *   get:
 *     summary: Récupère toutes les client
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Liste des client
 *         content:
 *           application/json:
 *             example:
 *               - id_famille: 1
 *                 libelle_famille: "famille-001"
 *                 created_at: "2025-04-23T11:38:03.375Z"
 *                 updated_at: "2025-04-23T11:38:03.375Z"
 *               - id_famille: 2
 *                 libelle_famille: "famille-002"
 *                 created_at: "2025-04-23T11:38:07.292Z"
 *                 updated_at: "2025-04-23T11:38:07.292Z"
 *               - id_famille: 3
 *                 libelle_famille: "famille-003"
 *                 created_at: "2025-04-23T11:38:12.014Z"
 *                 updated_at: "2025-04-23T11:38:12.014Z"
 */

router.get("/", controller.getClients);

/**
 * @swagger
 * /stocks/clients/{id}:
 *   get:
 *     summary: Récupère une famille par ID
 *     tags: [Client]
 */
router.get("/:id", controller.getClientById);

/**
 * @swagger
 * /stocks/clients/{id}:
 *   put:
 *     summary: Met à jour une famille par ID
 *     tags: [Client]
 */
router.put("/:id", controller.updateClient);

/**
 * @swagger
 * /stocks/clients/{id}:
 *   delete:
 *     summary: Supprime une famille par ID
 *     tags: [Client]
 */
router.delete("/:id", controller.deleteClient);


module.exports = router;