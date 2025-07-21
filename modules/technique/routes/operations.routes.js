const express = require("express");
const router = express.Router();
const operationsController = require("../controllers/operations.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Operation:
 *       type: object
 *       properties:
 *         id_operation:
 *           type: integer
 *           description: ID unique de l'opération
 *         nom_operation:
 *           type: string
 *           description: Nom de l'opération
 *         desc_operation:
 *           type: string
 *           description: Description détaillée de l'opération
 *         statut:
 *           type: string
 *           description: Statut actuel de l'opération (À faire, En cours, Terminée, etc.)
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début de l'opération
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin prévue/réelle de l'opération
 *         priorite:
 *           type: string
 *           description: Niveau de priorité de l'opération (Basse, Moyenne, Haute, etc.)
 *         id_projet:
 *           type: integer
 *           description: ID du projet auquel l'opération est rattachée
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'enregistrement
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *     Tache:
 *       type: object
 *       properties:
 *         id_tache:
 *           type: integer
 *           description: ID unique de la tâche
 *         nom_tache:
 *           type: string
 *           description: Nom de la tâche
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début de la tâche
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin prévue/réelle de la tâche
 *         id_operation:
 *           type: integer
 *           description: ID de l'opération à laquelle la tâche est rattachée
 */

/**
 * @swagger
 * /technique/operations:
 *   get:
 *     summary: Liste toutes les opérations avec pagination
 *     description: Récupère la liste paginée des opérations avec filtres optionnels
 *     tags: [Opérations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou description de l'opération
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut de l'opération (À faire, En cours, Terminée, etc.)
 *       - in: query
 *         name: priorite
 *         schema:
 *           type: string
 *         description: Filtrer par priorité de l'opération (Basse, Moyenne, Haute, Urgente)
 *       - in: query
 *         name: projetId
 *         schema:
 *           type: integer
 *         description: ID du projet associé à l'opération
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début minimum (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin maximum (YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Champ à utiliser pour le tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordre de tri (ascendant ou descendant)
 *     responses:
 *       200:
 *         description: Liste des opérations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Operation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Erreur serveur
 */
router.get("/", operationsController.getAllOperations);

/**
 * @swagger
 * /technique/operations/{id}:
 *   get:
 *     summary: Récupère une opération par son ID
 *     description: Retourne les détails d'une opération spécifique
 *     tags: [Opérations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'opération
 *     responses:
 *       200:
 *         description: Détails de l'opération récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Operation'
 *       404:
 *         description: Opération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", operationsController.getOperationById);

/**
 * @swagger
 * /technique/operations:
 *   post:
 *     summary: Crée une nouvelle opération
 *     description: Enregistre une nouvelle opération dans le système
 *     tags: [Opérations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_operation
 *               - id_projet
 *             properties:
 *               nom_operation:
 *                 type: string
 *                 description: Nom de l'opération
 *               desc_operation:
 *                 type: string
 *                 description: Description détaillée de l'opération
 *               statut:
 *                 type: string
 *                 description: Statut de l'opération
 *                 enum: [À faire, En cours, Terminée, En attente, Annulée]
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'opération (YYYY-MM-DD)
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue de l'opération (YYYY-MM-DD)
 *               priorite:
 *                 type: string
 *                 description: Niveau de priorité de l'opération
 *                 enum: [Basse, Moyenne, Haute, Urgente]
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel l'opération est rattachée
 *     responses:
 *       201:
 *         description: Opération créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Operation'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", operationsController.createOperation);

/**
 * @swagger
 * /technique/operations/{id}:
 *   put:
 *     summary: Met à jour une opération
 *     description: Modifie les informations d'une opération existante
 *     tags: [Opérations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'opération à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_operation:
 *                 type: string
 *                 description: Nom de l'opération
 *               desc_operation:
 *                 type: string
 *                 description: Description détaillée de l'opération
 *               statut:
 *                 type: string
 *                 description: Statut de l'opération
 *                 enum: [À faire, En cours, Terminée, En attente, Annulée]
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'opération (YYYY-MM-DD)
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin prévue de l'opération (YYYY-MM-DD)
 *               priorite:
 *                 type: string
 *                 description: Niveau de priorité de l'opération
 *                 enum: [Basse, Moyenne, Haute, Urgente]
 *               id_projet:
 *                 type: integer
 *                 description: ID du projet auquel l'opération est rattachée
 *     responses:
 *       200:
 *         description: Opération mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Operation'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Opération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", operationsController.updateOperation);

/**
 * @swagger
 * /technique/operations/{id}:
 *   delete:
 *     summary: Supprime une opération
 *     description: Supprime une opération existante par son ID
 *     tags: [Opérations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'opération à supprimer
 *     responses:
 *       200:
 *         description: Opération supprimée avec succès
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
 *                   example: Opération supprimée avec succès
 *       404:
 *         description: Opération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", operationsController.deleteOperation);

/**
 * @swagger
 * /technique/operations/{id}/taches:
 *   get:
 *     summary: Récupère les tâches associées à une opération
 *     description: Retourne la liste des tâches appartenant à une opération spécifique
 *     tags: [Opérations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'opération
 *     responses:
 *       200:
 *         description: Liste des tâches de l'opération récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tache'
 *       404:
 *         description: Opération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/taches", operationsController.getOperationTaches);

/**
 * @swagger
 * /technique/operations/projet/{projetId}:
 *   get:
 *     summary: Récupère les opérations associées à un projet
 *     description: Retourne la liste des opérations appartenant à un projet spécifique
 *     tags: [Opérations]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des opérations du projet récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Operation'
 *       404:
 *         description: Projet non trouvé ou aucune opération associée
 *       500:
 *         description: Erreur serveur
 */
router.get("/projet/:projetId", operationsController.getOperationsByProjet);

module.exports = router;
