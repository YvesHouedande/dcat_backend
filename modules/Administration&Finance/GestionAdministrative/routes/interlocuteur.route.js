/**
 * @swagger
 * components:
 *   schemas:
 *     Interlocuteur:
 *       type: object
 *       properties:
 *         nom_interlocuteur:
 *           type: string
 *           maxLength: 50
 *           description: Nom de l'interlocuteur
 *         prenom_interlocuteur:
 *           type: string
 *           maxLength: 75
 *           description: Prénom de l'interlocuteur
 *         contact_interlocuteur:
 *           type: string
 *           maxLength: 50
 *           description: Contact de l'interlocuteur
 *         email_interlocuteur:
 *           type: string
 *           maxLength: 100
 *           format: email
 *           description: Email de l'interlocuteur
 *         fonction_interlocuteur:
 *           type: string
 *           maxLength: 50
 *           description: Fonction de l'interlocuteur
 *         id_partenaire:
 *           type: integer
 *           description: ID du partenaire associé
 *       required:
 *         - nom_interlocuteur
 *         - prenom_interlocuteur
 *         - contact_interlocuteur
 *         - email_interlocuteur
 *         - fonction_interlocuteur
 *         - id_partenaire
 */

const interlocuteurController = require('../controllers/interlocuteur.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /administration/interlocuteurs/:
 *   post:
 *     summary: Créer un nouvel interlocuteur
 *     tags: [Interlocuteur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interlocuteur'
 *     responses:
 *       201:
 *         description: Interlocuteur créé
 */
router.post("/", interlocuteurController.createInterlocuteur);

/**
 * @swagger
 * /administration/interlocuteurs/:
 *   get:
 *     summary: Récupérer tous les interlocuteurs
 *     tags: [Interlocuteur]
 *     responses:
 *       200:
 *         description: Liste des interlocuteurs
 */
router.get("/", interlocuteurController.getInterlocuteurs);

/**
 * @swagger
 * /administration/interlocuteurs/partenaire/{id}:
 *   get:
 *     summary: Récupérer les interlocuteurs d'un partenaire
 *     tags: [Interlocuteur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Liste des interlocuteurs du partenaire
 */
router.get("/partenaire/:id", interlocuteurController.getInterlocuteurbyPartenaire);

/**
 * @swagger
 * /administration/interlocuteur/{id}:
 *   get:
 *     summary: Récupérer un interlocuteur par ID
 *     tags: [Interlocuteur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'interlocuteur
 *     responses:
 *       200:
 *         description: Interlocuteur trouvé
 */
router.get("/:id", interlocuteurController.getInterlocuteurById);

/**
 * @swagger
 * /administration/interlocuteurs/{id}:
 *   put:
 *     summary: Mettre à jour un interlocuteur
 *     tags: [Interlocuteur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'interlocuteur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interlocuteur'
 *     responses:
 *       200:
 *         description: Interlocuteur mis à jour
 */
router.put("/:id", interlocuteurController.updateInterlocuteur);

/**
 * @swagger
 * /administration/interlocuteurs/{id}:
 *   delete:
 *     summary: Supprimer un interlocuteur
 *     tags: [Interlocuteur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'interlocuteur
 *     responses:
 *       200:
 *         description: Interlocuteur supprimé
 */
router.delete("/:id", interlocuteurController.deleteInterlocuteur);

module.exports = router;

