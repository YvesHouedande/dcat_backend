const express = require("express");
const router = express.Router();

// Import des sous-routes
const clientsRoutes = require("./clients.routes");
const produitsRoutes = require("./produits.routes");
const commandesRoutes = require("./commandes.routes");
const servicesDcatRoutes = require("./services_dcat.routes");
const affichesRoutes = require("./affiches.routes");

// Montage des routes
router.use("/clients", clientsRoutes);
router.use("/produits", produitsRoutes);
router.use("/commandes", commandesRoutes);
router.use("/services", servicesDcatRoutes);
router.use("/affiches", affichesRoutes);

module.exports = router;
