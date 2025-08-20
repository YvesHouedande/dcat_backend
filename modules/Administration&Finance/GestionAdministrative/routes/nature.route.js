const natureController = require('../controllers/nature.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Nature:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique de la nature
 *         libelle:
 *           type: string
 *           description: Libellé de la nature
 *           maxLength: 50
 *       required:
 *         - libelle
 */

/**
 * @swagger
 * /administration/natures/:
 *   post:
 *     summary: Créer une nouvelle nature
 *     tags: [Nature]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nature'
 *     responses:
 *       201:
 *         description: Nature créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nature'
 *       400:
 *         description: Requête invalide
 */
router.post('/', natureController.createNature);

/**
 * @swagger
 * /administration/natures/:
 *   get:
 *     summary: Récupérer toutes les natures
 *     tags: [Nature]
 *     responses:
 *       200:
 *         description: Liste des natures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nature'
 */
router.get('/', natureController.getAllNatures);

/**
 * @swagger
 * /administration/natures/{id}:
 *   get:
 *     summary: Récupérer une nature par ID
 *     tags: [Nature]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nature
 *     responses:
 *       200:
 *         description: Nature trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nature'
 *       404:
 *         description: Nature non trouvée
 */
router.get('/:id', natureController.getNaturebyId);

/**
 * @swagger
 * /administration/natures/{id}:
 *   put:
 *     summary: Mettre à jour une nature par ID
 *     tags: [Nature]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nature'
 *     responses:
 *       200:
 *         description: Nature mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nature'
 *       404:
 *         description: Nature non trouvée
 */
router.put('/:id', natureController.updateNature);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Supprimer une nature par ID
 *     tags: [Nature]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nature
 *     responses:
 *       200:
 *         description: Nature supprimée
 *       404:
 *         description: Nature non trouvée
 */
router.delete('/:id', natureController.deleteNature);

module.exports = router;