const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");


// router.post("/", controller.createSortie);
// router.get("/", controller.getSorties);
// router.get("/:id", controller.getSortieDetails);
// router.put("/:id", controller.updateSortie);
// router.delete("/:id", controller.deleteSortie);

// /**
//  * @swagger
//  * /sorties-exemplaires:
//  *   post:
//  *     summary: Crée une nouvelle sortie d'exemplaire
//  *     tags: [Sorties Exemplaire]
//  */
router.post("/", controller.createSortie);

// /**
//  * @swagger
//  * /sorties-exemplaires:
//  *   get:
//  *     summary: Récupère toutes les sorties d'exemplaires
//  *     tags: [Sorties Exemplaire]
//  */
router.get("/", controller.getSorties);

// /**
//  * @swagger
//  * /sorties-exemplaires/{id}:
//  *   get:
//  *     summary: Récupère les détails d'une sortie d'exemplaire par ID
//  *     tags: [Sorties Exemplaire]
//  */
router.get("/:id", controller.getSortieDetails);

// /**
//  * @swagger
//  * /sorties-exemplaires/{id}:
//  *   put:
//  *     summary: Met à jour une sortie d'exemplaire par ID
//  *     tags: [Sorties Exemplaire]
//  */
router.put("/:id", controller.updateSortie);

// /**
//  * @swagger
//  * /sorties-exemplaires/{id}:
//  *   delete:
//  *     summary: Supprime une sortie d'exemplaire par ID
//  *     tags: [Sorties Exemplaire]
//  */
router.delete("/:id", controller.deleteSortie);


module.exports = router;