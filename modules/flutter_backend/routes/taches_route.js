const express = require('express');
const router = express.Router();
const controller = require('../controllers/taches_controller');
const { protect } = require('../../../core/auth/middleware');

// Routes publiques (si nécessaire)
router.get('/', controller.getAllTaches);
router.get('/:id', controller.getTacheById);
router.get('/mission/:missionId', controller.getTachesByMissionId); // Bonus

// Routes protégées (ex: admin/responsable de mission)
router.post('/', protect(['admin', 'responsable']), controller.createTache);
router.put('/:id', protect(['admin', 'responsable']), controller.updateTache);
router.delete('/:id', protect(['admin']), controller.deleteTache);

module.exports = router;
