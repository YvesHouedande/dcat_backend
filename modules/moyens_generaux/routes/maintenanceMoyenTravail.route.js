const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceMoyenTravail.controller");

// CRUD Routes  
/**
 * @swagger
 * /api/maintenance-moyen-travails:
 *   post:
 *     summary: Crée une nouvelle maintenance de moyen de travail
 *     tags: [Maintenances Moyens de Travail]
 */
router.post("/", controller.createMaintenanceMoyenTravail);

/**
 * @swagger
 * /api/maintenance-moyen-travails:
 *   get:
 *     summary: Récupère toutes les maintenances des moyens de travail
 *     tags: [Maintenances Moyens de Travail]
 */
router.get("/", controller.getMaintenanceMoyenTravails);

/**
 * @swagger
 * /api/maintenance-moyen-travails/{id}:
 *   get:
 *     summary: Récupère une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 */
router.get("/:id", controller.getMaintenanceMoyenTravailById);

/**
 * @swagger
 * /api/maintenance-moyen-travails/{id}:
 *   put:
 *     summary: Met à jour une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 */
router.put("/:id", controller.updateMaintenanceMoyenTravail);

/**
 * @swagger
 * /api/maintenance-moyen-travails/{id}:
 *   delete:
 *     summary: Supprime une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 */
router.delete("/:id", controller.deleteMaintenanceMoyenTravail);


module.exports = router;
