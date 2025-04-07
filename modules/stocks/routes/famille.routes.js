const express = require("express");
const router = express.Router();
const controller = require("../controllers/famille.controller");

// CRUD Routes
router.post("/", controller.createFamille);
router.get("/", controller.getFamilles);
router.get("/:id", controller.getFamilleById);
router.put("/:id", controller.updateFamille);
router.delete("/{:id}", controller.deleteFamille);

module.exports = router;