const express = require('express');
const router = express.Router();
const authRouter = require('./auth.routes');
const commandeRouter = require('./commande.routes');

// Public routes
router.use('/auth', authRouter);

// Protected routes
router.use('/commande', 
  // verifyJWT ou verifyFirebaseToken selon besoin
  commandeRouter
);

module.exports = router;