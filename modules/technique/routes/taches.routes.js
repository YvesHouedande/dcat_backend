const express = require("express");
const router = express.Router();
const tachesController = require("../controllers/taches.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Tache:
 *       type: object
 *       properties:
 *         id_tache:
 *           type: integer
 *           description: ID unique de la tâche
 *         nom_tache:
 *           type: string
 *           description: Nom de la tâche
 *         desc_tache:
 *           type: string
 *           description: Description détaillée de la tâche
 *         statut:
 *           type: string
 *           description: Statut actuel de la tâche (À faire, En cours, Terminée, etc.)
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début de la tâche
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin prévue/réelle de la tâche
 *         priorite:
 *           type: string
 *           description: Niveau de priorité de la tâche (Basse, Moyenne, Haute, etc.)
 *         id_projet:
 *           type: integer
 *           description: ID du projet auquel la tâche est rattachée
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'enregistrement
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *     Employe:
 *       type: object
 *       properties:
 *         id_employes:
 *           type: integer
 *           description: ID unique de l'employé
 *         nom_employes:
 *           type: string
 *           description: Nom de l'employé
 *         prenom_employes:
 *           type: string
 *           description: Prénom de l'employé
 *         email_employes:
 *           type: string
 *           description: Email de l'employé
 *         contact_employes:
 *           type: string
 *           description: Numéro de contact de l'employé
 *         status_employes:
 *           type: string
 *           description: Statut de l'employé
 *         fonction:
 *           type: string
 *           description: Fonction/poste de l'employé
 */

/**
 * @swagger
 * /api/marketing_commercial/taches:
 *   get:
 *     summary: Liste toutes les tâches
 *     description: Récupère la liste complète des tâches avec leurs informations
 *     tags: [Tâches]
 *     responses:
 *       200:
 *         description: Liste des tâches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 taches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tache'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", tachesController.getAllTaches);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}:
 *   get:
 *     summary: Récupère une tâche par son ID
 *     description: Retourne les détails d'une tâche spécifique
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Détails de la tâche récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tache:
 *                   $ref: '#/components/schemas/Tache'
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", tachesController.getTacheById);

/**
 * @swagger
 * /api/marketing_commercial/taches:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     description: Enregistre une nouvelle tâche dans le système
 *     tags: [Tâches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_tache
 *               - id_projet
 *             properties:
 *               nom_tache:
 *                 type: string
 *                 description: Nom de la tâche
 *               desc_tache:
 *                 type: string
 *                 description: Description détaillée de la tâche
 *               statut:
 *                 type: string
 *                 description: Statut de la tâche
 *                 enum: [À faire, En cours, Terminée, En attente, Annulée]
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la tâche (YYYY-MM-DD)
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue de la tâche (YYYY-MM-DD)
 *               priorite:
 *                 type: string
 *                 description: Niveau de priorité de la tâche
 *                 enum: [Basse, Moyenne, Haute, Urgente]
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel la tâche est rattachée
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tache:
 *                   $ref: '#/components/schemas/Tache'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", tachesController.createTache);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}:
 *   put:
 *     summary: Met à jour une tâche
 *     description: Modifie les informations d'une tâche existante
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_tache:
 *                 type: string
 *                 description: Nom de la tâche
 *               desc_tache:
 *                 type: string
 *                 description: Description détaillée de la tâche
 *               statut:
 *                 type: string
 *                 description: Statut de la tâche
 *                 enum: [À faire, En cours, Terminée, En attente, Annulée]
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la tâche (YYYY-MM-DD)
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue de la tâche (YYYY-MM-DD)
 *               priorite:
 *                 type: string
 *                 description: Niveau de priorité de la tâche
 *                 enum: [Basse, Moyenne, Haute, Urgente]
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel la tâche est rattachée
 *     responses:
 *       200:
 *         description: Tâche mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tache:
 *                   $ref: '#/components/schemas/Tache'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", tachesController.updateTache);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}:
 *   delete:
 *     summary: Supprime une tâche
 *     description: Supprime une tâche existante par son ID
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche à supprimer
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", tachesController.deleteTache);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}/employes:
 *   post:
 *     summary: Assigne un employé à une tâche
 *     description: Associe un employé à une tâche existante
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_employes
 *             properties:
 *               id_employes:
 *                 type: integer
 *                 description: ID de l'employé à associer
 *     responses:
 *       201:
 *         description: Employé assigné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Employé assigné à la tâche avec succès
 *       400:
 *         description: Données invalides ou association déjà existante
 *       404:
 *         description: Tâche ou employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/employes", tachesController.addEmployeToTache);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}/employes/{employeId}:
 *   delete:
 *     summary: Retire un employé d'une tâche
 *     description: Dissocie un employé d'une tâche existante
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *       - in: path
 *         name: employeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé à retirer
 *     responses:
 *       200:
 *         description: Employé retiré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Employé retiré de la tâche avec succès
 *       404:
 *         description: Tâche, employé ou association non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/employes/:employeId", tachesController.removeEmployeFromTache);

/**
 * @swagger
 * /api/marketing_commercial/taches/{id}/employes:
 *   get:
 *     summary: Récupère les employés assignés à une tâche
 *     description: Retourne la liste des employés associés à une tâche spécifique
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Liste des employés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 employes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employe'
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/employes", tachesController.getTacheEmployes);

/**
 * @swagger
 * /api/marketing_commercial/taches/projet/{projetId}:
 *   get:
 *     summary: Récupère les tâches associées à un projet
 *     description: Retourne la liste des tâches appartenant à un projet spécifique
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des tâches du projet récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 taches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tache'
 *       404:
 *         description: Projet non trouvé ou aucune tâche associée
 *       500:
 *         description: Erreur serveur
 */
router.get("/projet/:projetId", tachesController.getTachesByProjet);

module.exports = router;
