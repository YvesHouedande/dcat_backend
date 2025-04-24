const interlocuteurController = require('../controllers/interlocuteur.controller');
const express = require('express');
const router = express.Router();

router.post("/", interlocuteurController.createInterlocuteur);
router.get("/", interlocuteurController.getInterlocuteurs);
router.get("/:id", interlocuteurController.getInterlocuteurbyPartenaire);
router.put("/:id", interlocuteurController.updateInterlocuteur);
router.delete("/:id", interlocuteurController.deleteInterlocuteur);

module.exports = router;

