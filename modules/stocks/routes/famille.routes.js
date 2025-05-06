const express = require("express");
const router = express.Router();
const controller = require("../controllers/famille.controller");

// CRUD Routes
// router.post("/", controller.createFamille);
// router.get("/", controller.getFamilles);
// router.get("/:id", controller.getFamilleById);
// router.put("/:id", controller.updateFamille);
// router.delete("/:id", controller.deleteFamille);

// /**
//  * @swagger
//  * /familles:
//  *   post:
//  *     summary: Crée une nouvelle famille
//  *     tags: [Familles]
//  */
router.post("/", controller.createFamille);

// /**
//  * @swagger
//  * /familles:
//  *   get:
//  *     summary: Récupère toutes les familles
//  *     tags: [Familles]
//  *     responses:
//  *       200:
//  *         description: Liste des familles
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_famille: 1
//  *                 libelle_famille: "famille-001"
//  *                 created_at: "2025-04-23T11:38:03.375Z"
//  *                 updated_at: "2025-04-23T11:38:03.375Z"
//  *               - id_famille: 2
//  *                 libelle_famille: "famille-002"
//  *                 created_at: "2025-04-23T11:38:07.292Z"
//  *                 updated_at: "2025-04-23T11:38:07.292Z"
//  *               - id_famille: 3
//  *                 libelle_famille: "famille-003"
//  *                 created_at: "2025-04-23T11:38:12.014Z"
//  *                 updated_at: "2025-04-23T11:38:12.014Z"
//  */

router.get("/", controller.getFamilles);

// /**
//  * @swagger
//  * /familles/{id}:
//  *   get:
//  *     summary: Récupère une famille par ID
//  *     tags: [Familles]
//  */
router.get("/:id", controller.getFamilleById);

// /**
//  * @swagger
//  * /familles/{id}:
//  *   put:
//  *     summary: Met à jour une famille par ID
//  *     tags: [Familles]
//  */
router.put("/:id", controller.updateFamille);

// /**
//  * @swagger
//  * /familles/{id}:
//  *   delete:
//  *     summary: Supprime une famille par ID
//  *     tags: [Familles]
//  */
router.delete("/:id", controller.deleteFamille);


module.exports = router;