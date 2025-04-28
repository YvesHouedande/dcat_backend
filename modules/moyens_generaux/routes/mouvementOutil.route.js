const express = require("express");
const router = express.Router();
const controller = require("../controllers/mouvementOutil.controller");


router.get("/liste", controller.listOutils);
router.get("/historique", controller.historiqueOutil);
router.get("/employe/:id_employe", controller.outilsSortisEmploye);
router.post("/sortir", controller.sortir);
router.post("/retourner", controller.retourner);

module.exports = router;
