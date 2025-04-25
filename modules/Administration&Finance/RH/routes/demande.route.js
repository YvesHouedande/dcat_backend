const demandeController = require('../controllers/demande.controller');
const express = require('express');
const router = express.Router();

router.post('/', demandeController.createDemande);
router.get('/', demandeController.getAllDemandes);
router.get('/:type', demandeController.getDemandeByType);
router.put('/:id', demandeController.updateDemande);
router.delete('/:id', demandeController.deleteDemande);

module.exports = router;