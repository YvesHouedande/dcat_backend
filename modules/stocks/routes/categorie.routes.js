const express = require("express");
const router = express.Router();
const controller = require("../controllers/categorie.controller");

// CRUD Routes
router.post("/", controller.createCategorie);
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategorieById);
router.put("/:id", controller.updateCategorie);
router.delete("/:id", controller.deleteCategorie);

module.exports = router;
