const fonctionController = require('../controllers/fonction.controller');
const express = require('express');
const router = express.Router();
const { protect } = require("../../../../core/auth/middleware");
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
 *               nom_fonction:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fonction créée avec succès
 */
router.post('/',protect("Gestion_administration","Gestion_rh"), fonctionController.createFonction);

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
router.get('/',protect("Gestion_administration","Gestion_rh") ,fonctionController.getFonctions);

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
router.get('/:id',protect("Gestion_administration","Gestion_rh"), fonctionController.getFonctionById);

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
 *               nom_fonction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fonction mise à jour
 *       404:
 *         description: Fonction non trouvée
 */
router.put('/:id',protect("Gestion_administration","Gestion_rh") , fonctionController.updateFonction);

/**
 * @swagger
 * /administration/fonctions/{id}:
 *   delete:
 *     summary: Supprimer une fonction par ID
 *     tags: [Fonction]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fonction supprimée
 *       404:
 *         description: Fonction non trouvée
 */
router.delete('/:id',protect("Gestion_administration","Gestion_rh"), fonctionController.deleteFonction);

module.exports = router;