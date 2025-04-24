const express = require("express");
const router = express.Router();
const controller = require("../controllers/projets.controller");

// CRUD Routes
router.post("/", controller.createProjet);
router.get("/", controller.getProjets);
router.get("/:id", controller.getProjetById);
router.put("/:id", controller.updateProjet);
router.delete("/:id", controller.deleteProjet);

module.exports = router;
