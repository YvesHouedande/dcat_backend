const express = require("express");
const { protect } = require("../../../core/auth/middleware");
const router = express.Router();
const interlocuteurRoutes = require("../GestionAdministrative/routes/interlocuteur.route");
const partenaireRoutes = require("../GestionAdministrative/routes/partenaire.route");
const contratRoutes = require("../GestionAdministrative/routes/contrat.route");
const natureRoutes = require("../GestionAdministrative/routes/nature.route");
const entiteRoutes = require("../GestionAdministrative/routes/entite.route");
const demandeRoutes = require("../RH/routes/demande.route")
const docFCRoutes = require("../FinanceCompta/routes/doc_FC.route");
const employeRoutes = require("../RH/routes/employe.route");
const fonctionRoutes = require("../RH/routes/fonction.route");


router.use("/interlocuteurs",interlocuteurRoutes);
router.use("/partenaires", partenaireRoutes);
router.use("/contrats", contratRoutes);
router.use("/natures", natureRoutes);
router.use("/entites", entiteRoutes);
router.use("/demandes", demandeRoutes);
router.use("/documents", docFCRoutes);
router.use("/employes", employeRoutes);
router.use("/fonctions",fonctionRoutes);


// Protect all routes under Administration & Finance

module.exports = router;
