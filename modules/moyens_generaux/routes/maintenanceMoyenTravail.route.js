const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceMoyenTravail.controller");

// CRUD Routes  
router.post("/", controller.createMaintenanceMoyenTravail);
router.get("/", controller.getMaintenanceMoyenTravails);
router.get("/:id", controller.getMaintenanceMoyenTravailById);
router.put("/:id", controller.updateMaintenanceMoyenTravail);
router.delete("/:id", controller.deleteMaintenanceMoyenTravail);

module.exports = router;
