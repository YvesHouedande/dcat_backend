const express = require("express");
const router = express.Router();

// Import des sous-routes
const familleRoutes = require("./famille.routes");
const categorieRoutes = require("./categorie.routes");
const marqueRoutes = require("./marque.routes");
const modeleRoutes = require("./modele.routes");
const produitRoutes = require("./produit.routes");
const exemplaireRoutes = require("./exemplaire.routes");
const livraisonRoutes = require("./livraison.routes");

// Montage des routes
router.use("/familles", familleRoutes);
router.use("/categories", categorieRoutes);
router.use("/marques", marqueRoutes);
router.use("/modeles", modeleRoutes);
router.use("/produits", produitRoutes);
router.use("/exemplaires", exemplaireRoutes);
router.use("/livraisons", livraisonRoutes);

module.exports = router;