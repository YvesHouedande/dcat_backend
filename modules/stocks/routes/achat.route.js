const express = require("express");
const router = express.Router();
const controller = require("../controllers/achat.controller");

/**
 * id: id de la livraison
 */


/**
 * @swagger
 * /achats:
 *   get:
 *     summary: Récupère tous les achats
 *     description: Retourne la liste complète de tous les achats enregistrés
 *     tags: [Achats]
 *     responses:
 *       200:
 *         description: Liste des achats récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   fournisseur:
 *                     type: string
 *                     example: "FOURNISSEUR 1"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-05-05"
 *                   montant:
 *                     type: number
 *                     format: float
 *                     example: 25000
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", controller.getAllAchats);

/**
 * @swagger
 * /achats/{id}:
 *   get:
 *     summary: Récupère un achat par ID
 *     tags: [Achats]
 */
router.get("/:id", controller.getAchatById);

/**
 * @swagger
 * /achats/{id}:
 *   put:
 *     summary: Met à jour un achat par ID
 *     tags: [Achats]
 */
router.put("/:id", controller.updateAchat);

/**
 * @swagger
 * /achats/exemplaire/{id}:
 *   get:
 *     summary: Récupère un achat via l'ID d'un exemplaire
 *     tags: [Achats]
 */
router.get("/exemplaire/:id", controller.getAchatByExemplaireId);

module.exports = router;