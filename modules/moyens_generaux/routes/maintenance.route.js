const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenance.controller");

// CRUD Routes  
router.post("/", controller.createMaintenance);
router.get("/", controller.getMaintenances);
router.get("/:id", controller.getMaintenanceById);
router.put("/:id", controller.updateMaintenance);
router.delete("/:id", controller.deleteMaintenance);

module.exports = router;
