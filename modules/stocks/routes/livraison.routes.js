const express = require("express");
const router = express.Router();
const controller = require("../controllers/livraison.controller");

// CRUD Routes
// router.post("/", controller.createLivraison);
// router.get("/", controller.getLivraisons);
// router.get("/:id", controller.getLivraisonById);
// router.put("/:id", controller.updateLivraison);
// router.delete("/:id", controller.deleteLivraison);
// router.get("/livraisons/:id/exemplaires", controller.getLivraisonExemplaire); //Voir les exemplaires ajoutés lors d’une livraison


/**
 * @swagger
 * /api/livraisons:
 *   post:
 *     summary: Crée une nouvelle livraison
 *     tags: [Livraisons]
 */
router.post("/", controller.createLivraison);

/**
 * @swagger
 * /api/livraisons:
 *   get:
 *     summary: Récupère toutes les livraisons
 *     tags: [Livraisons]
 */
router.get("/", controller.getLivraisons);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   get:
 *     summary: Récupère une livraison par ID
 *     tags: [Livraisons]
 */
router.get("/:id", controller.getLivraisonById);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   put:
 *     summary: Met à jour une livraison par ID
 *     tags: [Livraisons]
 */
router.put("/:id", controller.updateLivraison);

/**
 * @swagger
 * /api/livraisons/{id}:
 *   delete:
 *     summary: Supprime une livraison par ID
 *     tags: [Livraisons]
 */
router.delete("/:id", controller.deleteLivraison);

/**
 * @swagger
 * /api/livraisons/{id}/exemplaires:
 *   get:
 *     summary: Récupère les exemplaires ajoutés lors d'une livraison
 *     tags: [Livraisons]
 */
router.get("/livraisons/:id/exemplaires", controller.getLivraisonExemplaire);


module.exports = router;