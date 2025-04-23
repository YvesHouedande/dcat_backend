const express = require("express");
const router = express.Router();
const controller = require("../controllers/livraison.controller");

// CRUD Routes
router.post("/", controller.createLivraison);
router.get("/", controller.getLivraisons);
router.get("/:id", controller.getLivraisonById);
router.put("/:id", controller.updateLivraison);
router.delete("/:id", controller.deleteLivraison);
router.delete("/livraisons/:id/exemplaires", controller.getLivraisonExemplaire); //Voir les exemplaires ajoutés lors d’une livraison

module.exports = router;