const express = require('express');
const router = express.Router();
const { keycloak } = require('../../../core/auth/middleware');
const UsersController = require('../controllers/users.controller');

// Routes publiques
router.get('/public', (req, res) => {
  res.json({ message: 'Public user endpoint' });
});

// Routes protégées
router.get('/', keycloak.protect('user'), UsersController.getAllUsers);
router.post('/', keycloak.protect('admin'), UsersController.createUser);

// Exportez explicitement le routeur
module.exports = router;