const express = require("express");
const router = express.Router();

// Import des sous-routes
const outilsRoutes = require("./mouvementOutil.route");
const moyenstravailRoutes = require("./moyensdeTravail.route"); //moyens de travail


// Montage des routes
router.use("/outils", outilsRoutes);
router.use("/moyens-travail", moyenstravailRoutes);


module.exports = router;
