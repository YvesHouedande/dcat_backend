const express = require("express");
const router = express.Router();
const tachesController = require("../controllers/taches.controller");

// Routes pour les tâches
/**
 * @swagger
 * /api/taches:
 *   get:
 *     summary: Liste toutes les tâches
 *     tags: [Tâches]
 */
router.get("/", tachesController.getAllTaches);

/**
 * @swagger
 * /api/taches/{id}:
 *   get:
 *     summary: Récupère une tâche par son ID
 *     tags: [Tâches]
 */
router.get("/:id", tachesController.getTacheById);

/**
 * @swagger
 * /api/taches:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     tags: [Tâches]
 */
router.post("/", tachesController.createTache);

/**
 * @swagger
 * /api/taches/{id}:
 *   put:
 *     summary: Met à jour une tâche
 *     tags: [Tâches]
 */
router.put("/:id", tachesController.updateTache);

/**
 * @swagger
 * /api/taches/{id}:
 *   delete:
 *     summary: Supprime une tâche
 *     tags: [Tâches]
 */
router.delete("/:id", tachesController.deleteTache);

// Routes pour la gestion des employés assignés aux tâches
/**
 * @swagger
 * /api/taches/{id}/employes:
 *   post:
 *     summary: Assigne un employé à une tâche
 *     tags: [Tâches]
 */
router.post("/:id/employes", tachesController.addEmployeToTache);

/**
 * @swagger
 * /api/taches/{id}/employes/{employeId}:
 *   delete:
 *     summary: Retire un employé d'une tâche
 *     tags: [Tâches]
 */
router.delete("/:id/employes/:employeId", tachesController.removeEmployeFromTache);

/**
 * @swagger
 * /api/taches/{id}/employes:
 *   get:
 *     summary: Récupère les employés assignés à une tâche
 *     tags: [Tâches]
 */
router.get("/:id/employes", tachesController.getTacheEmployes);

// Obtenir les tâches par projet
/**
 * @swagger
 * /api/taches/projet/{projetId}:
 *   get:
 *     summary: Récupère les tâches associées à un projet
 *     tags: [Tâches]
 */
router.get("/projet/:projetId", tachesController.getTachesByProjet);

module.exports = router;
