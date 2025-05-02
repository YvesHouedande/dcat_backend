const express = require("express");
const router = express.Router();
const controller = require("../controllers/marque.controller");

// CRUD Routes
// router.post("/", controller.createMarque);
// router.get("/", controller.getMarques);
// router.get("/:id", controller.getMarqueById);
// router.put("/:id", controller.updateMarque);
// router.delete("/:id", controller.deleteMarque);

/**
 * @swagger
 * /api/marques:
 *   post:
 *     summary: Crée une nouvelle marque
 *     tags: [Marques]
 */
router.post("/", controller.createMarque);

/**
 * @swagger
 * /api/marques:
 *   get:
 *     summary: Récupère toutes les marques
 *     tags: [Marques]
 */
router.get("/", controller.getMarques);

/**
 * @swagger
 * /api/marques/{id}:
 *   get:
 *     summary: Récupère une marque par ID
 *     tags: [Marques]
 */
router.get("/:id", controller.getMarqueById);

/**
 * @swagger
 * /api/marques/{id}:
 *   put:
 *     summary: Met à jour une marque par ID
 *     tags: [Marques]
 */
router.put("/:id", controller.updateMarque);

/**
 * @swagger
 * /api/marques/{id}:
 *   delete:
 *     summary: Supprime une marque par ID
 *     tags: [Marques]
 */
router.delete("/:id", controller.deleteMarque);


module.exports = router;
