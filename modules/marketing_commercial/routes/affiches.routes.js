const express = require('express');
const router = express.Router();
const affichesController = require('../controllers/affiches.controller');
const uploadMiddleware = require('../../utils/middleware/uploadMiddleware');
const path = require('path');

// Configuration du chemin d'upload
router.use((req, res, next) => {
  req.uploadPath = path.join(process.cwd(), 'media/images/affiches_dcat');
  next();
});

router.get('/', affichesController.getAllAffiches);
router.get('/:id', affichesController.getAfficheById);
router.post('/', uploadMiddleware.single('image'), affichesController.createAffiche);
router.put('/:id', uploadMiddleware.single('image'), affichesController.updateAffiche);
router.delete('/:id', affichesController.deleteAffiche);

module.exports = router;