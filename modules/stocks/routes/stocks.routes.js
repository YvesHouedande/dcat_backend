const express = require("express");
const router = express.Router();

// Import des sous-routes
const familleRoutes = require("./famille.routes");
const categorieRoutes = require("./categorie.routes");
const marqueRoutes = require("./marque.routes");
const modeleRoutes = require("./modele.route");
const entiteRoutes = require("./entite.routes");

// Montage des routes
router.use("/familles", familleRoutes);
router.use("/categories", categorieRoutes);
router.use("/marques", marqueRoutes);
router.use("/modeles", modeleRoutes);
router.use("/entites", entiteRoutes);

module.exports = router;
