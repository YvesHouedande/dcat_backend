const express = require("express");
const router = express.Router();
const tachesController = require("../controllers/taches.controller");

// Routes pour les tâches
router.get("/", tachesController.getAllTaches);
router.get("/:id", tachesController.getTacheById);
router.post("/", tachesController.createTache);
router.put("/:id", tachesController.updateTache);
router.delete("/:id", tachesController.deleteTache);

// Routes pour la gestion des employés assignés aux tâches
router.post("/:id/employes", tachesController.addEmployeToTache);
router.delete("/:id/employes/:employeId", tachesController.removeEmployeFromTache);
router.get("/:id/employes", tachesController.getTacheEmployes);

// Obtenir les tâches par projet
router.get("/projet/:projetId", tachesController.getTachesByProjet);

module.exports = router;
