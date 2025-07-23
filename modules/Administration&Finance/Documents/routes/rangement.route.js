const express = require('express');
const router = express.Router();
const rangementController = require('../controllers/rangement.controller');


router.post('/create', rangementController.createDossier);
router.get('/', rangementController.getDossiers);
router.get('/:id', rangementController.getDossierById);
router.put('/:id', rangementController.updateDossier);
router.delete('/:id', rangementController.deleteDossier);
router.delete('/document/:id', rangementController.deleteDocumentById);
router.get('/type/:type', rangementController.getDossierByType);

module.exports = router;
