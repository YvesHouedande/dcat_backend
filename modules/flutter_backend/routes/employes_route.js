const express = require('express');
const router = express.Router();
const controller = require('../controllers/employes_controller');
const { protect } = require('../../../core/auth/middleware');

// Routes publiques (si nécessaire)
router.get('/', controller.getAllEmployes);
router.get('/:id', controller.getEmployeById);
router.get('/keycloak/:keycloakId', controller.getEmployeByKeycloakId);
router.get('/fonction/:fonctionId', controller.getEmployesByFonctionId); // Bonus

// Routes protégées (ex: admin/RH)
router.post('/', protect(['admin', 'rh']), controller.createEmploye);
router.put('/:id', protect(['admin', 'rh']), controller.updateEmploye);
router.delete('/:id', protect(['admin']), controller.deleteEmploye);

module.exports = router;