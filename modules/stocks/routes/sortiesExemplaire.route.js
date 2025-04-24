const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");


router.get("/", controller.getAllSorties);
router.get("/:id", controller.getSortieById);
router.post("/", controller.createSortie);
router.put("/:id", controller.updateSortie);
router.delete("/:id", controller.deleteSortie);

module.exports = router;