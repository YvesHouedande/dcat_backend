const express = require("express");
const router = express.Router();
const interlocuteurRoutes = require("../GestionAdministrative/routes/interlocuteur.route");
const partenaireRoutes = require("../GestionAdministrative/routes/partenaire.route");
const contratRoutes = require("../GestionAdministrative/routes/contrat.route");
const natureRoutes = require("../GestionAdministrative/routes/nature.route");
const entiteRoutes = require("../GestionAdministrative/routes/entite.route");
const demandeRoutes = require("../RH/routes/demande.route")


router.use("/interlocuteurs", interlocuteurRoutes);
router.use("/partenaires", partenaireRoutes);
router.use("/contrats", contratRoutes);
router.use("/natures", natureRoutes);
router.use("/entites", entiteRoutes);
router.use("/demandes", demandeRoutes);

module.exports = router;
