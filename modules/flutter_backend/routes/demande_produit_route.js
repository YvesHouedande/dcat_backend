const express = require('express');
const router = express.Router();
const controller = require('../controllers/demandes_produit_controller');
const { protect } = require('../../../core/auth/middleware');

router.get('/', controller.getAllDemandesProduit);
router.post('/', protect(['employe', 'gestionnaire']), controller.createDemandeProduit);
router.patch('/:id/statut', protect(['gestionnaire']), controller.updateStatutDemande);

module.exports = router;