const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const interventionsController = require('../controllers/interventions.controller');
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

// Définition des chemins de stockage
const UPLOAD_PATHS = {
  INTERVENTIONS: 'media/documents/technique/interventions'
};

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "Erreur lors du téléchargement du fichier",
      error: err.message
    });
  }
  next(err);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Intervention:
 *       type: object
 *       properties:
 *         id_intervention:
 *           type: integer
 *           description: ID unique de l'intervention
 *         date_intervention:
 *           type: string
 *           format: date
 *           description: Date de l'intervention
 *         cause_defaillance:
 *           type: string
 *           description: Cause de la défaillance
 *         rapport_intervention:
 *           type: string
 *           description: Rapport détaillé de l'intervention
 *         type_intervention:
 *           type: string
 *           description: Type d'intervention (Maintenance, Dépannage, Installation, etc.)
 *         type_defaillance:
 *           type: string
 *           description: Type de défaillance rencontrée
 *         duree:
 *           type: string
 *           description: Durée de l'intervention
 *         lieu:
 *           type: string
 *           description: Lieu où s'est déroulée l'intervention
 *         statut_intervention:
 *           type: string
 *           description: Statut actuel de l'intervention (En cours, Terminée, En attente, etc.)
 *         recommandation:
 *           type: string
 *           description: Recommandations suite à l'intervention
 *         probleme_signale:
 *           type: string
 *           description: Problème initialement signalé
 *         mode_intervention:
 *           type: string
 *           description: Mode d'intervention (Sur site, À distance, etc.)
 *         detail_cause:
 *           type: string
 *           description: Détails sur la cause du problème
 *         type:
 *           type: string
 *           description: Classification de l'intervention
 *         id_partenaire:
 *           type: integer
 *           description: ID du partenaire concerné par l'intervention
 *         id_contrat:
 *           type: integer
 *           description: ID du contrat lié à l'intervention
 *         id_superviseur:
 *           type: integer
 *           description: ID de l'employé superviseur de l'intervention
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'enregistrement
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *           description: ID unique du document
 *         libelle_document:
 *           type: string
 *           description: Libellé du document
 *         classification_document:
 *           type: string
 *           description: Classification du document
 *         date_document:
 *           type: string
 *           description: Date du document
 *         lien_document:
 *           type: string
 *           description: Chemin d'accès au document
 *         etat_document:
 *           type: string
 *           description: État du document (Actif, Archivé)
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
 */

/**
 * @swagger
 * /technique/interventions:
 *   get:
 *     summary: Liste toutes les interventions avec pagination
 *     description: Récupère la liste paginée des interventions avec filtres optionnels
 *     tags: [Interventions]
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
 *         description: Recherche par rapport d'intervention ou problème signalé
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrer par type d'intervention
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut de l'intervention
 *       - in: query
 *         name: lieu
 *         schema:
 *           type: string
 *         description: Filtrer par lieu de l'intervention
 *       - in: query
 *         name: typeIntervention
 *         schema:
 *           type: string
 *         description: Filtrer par type spécifique d'intervention
 *       - in: query
 *         name: modeIntervention
 *         schema:
 *           type: string
 *         description: Filtrer par mode d'intervention (Sur site, À distance, etc.)
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date d'intervention minimum (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date d'intervention maximum (YYYY-MM-DD)
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
 *         description: Liste des interventions récupérée avec succès
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
 *                     $ref: '#/components/schemas/Intervention'
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
router.get("/", interventionsController.getAllInterventions);

/**
 * @swagger
 * /technique/interventions/{id}:
 *   get:
 *     summary: Récupère une intervention par son ID
 *     description: Retourne les détails d'une intervention spécifique
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     responses:
 *       200:
 *         description: Détails de l'intervention récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 intervention:
 *                   $ref: '#/components/schemas/Intervention'
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", interventionsController.getInterventionById);

/**
 * @swagger
 * /technique/interventions:
 *   post:
 *     summary: Crée une nouvelle intervention
 *     description: Enregistre une nouvelle intervention technique
 *     tags: [Interventions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_intervention
 *               - type_intervention
 *               - lieu
 *             properties:
 *               date_intervention:
 *                 type: string
 *                 format: date
 *                 description: Date de l'intervention
 *               cause_defaillance:
 *                 type: string
 *                 description: Cause de la défaillance
 *               rapport_intervention:
 *                 type: string
 *                 description: Rapport détaillé de l'intervention
 *               type_intervention:
 *                 type: string
 *                 description: Type d'intervention (Maintenance, Dépannage, Installation, etc.)
 *               type_defaillance:
 *                 type: string
 *                 description: Type de défaillance rencontrée
 *               duree:
 *                 type: string
 *                 description: Durée de l'intervention
 *               lieu:
 *                 type: string
 *                 description: Lieu où s'est déroulée l'intervention
 *               statut_intervention:
 *                 type: string
 *                 description: Statut actuel de l'intervention
 *               recommandation:
 *                 type: string
 *                 description: Recommandations suite à l'intervention
 *               probleme_signale:
 *                 type: string
 *                 description: Problème initialement signalé
 *               mode_intervention:
 *                 type: string
 *                 description: Mode d'intervention (Sur site, À distance, etc.)
 *               detail_cause:
 *                 type: string
 *                 description: Détails sur la cause du problème
 *               type:
 *                 type: string
 *                 description: Classification de l'intervention
 *               id_partenaire:
 *                 type: integer
 *                 description: ID du partenaire concerné par l'intervention
 *               id_contrat:
 *                 type: integer
 *                 description: ID du contrat lié à l'intervention
 *               id_superviseur:
 *                 type: integer
 *                 description: ID de l'employé superviseur de l'intervention
 *     responses:
 *       201:
 *         description: Intervention créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 intervention:
 *                   $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", interventionsController.createIntervention);

/**
 * @swagger
 * /technique/interventions/{id}:
 *   put:
 *     summary: Met à jour une intervention
 *     description: Modifie les informations d'une intervention existante
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_intervention:
 *                 type: string
 *                 format: date
 *                 description: Date de l'intervention
 *               cause_defaillance:
 *                 type: string
 *                 description: Cause de la défaillance
 *               rapport_intervention:
 *                 type: string
 *                 description: Rapport détaillé de l'intervention
 *               type_intervention:
 *                 type: string
 *                 description: Type d'intervention
 *               type_defaillance:
 *                 type: string
 *                 description: Type de défaillance rencontrée
 *               duree:
 *                 type: string
 *                 description: Durée de l'intervention
 *               lieu:
 *                 type: string
 *                 description: Lieu où s'est déroulée l'intervention
 *               statut_intervention:
 *                 type: string
 *                 description: Statut actuel de l'intervention
 *               recommandation:
 *                 type: string
 *                 description: Recommandations suite à l'intervention
 *               probleme_signale:
 *                 type: string
 *                 description: Problème initialement signalé
 *               mode_intervention:
 *                 type: string
 *                 description: Mode d'intervention
 *               detail_cause:
 *                 type: string
 *                 description: Détails sur la cause du problème
 *               type:
 *                 type: string
 *                 description: Classification de l'intervention
 *               id_partenaire:
 *                 type: integer
 *                 description: ID du partenaire concerné
 *               id_contrat:
 *                 type: integer
 *                 description: ID du contrat lié
 *               id_superviseur:
 *                 type: integer
 *                 description: ID de l'employé superviseur de l'intervention
 *     responses:
 *       200:
 *         description: Intervention mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 intervention:
 *                   $ref: '#/components/schemas/Intervention'
 *       404:
 *         description: Intervention non trouvée
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", interventionsController.updateIntervention);

/**
 * @swagger
 * /technique/interventions/{id}:
 *   delete:
 *     summary: Supprime une intervention
 *     description: Supprime une intervention existante par son ID
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention à supprimer
 *     responses:
 *       200:
 *         description: Intervention supprimée avec succès
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
 *                   example: Intervention supprimée avec succès
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", interventionsController.deleteIntervention);

/**
 * @swagger
 * /technique/interventions/{id}/documents:
 *   post:
 *     summary: Ajoute un document à une intervention
 *     description: Télécharge et associe un document à une intervention existante
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - libelle_document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à télécharger
 *               libelle_document:
 *                 type: string
 *                 description: Nom du document
 *               classification_document:
 *                 type: string
 *                 description: Classification du document
 *               date_document:
 *                 type: string
 *                 description: Date du document
 *               id_nature_document:
 *                 type: integer
 *                 description: ID de la nature du document
 *     responses:
 *       201:
 *         description: Document ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 document:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Données invalides ou erreur de téléchargement
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/documents",
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.INTERVENTIONS);
      
      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      req.uploadPath = uploadPath;
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadMiddleware.single("document"),
  interventionsController.addDocumentToIntervention
);

/**
 * @swagger
 * /technique/interventions/{id}/employes:
 *   post:
 *     summary: Ajoute un employé à une intervention
 *     description: Associe un employé à une intervention existante
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
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
 *         description: Employé ajouté avec succès
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
 *                   example: Employé ajouté à l'intervention avec succès
 *       400:
 *         description: Données invalides ou association déjà existante
 *       404:
 *         description: Intervention ou employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/employes", interventionsController.addEmployeToIntervention);

/**
 * @swagger
 * /technique/interventions/{id}/employes/{employeId}:
 *   delete:
 *     summary: Retire un employé d'une intervention
 *     description: Dissocie un employé d'une intervention existante
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
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
 *                   example: Employé retiré de l'intervention avec succès
 *       404:
 *         description: Intervention, employé ou association non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/employes/:employeId", interventionsController.removeEmployeFromIntervention);

/**
 * @swagger
 * /technique/interventions/{id}/employes:
 *   get:
 *     summary: Récupère les employés d'une intervention
 *     description: Retourne la liste des employés associés à une intervention spécifique
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
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
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/employes", interventionsController.getInterventionEmployes);

/**
 * @swagger
 * /technique/interventions/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'une intervention
 *     description: Retourne la liste des documents associés à une intervention spécifique
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     responses:
 *       200:
 *         description: Liste des documents récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/documents", interventionsController.getInterventionDocuments);

/**
 * @swagger
 * /technique/interventions/{id}/documents/{documentId}:
 *   get:
 *     summary: Récupère un document spécifique d'une intervention
 *     description: Retourne les détails d'un document spécifique associé à une intervention
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du document à récupérer
 *     responses:
 *       200:
 *         description: Document récupéré avec succès
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
 *                   example: "Document de l'intervention récupéré avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       404:
 *         description: Intervention ou document non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/documents/:documentId", interventionsController.getInterventionDocumentById);

/**
 * @swagger
 * /technique/interventions/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'une intervention
 *     description: Supprime un document associé à une intervention spécifique
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du document à supprimer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
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
 *                   example: Document supprimé avec succès
 *       404:
 *         description: Intervention ou document non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/documents/:documentId", interventionsController.deleteDocument);

/**
 * @swagger
 * /technique/interventions/partenaire/{partenaireId}:
 *   get:
 *     summary: Récupère toutes les interventions d'un partenaire
 *     description: Retourne la liste complète des interventions associées à un partenaire spécifique, incluant les détails du partenaire, du contrat, du superviseur et des employés
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: partenaireId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Liste des interventions récupérée avec succès
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
 *                   example: Interventions du partenaire récupérées avec succès
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       intervention:
 *                         $ref: '#/components/schemas/Intervention'
 *                       partenaire:
 *                         type: object
 *                         properties:
 *                           id_partenaire:
 *                             type: integer
 *                           nom_partenaire:
 *                             type: string
 *                           telephone_partenaire:
 *                             type: string
 *                           email_partenaire:
 *                             type: string
 *                           specialite:
 *                             type: string
 *                           localisation:
 *                             type: string
 *                           type_partenaire:
 *                             type: string
 *                           statut:
 *                             type: string
 *                       superviseur:
 *                         type: object
 *                         properties:
 *                           id_employes:
 *                             type: integer
 *                           nom_employes:
 *                             type: string
 *                           prenom_employes:
 *                             type: string
 *                           email_employes:
 *                             type: string
 *                           contact_employes:
 *                             type: string
 *                       contrat:
 *                         type: object
 *                         properties:
 *                           id_contrat:
 *                             type: integer
 *                           nom_contrat:
 *                             type: string
 *                           duree_contrat:
 *                             type: string
 *                           date_debut:
 *                             type: string
 *                           date_fin:
 *                             type: string
 *                           reference:
 *                             type: string
 *                           type_de_contrat:
 *                             type: string
 *                           statut:
 *                             type: string
 *                       employes:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Employe'
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/partenaire/:partenaireId", interventionsController.getInterventionsByPartenaire);

/**
 * @swagger
 * /technique/interventions/superviseur/{superviseurId}:
 *   get:
 *     summary: Récupère toutes les interventions d'un superviseur
 *     description: Retourne la liste des interventions supervisées par un employé spécifique
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: superviseurId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du superviseur (employé)
 *     responses:
 *       200:
 *         description: Liste des interventions récupérée avec succès
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
 *                   example: Interventions du superviseur récupérées avec succès
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Intervention'
 *       404:
 *         description: Superviseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/superviseur/:superviseurId", interventionsController.getInterventionsBySuperviseur);

/**
 * @swagger
 * /technique/interventions/documents:
 *   get:
 *     summary: Récupérer tous les documents des interventions
 *     description: Retourne la liste de tous les documents associés à toutes les interventions.
 *     tags: [Interventions]
 *     responses:
 *       200:
 *         description: Liste de tous les documents des interventions récupérée avec succès
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
 *                     $ref: '#/components/schemas/Document'
 *       500:
 *         description: Erreur serveur
 */
router.get("/documents", interventionsController.getAllInterventionDocuments);

module.exports = router;