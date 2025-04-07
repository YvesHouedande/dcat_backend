const express = require('express');
const router = express.Router();
const controller = require('../controllers/interventions_controller');
const { protect } = require('../../../core/auth/middleware');


// INTERVENTIONS ROUTES

// Routes publiques
router.get('/', controller.getAllInterventions);

// Routes protégées
router.post('/create', controller.createIntervention);
router.put('/update/:id', controller.updateIntervention);
router.delete('/delete/:id', protect(['admin']), controller.deleteIntervention);
router.get('/search', controller.searchInterventions);
router.get('/:id/details', controller.getInterventionDetails);


module.exports = router;