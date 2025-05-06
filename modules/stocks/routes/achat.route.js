const express = require("express");
const router = express.Router();
const controller = require("../controllers/achat.controller");

/**
 * id: id de la livraison
 */


// /**
//  * @swagger
//  * /achats:
//  *   get:
//  *     summary: Récupère tous les achats
//  *     tags: [Achats]
// * *     responses:
// *       200:
// *         description: Liste des achats
// *         content:
// *           application/json:
// *             example:
// *               - id: 1
// *                 fournisseur: "FOURNISSEUR 1"
// *                 date: "2025-05-05"
// *                 montant: 25000
// *               - id: 2
// *                 fournisseur: "FOURNISSEUR 2"
// *                 date: "2025-05-04"
// *                 montant: 18000
// *
//  */
router.get("/", controller.getAllAchats);

// /**
//  * @swagger
//  * /achats/{id}:
//  *   get:
//  *     summary: Récupère un achat par ID
//  *     tags: [Achats]
//  */
router.get("/:id", controller.getAchatById);

// /**
//  * @swagger
//  * /achats/{id}:
//  *   put:
//  *     summary: Met à jour un achat par ID
//  *     tags: [Achats]
//  */
router.put("/:id", controller.updateAchat);

// /**
//  * @swagger
//  * /achats/exemplaire/{id}:
//  *   get:
//  *     summary: Récupère un achat via l'ID d'un exemplaire
//  *     tags: [Achats]
//  */
router.get("/exemplaire/:id", controller.getAchatByExemplaireId);

module.exports = router;