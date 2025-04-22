const express = require("express");
const router = express.Router();
const controller = require("../controllers/exemplaire.controller");

// CRUD Routes
router.post("/", controller.createExemplaire);
router.get("/", controller.getExemplaires);
router.get("/:id", controller.getExemplaireById);
router.put("/:id", controller.updateExemplaire);
router.delete("/:id", controller.deleteExemplaire);
router.get("/produit/:id/:code", controller.getExemplairesByProduit); // id et code forme la clé étrangère composée de la table produit
router.get("/available", controller.getAvailableExemplaires);
router.get("/:id/is-in-use", controller.isExemplaireInUse);     // Vérifie si un exemplaire spécifique est en cours d'utilisation
router.get("/in-use", controller.isExemplairesInUse);       // Récupère tous les exemplaires actuellement en cours d'utilisation
router.post("/purchase/:exemplaireId/:partenaireId", controller.purchaseExemplaire); //achat d'un exemplaire
router.post("/affectation/:exemplaireId/:projetId/:employeId", controller.assignExemplaire); // Affecter un exemplaire à un employé pour un projet

module.exports = router;
