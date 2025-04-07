const express = require("express");
const router = express.Router();
const controller = require("../controllers/partenaire.controller");

// CRUD Routes
router.post("/", controller.createPartenaire);
router.get("/", controller.getPartenaires);
router.get("/:id", controller.getPartenaireById);
router.put("/:id", controller.updatePartenaire);
router.delete("/:id", controller.deletePartenaire);

module.exports = router;
