const express = require('express')
const router = express.Router()
const demandController = require('../controllers/demamd.controller')

router.post('/', demandController.createDemande)
router.get('/', demandController.getDemandes)
router.get('/:id', demandController.getDemandeById)
router.put('/:id', demandController.updateDemande)
router.delete('/:id', demandController.deleteDemande)

module.exports = router
