const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenance.controller");

// CRUD Routes  
/**
 * @swagger
 * /api/maintenances:
 *   post:
 *     summary: Crée une nouvelle maintenance
 *     tags: [Maintenances]
 */
router.post("/", controller.createMaintenance);

/**
 * @swagger
 * /api/maintenances:
 *   get:
 *     summary: Récupère toutes les maintenances
 *     tags: [Maintenances]
 */
router.get("/", controller.getMaintenances);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   get:
 *     summary: Récupère une maintenance par ID
 *     tags: [Maintenances]
 */
router.get("/:id", controller.getMaintenanceById);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   put:
 *     summary: Met à jour une maintenance par ID
 *     tags: [Maintenances]
 */
router.put("/:id", controller.updateMaintenance);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   delete:
 *     summary: Supprime une maintenance par ID
 *     tags: [Maintenances]
 */
router.delete("/:id", controller.deleteMaintenance);


module.exports = router;
