const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");


// router.post("/", controller.createSortie);
// router.get("/", controller.getSorties);
// router.get("/:id", controller.getSortieDetails);
// router.put("/:id", controller.updateSortie);
// router.delete("/:id", controller.deleteSortie);

/**
 * @swagger
 * /api/sorties:
 *   post:
 *     summary: Crée une nouvelle sortie d'exemplaire
 *     tags: [Sorties Exemplaire]
 */
router.post("/", controller.createSortie);

/**
 * @swagger
 * /api/sorties:
 *   get:
 *     summary: Récupère toutes les sorties d'exemplaires
 *     tags: [Sorties Exemplaire]
 */
router.get("/", controller.getSorties);

/**
 * @swagger
 * /api/sorties/{id}:
 *   get:
 *     summary: Récupère les détails d'une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.get("/:id", controller.getSortieDetails);

/**
 * @swagger
 * /api/sorties/{id}:
 *   put:
 *     summary: Met à jour une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.put("/:id", controller.updateSortie);

/**
 * @swagger
 * /api/sorties/{id}:
 *   delete:
 *     summary: Supprime une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.delete("/:id", controller.deleteSortie);


module.exports = router;