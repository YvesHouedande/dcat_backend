const express = require("express");
const router = express.Router();

// Import des sous-routes
const outilsRoutes = require("./mouvementOutil.route");


// Montage des routes
router.use("/outils", outilsRoutes);


module.exports = router;
