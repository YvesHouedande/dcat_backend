const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");


router.post("/", controller.createSortie);
router.get("/", controller.getSorties);
router.get("/:id", controller.getSortieDetails);
router.put("/:id", controller.updateSortie);
router.delete("/:id", controller.deleteSortie);

module.exports = router;