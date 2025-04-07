const express = require("express");
const router = express.Router();
const controller = require("../controllers/entite.controller");

// CRUD Routes
router.post("/", controller.createEntite);
router.get("/", controller.getEntites);
router.get("/:id", controller.getEntiteById);
router.put("/:id", controller.updateEntite);
router.delete("/:id", controller.deleteEntite);

module.exports = router;
