const express = require("express");
const router = express.Router();



// Import des sous-routes
const interventionsRoutes = require("./interventions.routes");
const projetsRoutes = require("./projets.routes");
const tachesRoutes = require("./taches.routes");
const livrablesRoutes = require("./livrable.routes");

/**
 * @swagger
 * tags:
 *   - name: Projets
 *     description: Gestion des projets techniques
 *   - name: Tâches
 *     description: Gestion des tâches liées aux projets
 *   - name: Livrables
 *     description: Gestion des livrables des projets
 *   - name: Interventions
 *     description: Gestion des interventions techniques
 * 
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indique si la requête a réussi
 *         message:
 *           type: string
 *           description: Message décrivant le résultat de l'opération
 */

/**
 * @swagger
 * /api/technique/projets:
 *   get:
 *     summary: API de gestion des projets
 *     description: Point d'entrée pour toutes les opérations liées aux projets
 *     tags: [Projets]
 */
router.use("/projets", projetsRoutes);

/**
 * @swagger
 * /api/technique/taches:
 *   get:
 *     summary: API de gestion des tâches
 *     description: Point d'entrée pour toutes les opérations liées aux tâches des projets
 *     tags: [Tâches]
 */
router.use("/taches", tachesRoutes);

/**
 * @swagger
 * /api/technique/livrables:
 *   get:
 *     summary: API de gestion des livrables
 *     description: Point d'entrée pour toutes les opérations liées aux livrables des projets
 *     tags: [Livrables]
 */
router.use("/livrables", livrablesRoutes);

/**
 * @swagger
 * /api/technique/interventions:
 *   get:
 *     summary: API de gestion des interventions
 *     description: Point d'entrée pour toutes les opérations liées aux interventions techniques
 *     tags: [Interventions]
 */
router.use("/interventions", interventionsRoutes);

module.exports = router;
