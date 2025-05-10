const entiteController = require('../controllers/entite.controller');
const express = require('express');
const router = express.Router();


router.post('/', entiteController.createEntite);
router.get('/', entiteController.getEntites);
router.get('/:id', entiteController.getEntiteById);
router.put('/:id', entiteController.updateEntite);
router.delete('/:id', entiteController.deleteEntite);
module.exports = router;  
