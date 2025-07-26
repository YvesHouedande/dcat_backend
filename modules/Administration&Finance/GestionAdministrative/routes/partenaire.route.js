const express = require('express');
const router = express.Router();
const controller = require('../controllers/partenaire.controller');
const { protect } = require("../../../../core/auth/middleware");

/**
 * @swagger
 * tags:
 *   name: Partenaires
 *   description: Gestion des partenaires
 */

/**
 * @swagger
 * /administration/partenaires:
 *   post:
 *     summary: Créer un partenaire
 *     tags: [Partenaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_partenaire:
 *                 type: string
 *                 nullable: true
 *               telephone_partenaire:
 *                 type: string
 *                 nullable: true
 *               email_partenaire:
 *                 type: string
 *                 nullable: true
 *               specialite:
 *                 type: string
 *                 nullable: true
 *               localisation:
 *                 type: string
 *               type_partenaire:
 *                 type: string
 *                 nullable: true
 *               statut:
 *                 type: string
 *                 nullable: true
 *               id_entite:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - localisation
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 *       500:
 *         description: Erreur serveur
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partenaires]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partenaire'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 42
 *               data:
 *                 - id_partenaire: 1
 *                   nom_partenaire: "Entreprise X"
 *                   type_partenaire: "Fournisseur"
 *                   telephone_partenaire: "0600000000"
 *                   localisation: "Paris"
 *                   statut: "actif"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *       500:
 *         description: Erreur serveur
 *
 * /administration/partenaires/{id}:
 *   get:
 *     summary: Récupérer un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Détails du partenaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_partenaire:
 *                   type: integer
 *                 nom_partenaire:
 *                   type: string
 *                   nullable: true
 *                 telephone_partenaire:
 *                   type: string
 *                   nullable: true
 *                 email_partenaire:
 *                   type: string
 *                   nullable: true
 *                 specialite:
 *                   type: string
 *                   nullable: true
 *                 localisation:
 *                   type: string
 *                 type_partenaire:
 *                   type: string
 *                   nullable: true
 *                 statut:
 *                   type: string
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 entites:
 *                   type: array
 *                   description: Liste des entités liées à ce partenaire
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_entite:
 *                         type: integer
 *                       denomination:
 *                         type: string
 *                       abreviation_nom:
 *                         type: string
 *                       contact:
 *                         type: string
 *                       adresse_postal:
 *                         type: string
 *                       id_partenaire:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *             example:
 *               id_partenaire: 1
 *               nom_partenaire: "Entreprise X"
 *               telephone_partenaire: "0600000000"
 *               email_partenaire: "contact@entreprise.com"
 *               specialite: "Informatique"
 *               localisation: "Paris"
 *               type_partenaire: "Fournisseur"
 *               statut: "actif"
 *               created_at: "2024-03-01T12:00:00Z"
 *               updated_at: "2024-03-01T12:00:00Z"
 *               entites:
 *                 - id_entite: 10
 *                   denomination: "Entité A"
 *                   abreviation_nom: "EA"
 *                   contact: "0123456789"
 *                   adresse_postal: "1 rue de Paris"
 *                   id_partenaire: 1
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *                 - id_entite: 11
 *                   denomination: "Entité B"
 *                   abreviation_nom: "EB"
 *                   contact: "0987654321"
 *                   adresse_postal: "2 avenue de Lyon"
 *                   id_partenaire: 1
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 *
 * /administration/partenaires/type/{type}:
 *   get:
 *     summary: Récupérer les partenaires par type (paginé)
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type du partenaire
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des partenaires du type donné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partenaire'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *             example:
 *               data:
 *                 - id_partenaire: 1
 *                   nom_partenaire: "Entreprise X"
 *                   type_partenaire: "Fournisseur"
 *                   telephone_partenaire: "0600000000"
 *                   localisation: "Paris"
 *                   statut: "actif"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 42
 *                 totalPages: 5
 *       500:
 *         description: Erreur serveur
 *
 * components:
 *   schemas:
 *     Partenaire:
 *       type: object
 *       properties:
 *         id_partenaire:
 *           type: integer
 *         nom_partenaire:
 *           type: string
 *           nullable: true
 *         telephone_partenaire:
 *           type: string
 *           nullable: true
 *         email_partenaire:
 *           type: string
 *           nullable: true
 *         specialite:
 *           type: string
 *           nullable: true
 *         localisation:
 *           type: string
 *         type_partenaire:
 *           type: string
 *           nullable: true
 *         statut:
 *           type: string
 *           nullable: true
 *         id_entite:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /administration/partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_partenaire:
 *                 type: string
 *                 nullable: true
 *               telephone_partenaire:
 *                 type: string
 *                 nullable: true
 *               email_partenaire:
 *                 type: string
 *                 nullable: true
 *               specialite:
 *                 type: string
 *                 nullable: true
 *               localisation:
 *                 type: string
 *               type_partenaire:
 *                 type: string
 *                 nullable: true
 *               statut:
 *                 type: string
 *                 nullable: true
 *               id_entite:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partenaire'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Partenaire supprimé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */

router.post("/", controller.createPartenaire);
// router.get("/", protect(['Gestion_administration']), controller.getPartenaires);
router.get("/", controller.getPartenaires);
router.get("/:id", controller.getPartenaireById);
router.get("/type/:type", controller.getPartenairebyType);
router.put("/:id", controller.updatePartenaire);
router.delete("/:id", controller.deletePartenaire);

module.exports = router;
