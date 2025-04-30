const express = require('express');
const router = express.Router();
const servicesDcatController = require('../controllers/services_dcat.controller');
const uploadMiddleware = require('../../utils/middleware/uploadMiddleware');
const path = require('path');

// Configuration du chemin d'upload
router.use((req, res, next) => {
  req.uploadPath = path.join(process.cwd(), 'media/images/services_dcat');
  next();
});

router.get('/', servicesDcatController.getAllServices);
router.get('/:id', servicesDcatController.getServiceById);
router.post('/', uploadMiddleware.single('image'), servicesDcatController.createService);
router.put('/:id', uploadMiddleware.single('image'), servicesDcatController.updateService);
router.delete('/:id', servicesDcatController.deleteService);

module.exports = router;