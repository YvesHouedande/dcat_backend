const express = require('express');
const router = express.Router();
const controller = require('../controllers/interventions.controller');
const { protect } = require('../../../core/auth/middleware');

// Route publique
router.get('/', controller.getAll);

// Route protégée
router.post('/', protect(), controller.create);

module.exports = router;