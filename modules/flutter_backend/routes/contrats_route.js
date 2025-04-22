const express = require('express');
const router = express.Router();
const controller = require('../controllers/contrats_controller');
const { protect } = require('../../../core/auth/middleware');

// Routes publiques (si nécessaire)
router.get('/', controller.getAllContrats);

router.get('/:id', controller.getContratById);

router.get('/partenaire/:partenaireId', controller.getContratsByPartenaireId); // Bonus


// Routes protégées (ex: admin/juridique)
router.post('/create', controller.createContrat);
router.put('/:id', controller.updateContrat);
router.delete('/:id', protect(['admin']), controller.deleteContrat);

module.exports = router;