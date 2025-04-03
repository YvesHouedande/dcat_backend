const express = require("express");
const router = express.Router();

// Import des sous-routes
const familleRoutes = require("./famille.routes");
const categorieRoutes = require("./categorie.routes");

// Montage des routes
router.use("/familles", familleRoutes);
router.use("/categories", categorieRoutes);

module.exports = router;
