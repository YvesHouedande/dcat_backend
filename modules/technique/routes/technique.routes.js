const express = require("express");
const router = express.Router();



// Import des sous-routes
const interventionsRoutes = require("./interventions.routes");
const projetsRoutes = require("./projets.routes");
const tachesRoutes = require("./taches.routes");
const livrablesRoutes = require("./livrable.routes");

/**
 * @swagger
 * /api/interventions:
 *   description: Routes liées aux interventions
 *   get:
 *     summary: Accède aux interventions techniques
 *     tags: [Interventions]
 */
router.use("/interventions", interventionsRoutes);

/**
 * @swagger
 * /api/projets:
 *   description: Routes liées aux projets
 *   get:
 *     summary: Accède aux projets
 *     tags: [Projets]
 */
router.use("/projets", projetsRoutes);


/**
 * @swagger
 * /api/taches:
 *   description: Routes liées aux tâches
 *   get:
 *     summary: Accède aux tâches
 *     tags: [Tâches]
 */
router.use("/taches", tachesRoutes);

/**
 * @swagger
 * /api/livrables:
 *   description: Routes liées aux livrables
 *   get:
 *     summary: Accède aux livrables
 *     tags: [Livrables]
 */
router.use("/livrables", livrablesRoutes);

module.exports = router;
