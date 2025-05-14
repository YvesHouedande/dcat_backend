const fonctionController = require('../controllers/fonction.controller');
const express = require('express');
const router = express.Router();


router.post('/', fonctionController.createFonction);
router.get('/', fonctionController.getFonctions);
router.get('/:id', fonctionController.getFonctionById);
router.put('/:id', fonctionController.updateFonction);
router.delete('/:id', fonctionController.deleteFonction);


module.exports = router;