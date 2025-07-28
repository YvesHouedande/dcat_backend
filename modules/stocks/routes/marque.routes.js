const express = require("express");
const router = express.Router();
const controller = require("../controllers/marque.controller");

// CRUD Routes
// router.post("/", controller.createMarque);
// router.get("/", controller.getMarques);
// router.get("/:id", controller.getMarqueById);
// router.put("/:id", controller.updateMarque);
// router.delete("/:id", controller.deleteMarque);

/**
 * @swagger
 * components:
 *   schemas:
 *     Marque:
 *       type: object
 *       properties:
 *         id_marque:
 *           type: integer
 *           description: Identifiant unique de la marque
 *           example: 1
 *         libelle_marque:
 *           type: string
 *           maxLength: 50
 *           description: Nom de la marque
 *           example: "Samsung"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *           example: "2025-04-23T10:54:23.358Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *           example: "2025-04-23T10:54:23.358Z"
 *     MarqueInput:
 *       type: object
 *       required:
 *         - libelle_marque
 *       properties:
 *         libelle_marque:
 *           type: string
 *           maxLength: 50
 *           description: Nom de la marque
 *           example: "Samsung"
 *     ModeleMinimal:
 *       type: object
 *       properties:
 *         id_modele:
 *           type: integer
 *           description: Identifiant unique du modèle
 *           example: 2
 *         libelle_modele:
 *           type: string
 *           description: Nom du modèle
 *           example: "Galaxy Tab S9"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur
 *           example: "une erreur est survenue"
 *         details:
 *           type: string
 *           description: Détails de l'erreur
 *           example: "Validation failed"
 */

/**
 * @swagger
 * /stocks/marques:
 *   post:
 *     summary: Crée une nouvelle marque
 *     tags: [Marques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarqueInput'
 *           examples:
 *             Samsung:
 *               summary: Création d'une marque Samsung
 *               value:
 *                 libelle_marque: "Samsung"
 *             Apple:
 *               summary: Création d'une marque Apple
 *               value:
 *                 libelle_marque: "Apple"
 *     responses:
 *       201:
 *         description: Marque créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marque'
 *             example:
 *               id_marque: 5
 *               libelle_marque: "Samsung"
 *               created_at: "2025-04-23T10:54:23.358Z"
 *               updated_at: "2025-04-23T10:54:23.358Z"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Données invalides"
 *               details: "Le champ libelle_marque est requis"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */
router.post("/", controller.createMarque);

/**
 * @swagger
 * /stocks/marques:
 *   get:
 *     summary: Récupère toutes les marques
 *     tags: [Marques]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des marques récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Marque'
 *             examples:
 *               success:
 *                 summary: Liste de marques
 *                 value:
 *                   - id_marque: 3
 *                     libelle_marque: "Samsung"
 *                     created_at: "2025-04-23T10:54:23.358Z"
 *                     updated_at: "2025-04-23T10:54:23.358Z"
 *                   - id_marque: 4
 *                     libelle_marque: "Apple"
 *                     created_at: "2025-04-23T11:39:04.388Z"
 *                     updated_at: "2025-04-23T11:39:04.388Z"
 *               empty:
 *                 summary: Aucune marque trouvée
 *                 value: []
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */

router.get("/", controller.getMarques);

/**
 * @swagger
 * /stocks/marques/{id}/modeles:
 *   get:
 *     summary: Récupère les modèles d'une marque spécifique
 *     tags: [Marques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la marque
 *         example: 3
 *     responses:
 *       200:
 *         description: Liste des modèles appartenant à la marque
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModeleMinimal'
 *             examples:
 *               success:
 *                 summary: Modèles trouvés
 *                 value:
 *                   - id_modele: 2
 *                     libelle_modele: "Galaxy Tab S9"
 *                   - id_modele: 7
 *                     libelle_modele: "SmartHub 3"
 *               empty:
 *                 summary: Aucun modèle trouvé
 *                 value: []
 *       400:
 *         description: ID de marque invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID invalide"
 *               details: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Marque non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Marque non trouvée"
 *               details: "Aucune marque trouvée avec l'ID fourni"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */

router.get("/:id/modeles", controller.getMarqueModeles);

/**
 * @swagger
 * /stocks/marques/{id}:
 *   get:
 *     summary: Récupère une marque par son ID
 *     tags: [Marques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique de la marque
 *         example: 3
 *     responses:
 *       200:
 *         description: Marque trouvée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marque'
 *             example:
 *               id_marque: 3
 *               libelle_marque: "Samsung"
 *               created_at: "2025-04-23T10:54:23.358Z"
 *               updated_at: "2025-04-23T10:54:23.358Z"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID invalide"
 *               details: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Marque non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Marque non trouvée"
 *               details: "Aucune marque trouvée avec cet ID"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */
router.get("/:id", controller.getMarqueById);

/**
 * @swagger
 * /stocks/marques/{id}:
 *   put:
 *     summary: Met à jour une marque par son ID
 *     tags: [Marques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique de la marque à modifier
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarqueInput'
 *           examples:
 *             update_name:
 *               summary: Mise à jour du nom
 *               value:
 *                 libelle_marque: "Samsung Electronics"
 *     responses:
 *       200:
 *         description: Marque mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marque'
 *             example:
 *               id_marque: 3
 *               libelle_marque: "Samsung Electronics"
 *               created_at: "2025-04-23T10:54:23.358Z"
 *               updated_at: "2025-04-23T15:30:45.123Z"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_id:
 *                 summary: ID invalide
 *                 value:
 *                   error: "ID invalide"
 *                   details: "L'ID doit être un nombre entier positif"
 *               invalid_data:
 *                 summary: Données invalides
 *                 value:
 *                   error: "Données invalides"
 *                   details: "Le champ libelle_marque ne peut pas être vide"
 *       404:
 *         description: Marque non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Marque non trouvée"
 *               details: "Aucune marque trouvée avec cet ID"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */
router.put("/:id", controller.updateMarque);

/**
 * @swagger
 * /stocks/marques/{id}:
 *   delete:
 *     summary: Supprime une marque par son ID
 *     tags: [Marques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique de la marque à supprimer
 *         example: 3
 *     responses:
 *       200:
 *         description: Marque supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marque'
 *             example:
 *               id_marque: 3
 *               libelle_marque: "Samsung"
 *               created_at: "2025-04-23T10:54:23.358Z"
 *               updated_at: "2025-04-23T10:54:23.358Z"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID invalide"
 *               details: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Marque non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Marque non trouvée"
 *               details: "Aucune marque trouvée avec cet ID"
 *       409:
 *         description: Conflit - impossible de supprimer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Suppression impossible"
 *               details: "Cette marque est utilisée par des modèles existants"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "une erreur est survenue"
 *               details: "Database connection failed"
 */
router.delete("/:id", controller.deleteMarque);


module.exports = router;
