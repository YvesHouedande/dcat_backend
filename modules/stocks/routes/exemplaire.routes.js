const express = require("express");
const router = express.Router();
const controller = require("../controllers/exemplaire.controller");

// CRUD Routes
router.post("/", controller.createExemplaire);
router.get("/", controller.getExemplaires);
router.get("/:id", controller.getExemplaireById);
router.get("/series/:num_serie", controller.getExemplaireByNumSerie); //rechercher un exemplaire à partir d'un numéro de series
router.put("/:id", controller.updateExemplaire);
router.delete("/:id", controller.deleteExemplaire);

router.get("/produit/:id", controller.getExemplairesByProduit); // id et code forme la clé étrangère composée de la table produit
// router.get("/:id/is-in-use", controller.isExemplaireInUse); // Vérifie si un exemplaire spécifique est en cours d'utilisation
// router.get("/in-use", controller.isExemplairesInUse); // Récupère tous les exemplaires actuellement en cours d'utilisation

//id: id du produit
router.get("/produit/:id/etat/:etat", controller.filterExemplairesByEtat); //   filtrer les exemplaires selon leur etat (disponible,vendu...)

module.exports = router;
