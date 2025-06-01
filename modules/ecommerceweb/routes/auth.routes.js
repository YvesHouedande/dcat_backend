const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyFirebaseToken } = require('../middlewares/auth.middleware');

router.post('/sync-user', verifyFirebaseToken, authController.syncUser);

module.exports = router;