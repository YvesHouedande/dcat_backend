const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commande.controller');
const { verifyToken } = require('../middlewares/jwt.middleware');

router.post('/', verifyToken, commandeController.creerCommande);

router.get('/historique', 
    verifyToken, 
    commandeController.getHistoriqueCommandes
  );

router.get('/:id', 
  verifyToken, 
  commandeController.getOrderDetails
);

router.put('/:id/annuler', 
  verifyToken, 
  commandeController.cancelOrder
);

module.exports = router;