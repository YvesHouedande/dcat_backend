const express = require("express");
const router = express.Router();
const tachesController = require("../controllers/taches.controller");

// Routes pour les tâches
/**
 * @swagger
 * /technique/taches:
 *   get:
 *     summary: Liste toutes les tâches
 *     tags:
 *       - Tâches
 */
router.get("/", tachesController.getAllTaches);

/**
 * @swagger
 * /technique/taches/{id}:
 *   get:
 *     summary: Récupère une tâche par son ID
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 */
router.get("/:id", tachesController.getTacheById);

/**
 * @swagger
 * /technique/taches:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     tags:
 *       - Tâches
 */
router.post("/", tachesController.createTache);

/**
 * @swagger
 * /technique/taches/{id}:
 *   put:
 *     summary: Met à jour une tâche
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 */
router.put("/:id", tachesController.updateTache);

/**
 * @swagger
 * /technique/taches/{id}:
 *   delete:
 *     summary: Supprime une tâche
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 */
router.delete("/:id", tachesController.deleteTache);

// Routes pour la gestion des employés assignés aux tâches
/**
 * @swagger
 * /technique/taches/{id}/employes:
 *   post:
 *     summary: Assigne un employé à une tâche
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 */
router.post("/:id/employes", tachesController.addEmployeToTache);

/**
 * @swagger
 * /technique/taches/{id}/employes/{employeId}:
 *   delete:
 *     summary: Retire un employé d'une tâche
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *       - in: path
 *         name: employeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 */
router.delete("/:id/employes/:employeId", tachesController.removeEmployeFromTache);

/**
 * @swagger
 * /technique/taches/{id}/employes:
 *   get:
 *     summary: Récupère les employés assignés à une tâche
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 */
router.get("/:id/employes", tachesController.getTacheEmployes);

// Obtenir les tâches par projet
/**
 * @swagger
 * /technique/taches/projet/{projetId}:
 *   get:
 *     summary: Récupère les tâches associées à un projet
 *     tags:
 *       - Tâches
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 */
router.get("/projet/:projetId", tachesController.getTachesByProjet);

module.exports = router;
