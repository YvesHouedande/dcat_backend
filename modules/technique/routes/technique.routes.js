const express = require("express");
const router = express.Router();

// Import des sous-routes
const interventionsRoutes = require("./interventions.routes");
const projetsRoutes = require("./projets.routes");
const operationsRoutes = require("./operations.routes");
const tachesRoutes = require("./taches.routes");
const livrablesRoutes = require("./livrable.routes");

/**
 * @swagger
 * tags:
 *   - name: Projets
 *     description: Gestion des projets techniques
 *   - name: Opérations
 *     description: Gestion des opérations liées aux projets
 *   - name: Tâches
 *     description: Gestion des tâches liées aux opérations
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
 * /technique/projets:
 *   get:
 *     summary: API de gestion des projets
 *     description: Point d'entrée pour toutes les opérations liées aux projets
 *     tags: [Projets]
 */
router.use("/projets", projetsRoutes);

/**
 * @swagger
 * /technique/operations:
 *   get:
 *     summary: API de gestion des opérations
 *     description: Point d'entrée pour toutes les opérations liées aux projets
 *     tags: [Opérations]
 */
router.use("/operations", operationsRoutes);

/**
 * @swagger
 * /technique/taches:
 *   get:
 *     summary: API de gestion des tâches
 *     description: Point d'entrée pour toutes les opérations liées aux tâches des opérations
 *     tags: [Tâches]
 */
router.use("/taches", tachesRoutes);

/**
 * @swagger
 * /technique/livrables:
 *   get:
 *     summary: API de gestion des livrables
 *     description: Point d'entrée pour toutes les opérations liées aux livrables des projets
 *     tags: [Livrables]
 */
router.use("/livrables", livrablesRoutes);

/**
 * @swagger
 * /technique/interventions:
 *   get:
 *     summary: API de gestion des interventions
 *     description: Point d'entrée pour toutes les opérations liées aux interventions techniques
 *     tags: [Interventions]
 */
router.use("/interventions", interventionsRoutes);

module.exports = router;
