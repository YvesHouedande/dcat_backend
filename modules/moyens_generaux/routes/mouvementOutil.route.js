const express = require("express");
const router = express.Router();
const controller = require("../controllers/mouvementOutil.controller");

router.get("/", controller.getAllOutils);
router.get("/exemplaires", controller.getExemplairesOutils);
// router.get("/employe/:id_employe", controller.outilsSortisEmploye);
router.post("/sortie", controller.enregistrerSortieOutil);
router.post("/entree", controller.enregistrerEntreeOutil);

router.get("/etat/:id_exemplaire/:id_employes", controller.estOutilRetourne); //Vérifier si un produit sorti a été déposé (retourné)
router.get("/historique/:id", controller.getHistoriqueOutils); //[ id : id_produit] Avoir l’historique des entrées et sorties d’outils

router.get("/historiques", controller.getHistoriqueGlobal); //Avoir l’historique des entrées et sorties de tout les outils

module.exports = router;
