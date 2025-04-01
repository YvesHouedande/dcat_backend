const express = require('express');
const router = express.Router();
const controller = require('../controllers/stocks.controller');
const { protect } = require('../../../core/auth/middleware');

// Route publique
router.get('/', protect(), controller.getAll);

// Route protégée avec rôle spécifique
router.post('/', protect(), controller.create);

module.exports = router;