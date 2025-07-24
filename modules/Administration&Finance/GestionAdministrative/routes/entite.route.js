const entiteController = require('../controllers/entite.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Entite:
 *       type: object
 *       required:
 *         - denomination
 *       properties:
 *         id_entite:
 *           type: integer
 *           description: ID auto-généré de l'entité
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
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *         id_partenaire:
 *           type: integer
 *           description: ID du partenaire auquel l'entité est rattachée
 */

/**
 * @swagger
 * /administration/entites:
 *   post:
 *     summary: Créer une nouvelle entité
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
 *     tags: [Entites]
 *     responses:
 *       200:
 *         description: Liste des entités
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
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entité
 *     responses:
 *       200:
 *         description: Détails de l'entité
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
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *     tags: [Entites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *         description: Liste des entités du partenaire
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
