const express = require("express");
const router = express.Router();
const controller = require("../controllers/produit.controller");

// CRUD Routes
router.post("/", controller.createProduit);
router.get("/", controller.getProduits);
router.get("/:id", controller.getProduitById);
router.get("/:idType", controller.getProduitsByTypes); // afficher tous les outils/équipements
router.put("/:id", controller.updateProduit);
router.delete("/:id", controller.deleteProduit);

module.exports = router;
