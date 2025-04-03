const express = require("express");
const router = express.Router();

// Import des sous-routes
const familleRoutes = require("./famille.routes");

// Montage des routes
router.use("/familles", familleRoutes);

// Vous pourriez ajouter d'autres routes ici
// router.use("/articles", articleRoutes);

module.exports = router;