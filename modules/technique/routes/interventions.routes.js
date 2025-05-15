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
 * /api/technique/interventions:
 *   get:
 *     summary: Liste toutes les interventions
 *     description: Récupère la liste complète des interventions techniques
 *     tags: [Interventions]
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
 *                 interventions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Intervention'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", interventionsController.getAllInterventions);

/**
 * @swagger
 * /api/technique/interventions/{id}:
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
 * /api/technique/interventions:
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
 * /api/technique/interventions/{id}:
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
 * /api/technique/interventions/{id}:
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
 * /api/technique/interventions/{id}/documents:
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
 * /api/technique/interventions/{id}/employes:
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
 * /api/technique/interventions/{id}/employes/{employeId}:
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
 * /api/technique/interventions/{id}/employes:
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
 * /api/technique/interventions/{id}/documents:
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
 * /api/technique/interventions/{id}/documents/{documentId}:
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


module.exports = router;
