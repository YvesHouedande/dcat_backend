const express = require("express");
const router = express.Router();
const entiteRoutes = require("./entity.route");
const partnerRoutes = require("./partner.route");
const demandRoutes = require("./demand.route");
// CRUD Routes
router.use("/entites", entiteRoutes);
router.use("/partners", partnerRoutes);
router.use("/demandes", demandRoutes);

module.exports = router;
