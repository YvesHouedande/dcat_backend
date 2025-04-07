const express = require('express');
const router = express.Router();
const controller = require('../controllers/produits_controller');
const { protect } = require('../../../core/auth/middleware');

// Routes publiques (si nécessaire)
router.get('/', controller.getAllProduits);
router.get('/:id/:code', controller.getProduitByIdAndCode);
router.get('/famille/:familleId', controller.getProduitsByFamilleId); // Bonus

// Routes protégées (ex: admin/inventaire)
router.post('/', protect(['admin', 'inventaire']), controller.createProduit);
router.put('/:id/:code', protect(['admin', 'inventaire']), controller.updateProduit);
router.delete('/:id/:code', protect(['admin']), controller.deleteProduit);

module.exports = router;