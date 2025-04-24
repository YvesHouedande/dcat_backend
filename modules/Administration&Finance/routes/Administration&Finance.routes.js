const express = require("express");
const router = express.Router();
const interlocuteurRoutes = require("../GestionAdministrative/routes/interlocuteur.route");
const partenaireRoutes = require("../GestionAdministrative/routes/partenaire.route");
const contratRoutes = require("../GestionAdministrative/routes/contrat.route");


router.use("/interlocuteurs", interlocuteurRoutes);
router.use("/partenaires", partenaireRoutes);
router.use("/contrats", contratRoutes);
module.exports = router;
