const express = require('express');
const router = express.Router();
const { protect } = require('../../../core/auth/middleware');
const UsersController = require('../controllers/users.controller');
const SyncController = require('../controllers/sync.controller'); // Import du contrôleur de sync

router.get('/', 
  protect(['admin_back']), 
  UsersController.getAllUsers
);

// Route de synchronisation
router.post('/sync', 
  protect(),
  SyncController.syncUser
);

module.exports = router;