const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenance.controller");

// CRUD Routes
// /**
//  * @swagger
//  * /maintenances:
//  *   post:
//  *     summary: Crée une nouvelle maintenance
//  *     tags: [Maintenances]
//  */
router.post("/", controller.createMaintenance);

// /**
//  * @swagger
//  * /maintenances:
//  *   get:
//  *     summary: Récupère toutes les maintenances
//  *     tags: [Maintenances]
//  *     responses:
//  *       200:
//  *         description: Liste des maintenances
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_maintenance: 1
//  *                 recurrence: "1 an"
//  *                 operations: "test-1"
//  *                 recommandations: "test-1"
//  *                 type_maintenance: "test-1"
//  *                 autre_intervenant: null
//  *                 id_partenaire: null
//  *                 created_at: "2025-04-30T16:39:23.040Z"
//  *                 updated_at: "2025-04-30T16:39:23.040Z"
//  *               - id_maintenance: 2
//  *                 recurrence: "1 an"
//  *                 operations: "test-2"
//  *                 recommandations: "test-2"
//  *                 type_maintenance: "test-2"
//  *                 autre_intervenant: null
//  *                 id_partenaire: null
//  *                 created_at: "2025-04-30T16:39:41.009Z"
//  *                 updated_at: "2025-04-30T16:39:41.009Z"
//  */

router.get("/", controller.getMaintenances);

// /**
//  * @swagger
//  * /maintenances/{id}:
//  *   get:
//  *     summary: Récupère une maintenance par ID
//  *     tags: [Maintenances]
//  */
router.get("/:id", controller.getMaintenanceById);

// /**
//  * @swagger
//  * /maintenances/{id}:
//  *   put:
//  *     summary: Met à jour une maintenance par ID
//  *     tags: [Maintenances]
//  */
router.put("/:id", controller.updateMaintenance);

// /**
//  * @swagger
//  * /maintenances/{id}:
//  *   delete:
//  *     summary: Supprime une maintenance par ID
//  *     tags: [Maintenances]
//  */
router.delete("/:id", controller.deleteMaintenance);

module.exports = router;
