const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenance.controller");

// CRUD Routes
/**
 * @swagger
 * /moyens-generaux/maintenances:
 *   post:
 *     summary: Crée une nouvelle maintenance
 *     tags: [Maintenances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_maintenance:
 *                 type: string
 *                 example: "corrective"
 *               recurrence:
 *                 type: string
 *                 example: "unique"
 *               date_planifiee:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-10"
 *               operations:
 *                 type: string
 *                 example: "Remplacement du filtre"
 *               employesIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 5, 7]
 */
router.post("/", controller.createMaintenance);

/**
 * @swagger
 * /moyens-generaux/maintenances:
 *   get:
 *     summary: Récupère toutes les maintenances (avec filtres et pagination)
 *     tags: [Maintenances]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: type_maintenance
 *         schema:
 *           type: string
 *         description: Filtrer par type de maintenance
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: recurrence
 *         schema:
 *           type: string
 *         description: Filtrer par récurrence
 *       - in: query
 *         name: date_planifiee
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date planifiée
 *     responses:
 *       200:
 *         description: Liste des maintenances
 *         content:
 *           application/json:
 *             example:
 *               total: 2
 *               page: 1
 *               pageSize: 20
 *               data:
 *                 - id_maintenance: 1
 *                   recurrence: "1 an"
 *                   operations: "test-1"
 *                   recommandations: "test-1"
 *                   type_maintenance: "test-1"
 *                   autre_intervenant: null
 *                   id_partenaire: null
 *                   created_at: "2025-04-30T16:39:23.040Z"
 *                   updated_at: "2025-04-30T16:39:23.040Z"
 *                 - id_maintenance: 2
 *                   recurrence: "1 an"
 *                   operations: "test-2"
 *                   recommandations: "test-2"
 *                   type_maintenance: "test-2"
 *                   autre_intervenant: null
 *                   id_partenaire: null
 *                   created_at: "2025-04-30T16:39:41.009Z"
 *                   updated_at: "2025-04-30T16:39:41.009Z"
 */
router.get("/", controller.getMaintenances);

/**
 * @swagger
 * /moyens-generaux/maintenances/ponctuelles:
 *   get:
 *     summary: Récupère toutes les maintenances ponctuelles (uniques)
 *     tags: [Maintenances]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des maintenances ponctuelles
 */
router.get("/ponctuelles", controller.getPonctualMaintenances);

/**
 * @swagger
 * /moyens-generaux/maintenances/recurrentes:
 *   get:
 *     summary: Récupère toutes les maintenances récurrentes
 *     tags: [Maintenances]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des maintenances récurrentes
 */
router.get("/recurrentes", controller.getRecurrentMaintenances);

/**
 * @swagger
 * /moyens-generaux/maintenances/{id}:
 *   get:
 *     summary: Récupère une maintenance par ID
 *     tags: [Maintenances]
 */
router.get("/:id", controller.getMaintenanceById);

/**
 * @swagger
 * /moyens-generaux/maintenances/{id}:
 *   put:
 *     summary: Met à jour une maintenance par ID
 *     tags: [Maintenances]
 */
router.put("/:id", controller.updateMaintenance);

/**
 * @swagger
 * /moyens-generaux/maintenances/{id}/statut:
 *   patch:
 *     summary: Met à jour uniquement le statut d'une maintenance
 *     tags: [Maintenances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 example: "effectuee"
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch("/:id/statut", controller.updateMaintenanceStatus);

/**
 * @swagger
 * /moyens-generaux/maintenances/{id}:
 *   delete:
 *     summary: Supprime une maintenance par ID
 *     tags: [Maintenances]
 */
router.delete("/:id", controller.deleteMaintenance);

module.exports = router;
