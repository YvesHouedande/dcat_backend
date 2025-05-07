const express = require('express');
const router = express.Router();
const controller = require('../controllers/partenaire.controller');

/**
 * @swagger
 * tags:
 *   name: Partenaires
 *   description: Gestion des partenaires
 */

/**
 * @swagger
 * /partenaires:
 *   post:
 *     summary: Créer un partenaire
 *     tags: [Partenaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               type:
 *                 type: string
 *             required:
 *               - nom
 *               - type
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 *       400:
 *         description: Données invalides
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partenaires]
 *     responses:
 *       200:
 *         description: Liste des partenaires
 */

/**
 * @swagger
 * /partenaires/{type}:
 *   get:
 *     summary: Récupérer les partenaires par type
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type du partenaire
 *     responses:
 *       200:
 *         description: Liste des partenaires du type donné
 *       404:
 *         description: Aucun partenaire trouvé
 */

/**
 * @swagger
 * /partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 *       404:
 *         description: Partenaire non trouvé
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Partenaire supprimé
 *       404:
 *         description: Partenaire non trouvé
 */

router.post("/", controller.createPartenaire);
router.get("/", controller.getPartenaires);
router.get("/:type", controller.getPartenairebyType);
router.put("/:id", controller.updatePartenaire);
router.delete("/:id", controller.deletePartenaire);

module.exports = router;
