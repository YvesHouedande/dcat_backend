const express = require('express');
const router = express.Router();
const controller = require('../controllers/projets_controller')
const { protect } = require('../../../core/auth/middleware');

// Routes publiques
router.get('/', controller.getAllProjects);

router.get('/:id', controller.getProjectById);

// Routes protégées
router.post('/create', controller.createProject);

router.put('/update/:id', controller.updateProject);

router.delete('/delete/:id', controller.deleteProject);

router.get('/search', controller.searchProjets);

router.get('/:id/details', controller.getProjetDetails);

router.get('/by-status', controller.getProjetsByCompletion); // /projets/by-status?status=completed
router.get('/stats', controller.getProjectStats);

module.exports = router;