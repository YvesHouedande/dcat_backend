const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Interventions
 *     description: Gestion des interventions techniques
 *   - name: Projets
 *     description: Gestion des projets
 *   - name: Tâches
 *     description: Gestion des tâches des projets
 *   - name: Livrables
 *     description: Gestion des livrables des projets
 * 
 * components:
 *   schemas:
 *     Intervention:
 *       type: object
 *       properties:
 *         id_intervention:
 *           type: integer
 *           description: Identifiant unique de l'intervention
 *         date_intervention:
 *           type: string
 *           format: date
 *           description: Date de l'intervention
 *         type_intervention:
 *           type: string
 *           description: Type d'intervention
 *         statut_intervention:
 *           type: string
 *           description: Statut de l'intervention
 *         rapport_intervention:
 *           type: string
 *           description: Rapport détaillé de l'intervention
 *     
 *     Projet:
 *       type: object
 *       properties:
 *         id_projet:
 *           type: integer
 *           description: Identifiant unique du projet
 *         nom_projet:
 *           type: string
 *           description: Nom du projet
 *         type_projet:
 *           type: string
 *           description: Type de projet
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début du projet
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin prévue du projet
 *         etat:
 *           type: string
 *           description: État d'avancement du projet
 *
 *     Tache:
 *       type: object
 *       properties:
 *         id_tache:
 *           type: integer
 *           description: Identifiant unique de la tâche
 *         nom_tache:
 *           type: string
 *           description: Nom de la tâche
 *         statut:
 *           type: string
 *           description: Statut de la tâche
 *         priorite:
 *           type: string
 *           description: Priorité de la tâche
 *
 *     Livrable:
 *       type: object
 *       properties:
 *         id_livrable:
 *           type: integer
 *           description: Identifiant unique du livrable
 *         libelle_livrable:
 *           type: string
 *           description: Libellé du livrable
 *         date:
 *           type: string
 *           format: date
 *           description: Date du livrable
 */

// Import des sous-routes
const interventionsRoutes = require("./interventions.routes");
const projetsRoutes = require("./projets.routes");
const tachesRoutes = require("./taches.routes");
const livrablesRoutes = require("./livrable.routes");

// Montage des routes
router.use("/interventions", interventionsRoutes);
router.use("/projets", projetsRoutes);
router.use("/taches", tachesRoutes);
router.use("/livrables", livrablesRoutes);

module.exports = router;
