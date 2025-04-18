const express = require('express');
const router = express.Router();
const { protect } = require('../../../core/auth/middleware');
const UsersController = require('../controllers/users.controller');
const SyncController = require('../controllers/sync.controller');


// Synchronisation Keycloak → BD Métier
router.post('/sync', protect(), SyncController.syncUser);

// Récupération du profil utilisateur
router.get('/me', protect([]), UsersController.getMyProfile);


// Mise à jour du profil (ex: téléphone)
router.patch('/me', protect([]), UsersController.updateMyProfile);

// Récupération de tous les utilisateurs (avec pagination)
router.get('/', protect([]), UsersController.getAllUsers);

module.exports = router;