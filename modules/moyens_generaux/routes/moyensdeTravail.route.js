const express = require("express");
const router = express.Router();
const controller = require("../controllers/moyensdeTravail.controller");

// CRUD Routes  
router.post("/", controller.createMoyensTravail);
router.get("/", controller.getMoyensTravails);
router.get("/:id", controller.getMoyensTravailById);
router.put("/:id", controller.updateMoyensTravail);
router.delete("/:id", controller.deleteMoyensTravail);

module.exports = router;
