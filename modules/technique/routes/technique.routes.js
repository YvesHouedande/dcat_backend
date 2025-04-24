const express = require("express");
const router = express.Router();

// Import des sous-routes
const interventionsRoutes = require("./interventions.routes");
const projetsRoutes = require("./projets.routes");
const tachesRoutes = require("./taches.routes");

// Montage des routes
router.use("/interventions", interventionsRoutes);
router.use("/projets", projetsRoutes);
router.use("/taches", tachesRoutes);

module.exports = router;
