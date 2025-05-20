const fonctionController = require('../controllers/fonction.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /administration/fonctions:
 *   post:
 *     summary: Créer une nouvelle fonction
 *     tags: [Fonction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nom_fonction:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fonction créée avec succès
 */
router.post('/', fonctionController.createFonction);

/**
 * @swagger
 * /administration/fonctions:
 *   get:
 *     summary: Récupérer toutes les fonctions
 *     tags: [Fonction]
 *     responses:
 *       200:
 *         description: Liste des fonctions
 */
router.get('/', fonctionController.getFonctions);

/**
 * @swagger
 * /administration/fonctions/{id}:
 *   get:
 *     summary: Récupérer une fonction par ID
 *     tags: [Fonction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fonction trouvée
 *       404:
 *         description: Fonction non trouvée
 */
router.get('/:id', fonctionController.getFonctionById);

/**
 * @swagger
 * /administration/fonctions/{id}:
 *   put:
 *     summary: Mettre à jour une fonction par ID
 *     tags: [Fonction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nom_fonction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fonction mise à jour
 *       404:
 *         description: Fonction non trouvée
 */
router.put('/:id', fonctionController.updateFonction);

/**
 * @swagger
 * /administration/fonctions/{id}:
 *   delete:
 *     summary: Supprimer une fonction par ID
 *     tags: [Fonction]
 *     parameters:
 *       - in: path
 *         Nom_fonction: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fonction supprimée
 *       404:
 *         description: Fonction non trouvée
 */
router.delete('/:id', fonctionController.deleteFonction);

module.exports = router;