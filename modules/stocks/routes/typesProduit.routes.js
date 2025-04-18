const express = require("express");
const router = express.Router();
const controller = require("../controllers/typesProduit.controller");

// CRUD Routes
router.post("/", controller.createTypeProduit);
router.get("/", controller.getTypeProduits);
router.get("/:id", controller.getTypeProduitById);
router.put("/:id", controller.updateTypeProduit);
router.delete("/{:id}", controller.deleteTypeProduit);

module.exports = router;
