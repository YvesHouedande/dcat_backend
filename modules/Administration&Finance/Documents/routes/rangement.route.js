/**
 * @swagger
 * tags:
 *   name: Dossier
 *   description: API pour la gestion des dossiers et documents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dossier:
 *       type: object
 *       required:
 *         - libelle_dossier
 *         - type_dossier
 *       properties:
 *         id_dossier:
 *           type: integer
 *           description: Identifiant unique du dossier
 *         libelle_dossier:
 *           type: string
 *           maxLength: 100
 *           description: Nom du dossier
 *         type_dossier:
 *           type: string
 *           maxLength: 50
 *           description: Type du dossier
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de modification
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *           description: Identifiant unique du document
 *         libelle_document:
 *           type: string
 *           maxLength: 100
 *           description: Nom du document
 *         date_document:
 *           type: string
 *           maxLength: 50
 *           description: Date du document
 *         lien_document:
 *           type: string
 *           maxLength: 255
 *           description: Lien vers le document
 *         etat_document:
 *           type: string
 *           maxLength: 50
 *           enum: [Actif, Archive]
 *           default: Actif
 *           description: État du document
 *         id_dossier:
 *           type: integer
 *           description: Identifiant du dossier parent
 *         id_livrable:
 *           type: integer
 *           nullable: true
 *           description: Identifiant du livrable associé
 *         id_projet:
 *           type: integer
 *           nullable: true
 *           description: Identifiant du projet associé
 *         id_demandes:
 *           type: integer
 *           nullable: true
 *           description: Identifiant de la demande associée
 *         id_contrat:
 *           type: integer
 *           nullable: true
 *           description: Identifiant du contrat associé
 *         id_employes:
 *           type: integer
 *           nullable: true
 *           description: Identifiant de l'employé associé
 *         id_intervention:
 *           type: integer
 *           nullable: true
 *           description: Identifiant de l'intervention associée
 *         id_nature_document:
 *           type: integer
 *           nullable: true
 *           description: Identifiant de la nature du document
 */

/**
 * @swagger
 * /administration/dossier/create:
 *   post:
 *     summary: Créer un nouveau dossier
 *     description: Création d'un nouveau dossier. Si un dossier avec le même libellé et type existe déjà, un message d'erreur est retourné.
 *     tags: [Dossier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelle_dossier
 *               - type_dossier
 *             properties:
 *               libelle_dossier:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nom du dossier
 *               type_dossier:
 *                 type: string
 *                 maxLength: 50
 *                 description: Type du dossier
 *     responses:
 *       201:
 *         description: Dossier créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       409:
 *         description: Un dossier avec ce libellé et ce type existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Un dossier avec ce libellé et ce type existe déjà.
 *                 code:
 *                   type: string
 *                   example: DOSSIER_EXISTS
 *                 details:
 *                   type: object
 *                   properties:
 *                     libelle:
 *                       type: string
 *                       example: MonDossier
 *                     type:
 *                       type: string
 *                       example: Contrat
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier:
 *   get:
 *     summary: Récupérer tous les dossiers
 *     description: Liste paginée de tous les dossiers
 *     tags: [Dossier]
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
 *         description: Liste paginée des dossiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dossier'
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
 *                 - id_dossier: 1
 *                   libelle_dossier: "Dossier A"
 *                   type_dossier: "Contrat"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *                 - id_dossier: 2
 *                   libelle_dossier: "Dossier B"
 *                   type_dossier: "Facture"
 *                   created_at: "2024-03-02T12:00:00Z"
 *                   updated_at: "2024-03-02T12:00:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 42
 *                 totalPages: 5
 *       400:
 *         description: Paramètres de pagination invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/{id}:
 *   get:
 *     summary: Récupérer un dossier par ID
 *     description: Détails d'un dossier spécifique
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dossier trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/{id}:
 *   put:
 *     summary: Mettre à jour un dossier
 *     description: Modification des informations d'un dossier
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle_dossier:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nouveau nom du dossier
 *               type_dossier:
 *                 type: string
 *                 maxLength: 50
 *                 description: Nouveau type du dossier
 *     responses:
 *       200:
 *         description: Dossier mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/{id}:
 *   delete:
 *     summary: Supprimer un dossier
 *     description: Suppression d'un dossier et ses documents
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dossier supprimé
 *       404:
 *         description: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/document/{id}:
 *   delete:
 *     summary: Supprimer un document
 *     description: Suppression d'un document spécifique
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du document
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document supprimé
 *       404:
 *         description: Document non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/{id_dossier}/document/add:
 *   post:
 *     summary: Ajouter un document à un dossier spécifique
 *     description: Création d'un nouveau document associé à un dossier existant identifié par son ID avec upload de fichier
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id_dossier
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
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
 *                 description: Fichier à uploader
 *               libelle_document:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nom du document
 *               date_document:
 *                 type: string
 *                 format: date
 *                 description: Date du document (optionnel, par défaut date actuelle)
 *               etat_document:
 *                 type: string
 *                 maxLength: 50
 *                 enum: [Actif, Archive]
 *                 default: Actif
 *                 description: État du document
 *               id_livrable:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant du livrable associé
 *               id_projet:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant du projet associé
 *               id_demandes:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant de la demande associée
 *               id_contrat:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant du contrat associé
 *               id_employes:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant de l'employé associé
 *               id_intervention:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant de l'intervention associée
 *               id_nature_document:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant de la nature du document
 *     responses:
 *       201:
 *         description: Document créé avec succès
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
 *                   example: Document ajouté au dossier avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     document:
 *                       $ref: '#/components/schemas/Document'
 *                     details:
 *                       type: object
 *                       properties:
 *                         dateCreation:
 *                           type: string
 *                           format: date-time
 *                         chemin:
 *                           type: string
 *       400:
 *         description: Aucun fichier téléchargé ou ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Aucun fichier n'a été téléchargé
 *       404:
 *         description: Dossier non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/type/{type}/libelle/{libelle}:
 *   get:
 *     summary: Récupérer les dossiers par type et libellé optionnel
 *     description: Retourne les dossiers du type spécifié. Si le libellé est fourni, recherche les dossiers dont le libellé contient la valeur recherchée (recherche partielle insensible à la casse). Si le libellé n'est pas fourni ou est vide, retourne tous les dossiers du type.
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type du dossier
 *         schema:
 *           type: string
 *       - in: path
 *         name: libelle
 *         required: false
 *         description: Libellé du dossier (recherche partielle - optionnel)
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10, maximum 100)
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Liste paginée des dossiers trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dossier'
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
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *             example:
 *               data:
 *                 - id_dossier: 1
 *                   libelle_dossier: "MonDossier"
 *                   type_dossier: "Contrat"
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *                 - id_dossier: 2
 *                   libelle_dossier: "AutreDossier"
 *                   type_dossier: "Contrat"
 *                   created_at: "2024-03-02T12:00:00Z"
 *                   updated_at: "2024-03-02T12:00:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *       400:
 *         description: Paramètres de pagination invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/{id}/documents/libelle/{libelle}:
 *   get:
 *     summary: Récupérer les documents d'un dossier par id et libellé optionnel
 *     description: Retourne les documents du dossier spécifié. Si le libellé est fourni, recherche les documents dont le libellé contient la valeur recherchée (recherche partielle insensible à la casse). Si le libellé n'est pas fourni ou est vide, retourne tous les documents du dossier.
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du dossier
 *         schema:
 *           type: integer
 *       - in: path
 *         name: libelle
 *         required: false
 *         description: Libellé du document (recherche partielle - optionnel)
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10, maximum 100)
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Dossier et documents paginés trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dossier:
 *                   $ref: '#/components/schemas/Dossier'
 *                 documents:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Document'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 15
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *             example:
 *               dossier:
 *                 id_dossier: 1
 *                 libelle_dossier: "MonDossier"
 *                 type_dossier: "Contrat"
 *                 created_at: "2024-03-01T12:00:00Z"
 *                 updated_at: "2024-03-01T12:00:00Z"
 *               documents:
 *                 data:
 *                   - id_documents: 1
 *                     libelle_document: "Contrat 2024"
 *                     date_document: "2024-03-01"
 *                     lien_document: "media/documents/contrat2024.pdf"
 *                     etat_document: "Actif"
 *                     id_dossier: 1
 *                   - id_documents: 2
 *                     libelle_document: "Facture Janvier"
 *                     date_document: "2024-01-15"
 *                     lien_document: "media/documents/facture_janvier.pdf"
 *                     etat_document: "Actif"
 *                     id_dossier: 1
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 15
 *                   totalPages: 2
 *       400:
 *         description: Paramètres de pagination invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100
 *       404:
 *         description: Dossier non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dossier non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/dossier/documents/intervention:
 *   get:
 *     summary: Récupérer tous les documents d'intervention
 *     description: Liste paginée de tous les documents où id_intervention est non null
 *     tags: [Dossier]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de la page (par défaut 1)
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre d'éléments par page (par défaut 10, maximum 100)
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Liste paginée des documents d'intervention
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
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
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *             example:
 *               data:
 *                 - id_documents: 1
 *                   libelle_document: "Rapport d'intervention 001"
 *                   date_document: "2024-03-01"
 *                   lien_document: "media/documents/intervention001.pdf"
 *                   etat_document: "Actif"
 *                   id_dossier: 1
 *                   id_intervention: 1
 *                 - id_documents: 2
 *                   libelle_document: "Photos intervention 002"
 *                   date_document: "2024-03-02"
 *                   lien_document: "media/documents/photos_intervention002.zip"
 *                   etat_document: "Actif"
 *                   id_dossier: 2
 *                   id_intervention: 2
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *       400:
 *         description: Paramètres de pagination invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100
 *       500:
 *         description: Erreur serveur
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../../../utils/middleware/uploadMiddleware');
const rangementController = require('../controllers/rangement.controller');
const { protect } = require('../../../../core/auth/middleware');

const UPLOAD_PATHS = {
  DOSSIERS: 'media/documents/administration/dossiers'
};

router.post('/create',rangementController.createDossier);
router.post('/document/add', rangementController.createDocument);
router.post('/:id_dossier/document/add',
  (req, res, next) => {
    try {
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.DOSSIERS);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      req.uploadPath = uploadPath;
      next();
    } catch (err) {
      next(err);
    }
  },
  upload.single('document'),
  rangementController.addDocumentToDossier
);
router.get('/', rangementController.getDossiers);
router.get('/:id', rangementController.getDossierById);
router.put('/:id', rangementController.updateDossier);
router.delete('/:id', rangementController.deleteDossier);
router.delete('/document/:id', rangementController.deleteDocumentById);
router.get('/type/:type/libelle/:libelle?', rangementController.getDossiersByTypeAndLibelle);
router.get('/:id/documents/libelle/:libelle?', rangementController.getDocumentsByDossierIdAndLibelle);
router.get('/documents/intervention', rangementController.getDocumentsIntervention);

module.exports = router;
