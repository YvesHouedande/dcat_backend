const express = require("express");
const router = express.Router();
const controller = require("../controllers/modele.controller");

// CRUD Routes
router.post("/", controller.createModele);
router.get("/", controller.getModeles);
router.get("/:id", controller.getModeleById);
router.put("/:id", controller.updateModele);
router.delete("/:id", controller.deleteModele);

module.exports = router;
