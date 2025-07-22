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
 * /administration/partenaires:
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
 *               nom_partenaire:
 *                 type: string
 *                 nullable: true
 *               telephone_partenaire:
 *                 type: string
 *                 nullable: true
 *               email_partenaire:
 *                 type: string
 *                 nullable: true
 *               specialite:
 *                 type: string
 *                 nullable: true
 *               localisation:
 *                 type: string
 *               type_partenaire:
 *                 type: string
 *                 nullable: true
 *               statut:
 *                 type: string
 *                 nullable: true
 *               id_entite:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - localisation
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 *       500:
 *         description: Erreur serveur
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partenaires]
 *     responses:
 *       200:
 *         description: Liste des partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partenaire'
 *       500:
 *         description: Erreur serveur
 *
 * /administration/partenaires/{id}:
 *   get:
 *     summary: Récupérer un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Détails du partenaire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partenaire'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 *
 * /administration/partenaires/type/{type}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partenaire'
 *       500:
 *         description: Erreur serveur
 *
 * components:
 *   schemas:
 *     Partenaire:
 *       type: object
 *       properties:
 *         id_partenaire:
 *           type: integer
 *         nom_partenaire:
 *           type: string
 *           nullable: true
 *         telephone_partenaire:
 *           type: string
 *           nullable: true
 *         email_partenaire:
 *           type: string
 *           nullable: true
 *         specialite:
 *           type: string
 *           nullable: true
 *         localisation:
 *           type: string
 *         type_partenaire:
 *           type: string
 *           nullable: true
 *         statut:
 *           type: string
 *           nullable: true
 *         id_entite:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /administration/partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_partenaire:
 *                 type: string
 *                 nullable: true
 *               telephone_partenaire:
 *                 type: string
 *                 nullable: true
 *               email_partenaire:
 *                 type: string
 *                 nullable: true
 *               specialite:
 *                 type: string
 *                 nullable: true
 *               localisation:
 *                 type: string
 *               type_partenaire:
 *                 type: string
 *                 nullable: true
 *               statut:
 *                 type: string
 *                 nullable: true
 *               id_entite:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partenaire'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Partenaire supprimé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */

router.post("/", controller.createPartenaire);
router.get("/", controller.getPartenaires);
router.get("/:id", controller.getPartenaireById);
router.get("/type/:type", controller.getPartenairebyType);
router.put("/:id", controller.updatePartenaire);
router.delete("/:id", controller.deletePartenaire);

module.exports = router;
