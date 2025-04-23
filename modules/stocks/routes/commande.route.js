const express = require("express");
const router = express.Router();
const controller = require("../controllers/commande.controller");


router.post("/", controller.createCommande);
router.get("/", controller.getCommandes);
router.get("/:id", controller.getCommandeById);
router.put("/:id", controller.updateCommande);
router.delete("/:id", controller.deleteCommande);

module.exports = router;
