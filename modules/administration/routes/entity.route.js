const express = require('express'); 
const router = express.Router();
const entityController = require('../controllers/entity.controller');

router.post('/', entityController.createEntite);
router.get('/', entityController.getEntites);
router.get('/:id', entityController.getEntiteById);
router.put('/:id', entityController.updateEntite);
router.delete('/:id', entityController.deleteEntite);

module.exports = router;
