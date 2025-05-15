const natureController = require('../controllers/nature.controller');
const express = require('express');
const router = express.Router();


router.post('/', natureController.createNature);
router.get('/', natureController.getAllNatures);
router.get('/:id', natureController.getNaturebyId);
router.put('/:id', natureController.updateNature);
router.delete('/:id', natureController.deleteNature);

module.exports = router;