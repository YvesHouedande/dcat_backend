const express = require("express");
const router = express.Router();
const controller = require("../controllers/mouvementOutil.controller");

// router.get("/", controller.getAllOutils);
// router.get("/exemplaires", controller.getExemplairesOutils);
// // router.get("/employe/:id_employe", controller.outilsSortisEmploye);
// router.post("/sortie", controller.enregistrerSortieOutil);
// router.post("/entree", controller.enregistrerEntreeOutil);

// router.get("/etat/:id_exemplaire/:id_employes", controller.estOutilRetourne); //Vérifier si un produit sorti a été déposé (retourné)
// router.get("/historique/:id", controller.getHistoriqueOutils); //[ id : id_produit] Avoir l’historique des entrées et sorties d’outils

// router.get("/historiques", controller.getHistoriqueGlobal); //Avoir l’historique des entrées et sorties de tout les outils


/**
 * @swagger
 * /api/outils:
 *   get:
 *     summary: Récupère tous les outils
 *     tags: [Outils]
 */
router.get("/", controller.getAllOutils);

/**
 * @swagger
 * /api/outils/exemplaires:
 *   get:
 *     summary: Récupère les exemplaires d'outils
 *     tags: [Outils]
 */
router.get("/exemplaires", controller.getExemplairesOutils);

/**
 * @swagger
 * /api/outils/sortie:
 *   post:
 *     summary: Enregistre une sortie d'outil
 *     tags: [Outils]
 */
router.post("/sortie", controller.enregistrerSortieOutil);

/**
 * @swagger
 * /api/outils/entree:
 *   post:
 *     summary: Enregistre une entrée d'outil
 *     tags: [Outils]
 */
router.post("/entree", controller.enregistrerEntreeOutil);

/**
 * @swagger
 * /api/outils/etat/{id_exemplaire}/{id_employes}:
 *   get:
 *     summary: Vérifie si un outil sorti a été retourné
 *     tags: [Outils]
 */
router.get("/etat/:id_exemplaire/:id_employes", controller.estOutilRetourne);

/**
 * @swagger
 * /api/outils/historique/{id}:
 *   get:
 *     summary: Récupère l'historique des entrées et sorties d'un outil spécifique
 *     tags: [Outils]
 */
router.get("/historique/:id", controller.getHistoriqueOutils);

/**
 * @swagger
 * /api/outils/historiques:
 *   get:
 *     summary: Récupère l'historique global des entrées et sorties de tous les outils
 *     tags: [Outils]
 */
router.get("/historiques", controller.getHistoriqueGlobal);


module.exports = router;
