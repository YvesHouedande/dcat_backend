// // const express = require('express');
// // const router = express.Router();
// // const { protect } = require('../../../core/auth/middleware');
// // const UsersController = require('../controllers/users.controller');
// // const SyncController = require('../controllers/sync.controller');


// // // Synchronisation Keycloak → BD Métier
// // router.post('/sync', protect(), SyncController.syncUser);

// // // Récupération du profil utilisateur
// // router.get('/me', protect([]), UsersController.getMyProfile);


// // // Mise à jour du profil (ex: téléphone)
// // router.patch('/me', protect([]), UsersController.updateMyProfile);

// // // Récupération de tous les utilisateurs (avec pagination)
// // /**
// //  * @swagger
// //  * /users:
// //  *   get:
// //  *     summary: Liste des utilisateurs
// //  *     tags:
// //  *       - Utilisateurs
// //  */
// // router.get('/', protect([]), UsersController.getAllUsers);

// // module.exports = router;




// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../../core/auth/middleware');
// const UsersController = require('../controllers/users.controller');

// // Récupération du profil utilisateur (lecture seule)
// router.get('/me', protect(), UsersController.getMyProfile);

// // Mise à jour d'un utilisateur par RH seulement
// router.put('/:userId', protect(['rh']), UsersController.updateUserByRh);

// // Récupération de tous les utilisateurs (pour RH)
// router.get('/', protect(['rh']), UsersController.getAllUsers);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../../../core/auth/middleware');
const UsersController = require('../controllers/users.controller');
const SyncController = require('../controllers/sync.controller');


/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer son profil utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 nom:
 *                   type: string
 *                   example: Dupont
 *                 prenom:
 *                   type: string
 *                   example: Jean
 *                 contact:
 *                   type: string
 *                   example: "+123456789"
 *                 adresse:
 *                   type: string
 *                   example: "123 Rue Example"
 *                 fonction:
 *                   type: string
 *                   example: "Technicien"
 *                 status:
 *                   type: string
 *                   example: "actif"
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/me', protect(), UsersController.getMyProfile);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Mettre à jour un utilisateur (RH seulement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact_employes:
 *                 type: string
 *                 example: "+123456789"
 *               adresse_employes:
 *                 type: string
 *                 example: "123 Rue Example"
 *               status_employes:
 *                 type: string
 *                 example: "actif"
 *               date_embauche_employes:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               date_de_naissance:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               contrat:
 *                 type: string
 *                 example: "CDI"
 *               id_fonction:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Mise à jour réussie
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé (rôle RH requis)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId', protect(['rh']), UsersController.updateUserByRh);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister tous les utilisateurs (RH seulement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   prenom:
 *                     type: string
 *                     example: Jean
 *                   nom:
 *                     type: string
 *                     example: Dupont
 *                   status:
 *                     type: string
 *                     example: actif
 *                   fonction:
 *                     type: integer
 *                     example: 1
 *       401:
 *         description: Non autorisé (rôle RH requis)
 *       500:
 *         description: Erreur serveur
 */
router.get('/', protect([]), UsersController.getAllUsers);

router.post('/sync', SyncController.syncUser);


module.exports = router;

