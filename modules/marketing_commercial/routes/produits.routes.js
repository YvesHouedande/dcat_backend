const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

router.get('/equipements/famille/:familleId', produitsController.getEquipementsByFamille);
router.get('/details/:productId', produitsController.getProductDetails);
router.get('/familles', produitsController.getAllFamilles);

module.exports = router;