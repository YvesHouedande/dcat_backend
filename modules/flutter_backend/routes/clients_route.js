const express = require('express');
const router = express.Router();
const controller = require('../controllers/partenaires_controller');
const { protect } = require('../../../core/auth/middleware');

// Routes publiques (si nécessaire)
router.get('/clients', controller.getAllPartenairesClients);
router.get('/:id', controller.getPartenaireById);
router.get('/entite/:entiteId/clients', controller.getPartenairesClientsByEntiteId); // Bonus

// Routes protégées (ex: admin/commercial)
router.post('/clients', protect(['admin', 'commercial']), controller.createPartenaireClient);
router.put('/:id', protect(['admin', 'commercial']), controller.updatePartenaire);
router.delete('/:id', protect(['admin']), controller.deletePartenaire);

module.exports = router;