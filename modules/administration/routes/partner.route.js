const express = require("express");
const partnerController = require("../controllers/partner.controller");
const router = express.Router();

router.post('/', partnerController.createPartner);
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartner);
router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;


