const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandes.controller');

router.post('/', commandesController.createCommande);
router.get('/client/:clientId', commandesController.getClientCommandes);
router.get('/status/:status', commandesController.getCommandesByStatus);

module.exports = router;