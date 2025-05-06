const express = require("express");
const router = express.Router();
const controller = require("../controllers/modele.controller");

// CRUD Routes
// router.post("/", controller.createModele);
// router.get("/", controller.getModeles);
// router.get("/:id", controller.getModeleById);
// router.put("/:id", controller.updateModele);
// router.delete("/:id", controller.deleteModele);

// /**
//  * @swagger
//  * /modeles:
//  *   post:
//  *     summary: Crée un nouveau modèle
//  *     tags: [Modèles]
//  */
router.post("/", controller.createModele);

// /**
//  * @swagger
//  * /modeles:
//  *   get:
//  *     summary: Récupère tous les modèles
//  *     tags: [Modèles]
//  *     responses:
//  *       200:
//  *         description: Liste des modèles
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_modele: 1
//  *                 libelle_modele: null
//  *                 created_at: "2025-04-23T11:43:12.111Z"
//  *                 updated_at: "2025-04-23T11:43:12.111Z"
//  *               - id_modele: 2
//  *                 libelle_modele: null
//  *                 created_at: "2025-04-23T11:43:17.630Z"
//  *                 updated_at: "2025-04-23T11:43:17.630Z"
//  */

router.get("/", controller.getModeles);

// /**
//  * @swagger
//  * /modeles/{id}:
//  *   get:
//  *     summary: Récupère un modèle par ID
//  *     tags: [Modèles]
//  */
router.get("/:id", controller.getModeleById);

// /**
//  * @swagger
//  * /modeles/{id}:
//  *   put:
//  *     summary: Met à jour un modèle par ID
//  *     tags: [Modèles]
//  */
router.put("/:id", controller.updateModele);

// /**
//  * @swagger
//  * /modeles/{id}:
//  *   delete:
//  *     summary: Supprime un modèle par ID
//  *     tags: [Modèles]
//  */
router.delete("/:id", controller.deleteModele);

module.exports = router;
