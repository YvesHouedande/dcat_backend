const express = require("express");
const router = express.Router();
const controller = require("../controllers/interventions.controller");

// CRUD Routes
router.post("/", controller.createIntervention);
router.get("/", controller.getInterventions);
router.get("/:id", controller.getInterventionById);
router.put("/:id", controller.updateIntervention);
router.delete("/:id", controller.deleteIntervention);
router.get("/tache/:tacheId", controller.getInterventionsByTache);
router.post("/:id/employes", controller.assignEmployeToIntervention);
router.delete("/:id/employes/:employeId", controller.removeEmployeFromIntervention);
router.get("/:id/employes", controller.getEmployesByIntervention);

module.exports = router;
