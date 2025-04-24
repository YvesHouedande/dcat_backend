const express = require("express");
const router = express.Router();
const controller = require("../controllers/achat.controller");

/**
 * id: id de la livraison
 */
router.get("/", controller.getAllAchats);
router.get("/:id", controller.getAchatById);
router.put("/:id", controller.updateAchat);
router.get("/exemplaire/:id", controller.getAchatByExemplaireId);

module.exports = router;
