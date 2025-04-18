const express = require("express");
const router = express.Router();
const controller = require("../controllers/exemplaire.controller");

// CRUD Routes
router.post("/", controller.createExemplaire);
router.get("/", controller.getExemplaires);
router.get("/:id", controller.getExemplaireById);
router.put("/:id", controller.updateExemplaire);
router.delete("/:id", controller.deleteExemplaire);
router.get("/produit/:id/:code", controller.getAllExemplaireProduit); // id et code forme la clé étrangère composée
router.post("/purchase/:exemplaireId/:partenaireId", controller.purchaseExemplaire); //achat d'un exemplaire
router.post("/affectation/:exemplaireId/:projetId/:employeId", controller.assignExemplaire); // Affecter un exemplaire à un employé pour un projet

module.exports = router;
