const entiteController = require('../controllers/entite.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Entite:
 *       type: object
 *       properties:
 *         id_entite:
 *           type: integer
 *           description: ID unique de l'entité
 *         denomination:
 *           type: string
 *           description: Dénomination de l'entité
 *         abreviation_nom:
 *           type: string
 *           description: Abréviation du nom de l'entité
 *         contact:
 *           type: string
 *           description: Contact de l'entité
 *         adresse_postal:
 *           type: string
 *           description: Adresse postale de l'entité
 *         localisation:
 *           type: string
 *           description: Localisation de l'entité
 *         id_partenaire:
 *           type: integer
 *           description: ID du partenaire associé
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'entité
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour de l'entité
 */

/**
 * @swagger
 * /administration/entites:
 *   post:
 *     summary: Créer une nouvelle entité
 *     description: Enregistre une nouvelle entité dans le système.
 *     tags: [Entites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entite'
 *     responses:
 *       201:
 *         description: Entité créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entite'
 *       500:
 *         description: Erreur serveur
 */
router.post('/', entiteController.createEntite);

/**
 * @swagger
 * /administration/entites:
 *   get:
 *     summary: Récupérer toutes les entités
 *     description: Retourne la liste de toutes les entités enregistrées.
 *     tags: [Entites]
 *     responses:
 *       200:
 *         description: Liste des entités récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entite'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', entiteController.getEntites);

/**
 * @swagger
 * /administration/entites/{id}:
 *   get:
 *     summary: Récupérer une entité par son ID
 *     description: Retourne les détails d'une entité spécifique.
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'entité
 *     responses:
 *       200:
 *         description: Détails de l'entité récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entite'
 *       404:
 *         description: Entité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', entiteController.getEntiteById);

/**
 * @swagger
 * /administration/entites/{id}:
 *   put:
 *     summary: Mettre à jour une entité existante
 *     description: Modifie les informations d'une entité existante.
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'entité à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entite'
 *     responses:
 *       200:
 *         description: Entité mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entite'
 *       404:
 *         description: Entité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', entiteController.updateEntite);

/**
 * @swagger
 * /administration/entites/{id}:
 *   delete:
 *     summary: Supprimer une entité
 *     description: Supprime une entité existante par son ID.
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'entité à supprimer
 *     responses:
 *       200:
 *         description: Entité supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entite'
 *       404:
 *         description: Entité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', entiteController.deleteEntite);

/**
 * @swagger
 * /administration/entites/partenaire/{id_partenaire}:
 *   get:
 *     summary: Récupérer les entités associées à un partenaire
 *     description: Retourne la liste de toutes les entités associées à un partenaire donné.
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id_partenaire
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Liste des entités du partenaire récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entite'
 *       404:
 *         description: Aucune entité trouvée pour ce partenaire
 *       500:
 *         description: Erreur serveur
 */
router.get('/partenaire/:id_partenaire', entiteController.getEntitesByPartenaire);

module.exports = router;
