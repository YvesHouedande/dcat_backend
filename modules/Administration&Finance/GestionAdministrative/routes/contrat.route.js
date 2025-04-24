const contratcontroller = require('../controllers/contrat.controller');
const express = require('express');
const router = express.Router();

router.post("/", contratcontroller.createContrat);
router.get("/", contratcontroller.getContrats);
router.get("/:id", contratcontroller.getContratbyPartenaire);
router.put("/:id", contratcontroller.updateContrat);
router.delete("/:id", contratcontroller.deleteContrat);

module.exports = router;