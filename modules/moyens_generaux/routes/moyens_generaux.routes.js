const express = require("express");
const router = express.Router();

// Import des sous-routes
const outilsRoutes = require("./mouvementOutil.route");
const moyenstravailRoutes = require("./moyensdeTravail.route"); //moyens de travail
const maintenanceRoutes = require("./maintenance.route"); 
const maintenanceMoyenTravailRoutes = require("./maintenance.route"); 

// Montage des routes

// /**
//  * @swagger
//  * /outils:
//  *   description: Routes liées aux outils
//  *   get:
//  *     summary: Accède aux outils
//  *     tags: [Outils]
//  */
router.use("/outils", outilsRoutes);

// /**
//  * @swagger
//  * /moyens-travail:
//  *   description: Routes liées aux moyens de travail
//  *   get:
//  *     summary: Accède aux moyens de travail
//  *     tags: [Moyens de Travail]
//  */
router.use("/moyens-travail", moyenstravailRoutes);

// /**
//  * @swagger
//  * /maintenances:
//  *   description: Routes liées aux maintenances
//  *   get:
//  *     summary: Accède aux maintenances
//  *     tags: [Maintenances]
//  */
router.use("/maintenances", maintenanceRoutes);


// /**
//  * @swagger
//  * /maintenances:
//  *   description: Routes liées aux maintenances
//  *   get:
//  *     summary: Accède aux maintenances
//  *     tags: [Maintenances]
//  */
router.use("/maintenance-moyen-travails", maintenanceMoyenTravailRoutes);

module.exports = router;
