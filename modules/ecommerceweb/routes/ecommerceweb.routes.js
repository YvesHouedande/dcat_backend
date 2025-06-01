const express = require('express');
const router = express.Router();
const authRouter = require('./auth.routes');
const commandeRouter = require('./commande.routes');

router.use('/auth', authRouter);
router.use('/commandes', commandeRouter);

module.exports = router;