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

// Routes CRUD de base
/**
 * @swagger
 * /technique/interventions:
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
 * /technique/interventions/{id}:
 *   get:
 *     summary: Récupère une intervention par son ID
 *     description: Renvoie les détails d'une intervention spécifique
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
 *     description: Ajoute une nouvelle intervention dans le système
 *     tags: [Interventions]
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
 *               type_intervention:
 *                 type: string
 *               lieu:
 *                 type: string
 *               rapport_intervention:
 *                 type: string
 *               statut_intervention:
 *                 type: string
 *     responses:
 *       201:
 *         description: Intervention créée avec succès
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
 *         description: ID de l'intervention
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
 *               type_intervention:
 *                 type: string
 *               lieu:
 *                 type: string
 *               rapport_intervention:
 *                 type: string
 *               statut_intervention:
 *                 type: string
 *     responses:
 *       200:
 *         description: Intervention mise à jour avec succès
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", interventionsController.updateIntervention);

/**
 * @swagger
 * /technique/interventions/{id}:
 *   delete:
 *     summary: Supprime une intervention
 *     description: Supprime définitivement une intervention du système
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
 *         description: Intervention supprimée avec succès
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", interventionsController.deleteIntervention);

// Route pour les documents avec gestion des erreurs d'upload
/**
 * @swagger
 * /technique/interventions/{id}/documents:
 *   post:
 *     summary: Ajoute un document à une intervention
 *     description: Télécharge et associe un document à une intervention
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
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à télécharger
 *               libelle_document:
 *                 type: string
 *                 description: Nom du document
 *     responses:
 *       201:
 *         description: Document ajouté avec succès
 *       400:
 *         description: Erreur lors du téléchargement
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

// Routes pour la gestion des employés
/**
 * @swagger
 * /technique/interventions/{id}/employes:
 *   post:
 *     summary: Ajoute un employé à une intervention
 *     description: Assigne un employé à une intervention spécifique
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
 *             properties:
 *               id_employes:
 *                 type: integer
 *                 description: ID de l'employé à assigner
 *     responses:
 *       201:
 *         description: Employé assigné avec succès
 *       400:
 *         description: Données invalides
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
 *     description: Désassigne un employé d'une intervention spécifique
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
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé retiré avec succès
 *       404:
 *         description: Association intervention-employé non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/employes/:employeId", interventionsController.removeEmployeFromIntervention);

/**
 * @swagger
 * /technique/interventions/{id}/employes:
 *   get:
 *     summary: Récupère les employés d'une intervention
 *     description: Liste tous les employés assignés à une intervention spécifique
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
 *                     type: object
 *                     properties:
 *                       id_employes:
 *                         type: integer
 *                       nom_employes:
 *                         type: string
 *                       prenom_employes:
 *                         type: string
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/employes", interventionsController.getInterventionEmployes);


// Routes pour la gestion des documents
/**
 * @swagger
 * /technique/interventions/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'une intervention
 *     description: Liste tous les documents associés à une intervention spécifique
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
 *                     type: object
 *                     properties:
 *                       id_documents:
 *                         type: integer
 *                       libelle_document:
 *                         type: string
 *                       lien_document:
 *                         type: string
 *       404:
 *         description: Intervention non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/documents", interventionsController.getInterventionDocuments);

/**
 * @swagger
 * /technique/interventions/{id}/documents/{documentId}:
 *   delete:
 *     summary: Supprime un document d'une intervention
 *     description: Supprime définitivement un document associé à une intervention
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
 *         description: ID du document
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 *       404:
 *         description: Document ou intervention non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id/documents/:documentId", interventionsController.deleteDocument);


module.exports = router;
