const express = require("express");
const router = express.Router();
const controller = require("../controllers/achat.controller");

/**
 * id: id de la livraison
 */


/**
 * @swagger
 * /api/achats:
 *   get:
 *     summary: Récupère tous les achats
 *     tags: [Achats]
 */
router.get("/", controller.getAllAchats);

/**
 * @swagger
 * /api/achats/{id}:
 *   get:
 *     summary: Récupère un achat par ID
 *     tags: [Achats]
 */
router.get("/:id", controller.getAchatById);

/**
 * @swagger
 * /api/achats/{id}:
 *   put:
 *     summary: Met à jour un achat par ID
 *     tags: [Achats]
 */
router.put("/:id", controller.updateAchat);

/**
 * @swagger
 * /api/achats/exemplaire/{id}:
 *   get:
 *     summary: Récupère un achat via l'ID d'un exemplaire
 *     tags: [Achats]
 */
router.get("/exemplaire/:id", controller.getAchatByExemplaireId);

module.exports = router;