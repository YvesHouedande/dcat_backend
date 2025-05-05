const express = require("express");
const router = express.Router();
const controller = require("../controllers/modele.controller");

// CRUD Routes
// router.post("/", controller.createModele);
// router.get("/", controller.getModeles);
// router.get("/:id", controller.getModeleById);
// router.put("/:id", controller.updateModele);
// router.delete("/:id", controller.deleteModele);

/**
 * @swagger
 * /api/modeles:
 *   post:
 *     summary: Crée un nouveau modèle
 *     tags: [Modèles]
 */
router.post("/", controller.createModele);

/**
 * @swagger
 * /api/modeles:
 *   get:
 *     summary: Récupère tous les modèles
 *     tags: [Modèles]
 */
router.get("/", controller.getModeles);

/**
 * @swagger
 * /api/modeles/{id}:
 *   get:
 *     summary: Récupère un modèle par ID
 *     tags: [Modèles]
 */
router.get("/:id", controller.getModeleById);

/**
 * @swagger
 * /api/modeles/{id}:
 *   put:
 *     summary: Met à jour un modèle par ID
 *     tags: [Modèles]
 */
router.put("/:id", controller.updateModele);

/**
 * @swagger
 * /api/modeles/{id}:
 *   delete:
 *     summary: Supprime un modèle par ID
 *     tags: [Modèles]
 */
router.delete("/:id", controller.deleteModele);


module.exports = router;
