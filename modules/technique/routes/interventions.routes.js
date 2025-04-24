const express = require("express");
const router = express.Router();
const interventionsController = require("../controllers/interventions.controller");
const uploadMiddleware = require("../utils/middleware/uploadMiddleware");

// Routes pour les interventions
router.get("/", interventionsController.getAllInterventions);
router.get("/:id", interventionsController.getInterventionById);
router.post("/", interventionsController.createIntervention);
router.put("/:id", interventionsController.updateIntervention);
router.delete("/:id", interventionsController.deleteIntervention);

// Route pour ajouter un document à une intervention
router.post("/:id/documents", uploadMiddleware.single("document"), interventionsController.addDocumentToIntervention);

// Routes pour la gestion des liens avec les employés
router.post("/:id/employes", interventionsController.addEmployeToIntervention);
router.delete("/:id/employes/:employeId", interventionsController.removeEmployeFromIntervention);
router.get("/:id/employes", interventionsController.getInterventionEmployes);

module.exports = router;
