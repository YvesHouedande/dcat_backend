const express = require("express");
const router = express.Router();
const controller = require("../controllers/marque.controller");

// CRUD Routes
// router.post("/", controller.createMarque);
// router.get("/", controller.getMarques);
// router.get("/:id", controller.getMarqueById);
// router.put("/:id", controller.updateMarque);
// router.delete("/:id", controller.deleteMarque);

// /**
//  * @swagger
//  * /marques:
//  *   post:
//  *     summary: Crée une nouvelle marque
//  *     tags: [Marques]
//  */
router.post("/", controller.createMarque);

// /**
//  * @swagger
//  * /marques:
//  *   get:
//  *     summary: Récupère toutes les marques
//  *     tags: [Marques]
//  *     responses:
//  *       200:
//  *         description: Liste des marques
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_marque: 3
//  *                 libelle_marque: "marque-001"
//  *                 created_at: "2025-04-23T10:54:23.358Z"
//  *                 updated_at: "2025-04-23T10:54:23.358Z"
//  *               - id_marque: 4
//  *                 libelle_marque: "marque-002"
//  *                 created_at: "2025-04-23T11:39:04.388Z"
//  *                 updated_at: "2025-04-23T11:39:04.388Z"
//  */

router.get("/", controller.getMarques);

// /**
//  * @swagger
//  * /marques/{id}:
//  *   get:
//  *     summary: Récupère une marque par ID
//  *     tags: [Marques]
//  */
router.get("/:id", controller.getMarqueById);

// /**
//  * @swagger
//  * /marques/{id}:
//  *   put:
//  *     summary: Met à jour une marque par ID
//  *     tags: [Marques]
//  */
router.put("/:id", controller.updateMarque);

// /**
//  * @swagger
//  * /marques/{id}:
//  *   delete:
//  *     summary: Supprime une marque par ID
//  *     tags: [Marques]
//  */
router.delete("/:id", controller.deleteMarque);


module.exports = router;
