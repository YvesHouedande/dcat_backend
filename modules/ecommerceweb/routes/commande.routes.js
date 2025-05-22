const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commande.controller');

router.post('/', commandeController.creerCommande);
router.get('/client/:id', commandeController.getCommandesParClient);

module.exports = router;