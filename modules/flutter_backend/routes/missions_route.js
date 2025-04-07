const express = require('express');
const router = express.Router();
const controller = require('../controllers/missions_controller');
const { protect } = require('../../../core/auth/middleware');

// MISSION ROUTES

// Routes publiques (si nécessaire)
router.get('/', controller.getAllMissions);
router.get('/:id', controller.getMissionById);

// Routes protégées (ex: admin/gestionnaire)
router.post('/', protect(['admin', 'gestionnaire']), controller.createMission);

router.put('/:id', protect(['admin', 'gestionnaire']), controller.updateMission);

router.delete('/:id', protect(['admin']), controller.deleteMission);

router.get('/:id/employes', controller.getMissionEmployes); 

router.get('/by-status', controller.getMissionsByCompletion); 

router.patch('/:id/status', protect(['chef_projet']), controller.updateMissionStatus);



module.exports = router;