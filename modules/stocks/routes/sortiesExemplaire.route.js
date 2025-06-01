const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");

//Routes liées aux sorties d'exemplaires (les exemplaires qui ont été commander par exemplaire)

// router.post("/", controller.createSortie);
// router.get("/", controller.getSorties);
// router.get("/:id", controller.getSortieDetails);
// router.put("/:id", controller.updateSortie);
// router.delete("/:id", controller.deleteSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires:
 *   post:
 *     summary: Crée une nouvelle sortie d'exemplaire
 *     tags: [Sorties Exemplaire]
 */
router.post("/", controller.createSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires:
 *   get:
 *     summary: Récupère toutes les sorties d'exemplaires
 *     tags: [Sorties Exemplaire]
 */
router.get("/", controller.getSorties);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   get:
 *     summary: Récupère les détails d'une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.get("/:id", controller.getSortieDetails);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   put:
 *     summary: Met à jour une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.put("/:id", controller.updateSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   delete:
 *     summary: Supprime une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.delete("/:id", controller.deleteSortie);

module.exports = router;
