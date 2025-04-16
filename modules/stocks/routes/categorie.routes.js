const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorie.controller");

// CRUD Routes
router.post("/", controller.createCategorie);
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategorieById);
router.put("/:id", controller.updateCategorie);
router.delete("/:id", controller.deleteCategorie);
router.get("/all/produits/:id", controller.getAllCategorieProduit); //recupérer tout les produits d'une catégorie
router.get("/all/familles/:id", controller.getAllCategorieFamille); //recupérer toutes les familles d'une catégorie

module.exports = router;
