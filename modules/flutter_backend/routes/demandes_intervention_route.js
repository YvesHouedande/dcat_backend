const express = require('express');
const router = express.Router();
const controller = require('../controllers/demandes_intervention_controller');
const { protect } = require('../../../core/auth/middleware');

router.get('/', protect(['technicien']), controller.getAllDemandesIntervention);
router.post('/', protect(['employe']), controller.createDemandeIntervention);

module.exports = router;