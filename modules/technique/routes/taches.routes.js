const express = require("express");
const router = express.Router();
const controller = require("../controllers/taches.controller");

// CRUD Routes
router.post("/", controller.createTache);
router.get("/", controller.getTaches);
router.get("/:id", controller.getTacheById);
router.put("/:id", controller.updateTache);
router.delete("/:id", controller.deleteTache);
router.get("/projet/:projetId", controller.getTachesByProjet);

module.exports = router;
