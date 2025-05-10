const employeController = require('../controllers/employes.controller');
const express = require('express');
const router = express.Router();


router.get('/', employeController.getEmployes);
router.get('/:id', employeController.getEmployeById);
router.get('/fonction/:id', employeController.getEmployeByFonction);
router.get('/statut/:statut', employeController.getEmployeByStatut);
router.put('/:id', employeController.updateEmploye);

module.exports = router;