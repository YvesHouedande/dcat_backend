const express = require("express");
const router = express.Router();
const controller = require("../controllers/modele.controller");

// CRUD Routes
// router.post("/", controller.createModele);
// router.get("/", controller.getModeles);
// router.get("/:id", controller.getModeleById);
// router.put("/:id", controller.updateModele);
// router.delete("/:id", controller.deleteModele);

/**
 * @swagger
 * components:
 *   schemas:
 *     Modele:
 *       type: object
 *       properties:
 *         id_modele:
 *           type: integer
 *           description: Identifiant unique du modèle
 *           example: 1
 *         libelle_modele:
 *           type: string
 *           maxLength: 50
 *           description: Nom du modèle
 *           example: "Galaxy Tab S9"
 *         id_marque:
 *           type: integer
 *           description: Identifiant de la marque associée
 *           example: 3
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *           example: "2025-04-23T11:43:12.111Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *           example: "2025-04-23T11:43:12.111Z"
 *     ModeleInput:
 *       type: object
 *       required:
 *         - libelle_modele
 *         - id_marque
 *       properties:
 *         libelle_modele:
 *           type: string
 *           maxLength: 50
 *           description: Nom du modèle
 *           example: "Galaxy Tab S9"
 *         id_marque:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant de la marque associée
 *           example: 3
 *     ModeleWithMarque:
 *       allOf:
 *         - $ref: '#/components/schemas/Modele'
 *         - type: object
 *           properties:
 *             marque:
 *               type: object
 *               properties:
 *                 id_marque:
 *                   type: integer
 *                   example: 3
 *                 libelle_marque:
 *                   type: string
 *                   example: "Samsung"
 */

/**
 * @swagger
 * /stocks/modeles:
 *   post:
 *     summary: Crée un nouveau modèle
 *     tags: [Modèles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModeleInput'
 *           examples:
 *             samsung_tablet:
 *               summary: Tablette Samsung
 *               value:
 *                 libelle_modele: "Galaxy Tab S9"
 *                 id_marque: 3
 *             apple_laptop:
 *               summary: Ordinateur portable Apple
 *               value:
 *                 libelle_modele: "MacBook Pro M3"
 *                 id_marque: 4
 *     responses:
 *       201:
 *         description: Modèle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modele'
 *             example:
 *               id_modele: 9
 *               libelle_modele: "Galaxy Tab S9"
 *               id_marque: 3
 *               created_at: "2025-04-23T11:43:12.111Z"
 *               updated_at: "2025-04-23T11:43:12.111Z"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_fields:
 *                 summary: Champs manquants
 *                 value:
 *                   error: "Données invalides"
 *                   details: "Les champs libelle_modele et id_marque sont requis"
 *               invalid_brand:
 *                 summary: Marque invalide
 *                 value:
 *                   error: "Marque invalide"
 *                   details: "La marque spécifiée n'existe pas"
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
router.post("/", controller.createModele);

/**
 * @swagger
 * /stocks/modeles:
 *   get:
 *     summary: Récupère tous les modèles
 *     tags: [Modèles]
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
 *       - in: query
 *         name: marque
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrer par ID de marque
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche textuelle dans le nom du modèle
 *     responses:
 *       200:
 *         description: Liste des modèles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Modele'
 *             examples:
 *               success:
 *                 summary: Liste de modèles
 *                 value:
 *                   - id_modele: 1
 *                     libelle_modele: "Bravia X90J"
 *                     id_marque: 1
 *                     created_at: "2025-04-23T11:43:12.111Z"
 *                     updated_at: "2025-04-23T11:43:12.111Z"
 *                   - id_modele: 2
 *                     libelle_modele: "Galaxy Tab S9"
 *                     id_marque: 3
 *                     created_at: "2025-04-23T11:43:17.630Z"
 *                     updated_at: "2025-04-23T11:43:17.630Z"
 *               empty:
 *                 summary: Aucun modèle trouvé
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

router.get("/", controller.getModeles);

/**
 * @swagger
 * /stocks/modeles/{id}:
 *   get:
 *     summary: Récupère un modèle par son ID
 *     tags: [Modèles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du modèle
 *         example: 2
 *     responses:
 *       200:
 *         description: Modèle trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modele'
 *             example:
 *               id_modele: 2
 *               libelle_modele: "Galaxy Tab S9"
 *               id_marque: 3
 *               created_at: "2025-04-23T11:43:12.111Z"
 *               updated_at: "2025-04-23T11:43:12.111Z"
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
 *         description: Modèle non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Modèle non trouvé"
 *               details: "Aucun modèle trouvé avec cet ID"
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
router.get("/:id", controller.getModeleById);

/**
 * @swagger
 * /stocks/modeles/{id}:
 *   put:
 *     summary: Met à jour un modèle par son ID
 *     tags: [Modèles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du modèle à modifier
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle_modele:
 *                 type: string
 *                 maxLength: 50
 *                 description: Nouveau nom du modèle
 *                 example: "Galaxy Tab S9 Pro"
 *               id_marque:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nouveau ID de marque
 *                 example: 3
 *           examples:
 *             update_name:
 *               summary: Mise à jour du nom
 *               value:
 *                 libelle_modele: "Galaxy Tab S9 Pro"
 *             update_brand:
 *               summary: Changement de marque
 *               value:
 *                 libelle_modele: "Galaxy Tab S9"
 *                 id_marque: 4
 *             partial_update:
 *               summary: Mise à jour partielle
 *               value:
 *                 libelle_modele: "Galaxy Tab S9 Ultra"
 *     responses:
 *       200:
 *         description: Modèle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modele'
 *             example:
 *               id_modele: 2
 *               libelle_modele: "Galaxy Tab S9 Pro"
 *               id_marque: 3
 *               created_at: "2025-04-23T11:43:12.111Z"
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
 *               invalid_brand:
 *                 summary: Marque invalide
 *                 value:
 *                   error: "Marque invalide"
 *                   details: "La marque spécifiée n'existe pas"
 *               invalid_data:
 *                 summary: Données invalides
 *                 value:
 *                   error: "Données invalides"
 *                   details: "Le nom du modèle ne peut pas être vide"
 *       404:
 *         description: Modèle non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Modèle non trouvé"
 *               details: "Aucun modèle trouvé avec cet ID"
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
router.put("/:id", controller.updateModele);

/**
 * @swagger
 * /stocks/modeles/{id}:
 *   delete:
 *     summary: Supprime un modèle par son ID
 *     tags: [Modèles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du modèle à supprimer
 *         example: 2
 *     responses:
 *       200:
 *         description: Modèle supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modele'
 *             example:
 *               id_modele: 2
 *               libelle_modele: "Galaxy Tab S9"
 *               id_marque: 3
 *               created_at: "2025-04-23T11:43:12.111Z"
 *               updated_at: "2025-04-23T11:43:12.111Z"
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
 *         description: Modèle non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Modèle non trouvé"
 *               details: "Aucun modèle trouvé avec cet ID"
 *       409:
 *         description: Conflit - impossible de supprimer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Suppression impossible"
 *               details: "Ce modèle est utilisé par des produits existants"
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
router.delete("/:id", controller.deleteModele);

/**
 * @swagger
 * /stocks/modeles/by-brand/{idMarque}:
 *   get:
 *     summary: Récupère tous les modèles d'une marque spécifique
 *     tags: [Modèles]
 *     parameters:
 *       - in: path
 *         name: idMarque
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la marque
 *         example: 3
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
 *         description: Liste des modèles de la marque récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Modele'
 *             examples:
 *               success:
 *                 summary: Modèles Samsung trouvés
 *                 value:
 *                   - id_modele: 2
 *                     libelle_modele: "Galaxy Tab S9"
 *                     id_marque: 3
 *                     created_at: "2025-04-23T11:43:12.111Z"
 *                     updated_at: "2025-04-23T11:43:12.111Z"
 *                   - id_modele: 7
 *                     libelle_modele: "SmartHub 3"
 *                     id_marque: 3
 *                     created_at: "2025-04-23T11:43:17.630Z"
 *                     updated_at: "2025-04-23T11:43:17.630Z"
 *               empty:
 *                 summary: Aucun modèle trouvé pour cette marque
 *                 value: []
 *       400:
 *         description: ID de marque invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID de marque invalide"
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
router.get("/by-brand/:idMarque", controller.getModelesByMarque);

module.exports = router;
