const express = require("express");
const router = express.Router();

// Import des sous-routes
const outilsRoutes = require("./mouvementOutil.route");
const moyenstravailRoutes = require("./moyensdeTravail.route"); 
const maintenanceRoutes = require("./maintenance.route"); 
// const maintenanceMoyenTravailRoutes = require("./maintenanceMoyenTravail.route"); 
const sectionRoutes = require("./section.route"); 

// Montage des routes

// /**
//  * @swagger
//  * /moyens-generaux/outils:
//  *   description: Routes liées aux outils
//  *   get:
//  *     summary: Accède aux outils
//  *     tags: [Outils]
//  */
router.use("/outils", outilsRoutes);

// /**
//  * @swagger
//  * /moyens-generaux/moyens-travail:
//  *   description: Routes liées aux moyens de travail
//  *   get:
//  *     summary: Accède aux moyens de travail
//  *     tags: [Moyens de Travail]
//  */
router.use("/moyens-travail", moyenstravailRoutes);

// /**
//  * @swagger
//  * /moyens-generaux/maintenances:
//  *   description: Routes liées aux maintenances
//  *   get:
//  *     summary: Accède aux maintenances
//  *     tags: [Maintenances]
//  */
router.use("/maintenances", maintenanceRoutes);


// // /**
// //  * @swagger
// //  * /moyens-generaux/moyen-travails:
// //  *   description: Routes liées aux moyens de travail
// //  *   get:
// //  *     summary: Accède aux maintenances
// //  *     tags: [moyen-travails]
// //  */
// router.use("/moyen-travails", maintenanceMoyenTravailRoutes);


/**
 * @swagger
 * /moyens-generaux/sections:
 *   description: Routes liées aux sections
 *   get:
 *     summary: Accède aux sections
 *     tags: [sections]
 */
router.use("/sections", sectionRoutes);


module.exports = router;
