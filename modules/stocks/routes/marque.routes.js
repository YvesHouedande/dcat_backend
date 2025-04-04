const express = require("express");
const router = express.Router();
const controller = require("../controllers/marque.controller");

// CRUD Routes
router.post("/", controller.createMarque);
router.get("/", controller.getMarques);
router.get("/:id", controller.getMarqueById);
router.put("/:id", controller.updateMarque);
router.delete("/:id", controller.deleteMarque);

module.exports = router;
