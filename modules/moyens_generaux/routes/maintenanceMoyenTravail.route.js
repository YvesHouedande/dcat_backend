const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceMoyenTravail.controller");

// CRUD Routes  
/**
 * @swagger
 * /maintenance-moyen-travails:
 *   post:
 *     summary: Crée une nouvelle maintenance de moyen de travail
 *     tags: [Maintenances Moyens de Travail]
 */
router.post("/", controller.createMaintenanceMoyenTravail);

/**
 * @swagger
 * /maintenance-moyen-travails:
 *   get:
 *     summary: Récupère toutes les maintenances des moyens de travail
 *     tags: [Maintenances Moyens de Travail]
 */
router.get("/", controller.getMaintenanceMoyenTravails);

/**
 * @swagger
 * /maintenance-moyen-travails/{id}:
 *   get:
 *     summary: Récupère une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Maintenance récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_maintenance:
 *                   type: integer
 *                   example: 1
 *                 recurrence:
 *                   type: string
 *                   example: "1 an"
 *                 operations:
 *                   type: string
 *                   example: "test-1"
 *                 recommandations:
 *                   type: string
 *                   example: "test-1"
 *                 type_maintenance:
 *                   type: string
 *                   example: "test-1"
 *                 autre_intervenant:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 id_partenaire:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T16:39:23.040Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-30T16:39:23.040Z"
 *       404:
 *         description: Maintenance non trouvée
 */

router.get("/:id", controller.getMaintenanceMoyenTravailById);

/**
 * @swagger
 * /maintenance-moyen-travails/{id}:
 *   put:
 *     summary: Met à jour une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 */
router.put("/:id", controller.updateMaintenanceMoyenTravail);

/**
 * @swagger
 * /maintenance-moyen-travails/{id}:
 *   delete:
 *     summary: Supprime une maintenance de moyen de travail par ID
 *     tags: [Maintenances Moyens de Travail]
 */
router.delete("/:id", controller.deleteMaintenanceMoyenTravail);


module.exports = router;
