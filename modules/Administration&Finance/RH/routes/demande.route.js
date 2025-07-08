/**
 * @swagger
 * tags:
 *   - name: Demandes
 *     description: Gestion des demandes RH (congés, absences, etc.)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Demande:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_employes:
 *           type: integer
 *         type_demande:
 *           type: string
 *         motif:
 *           type: string
 *         date_absence:
 *           type: string
 *           format: date
 *         date_retour:
 *           type: string
 *           format: date
 *         duree:
 *           type: string
 *         status:
 *           type: string
 *         libelle_document:
 *           type: string
 *         classification_document:
 *           type: string
 *         document:
 *           type: string
 *           format: binary
 *         heure_debut:
 *           type: string
 *         heure_fin:
 *           type: string
 *       required:
 *         - id_employes
 *         - type_demande
 *         - motif
 *         - date_absence
 *         - date_retour
 *         - duree
 *         - status
 *         - libelle_document
 *         - classification_document
 *
 *   requestBodies:
 *     DemandeCreation:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Demande'
 *     DemandeUpdate:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Demande'
 */

/**
 * @swagger
 * /administration/demandes:
 *   post:
 *     summary: Créer une nouvelle demande RH (avec ou sans document)
 *     tags: [Demandes]
 *     requestBody:
 *       $ref: '#/components/requestBodies/DemandeCreation'
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demande'
 *       400:
 *         description: Erreur de validation ou données manquantes
 *   get:
 *     summary: Lister toutes les demandes RH
 *     tags: [Demandes]
 *     responses:
 *       200:
 *         description: Liste de toutes les demandes RH
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Demande'
 */

/**
 * @swagger
 * /administration/demandes/type/{type}:
 *   get:
 *     summary: Lister les demandes RH par type
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: maladie
 *     responses:
 *       200:
 *         description: Liste des demandes RH filtrées par type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Demande'
 *       404:
 *         description: Aucun résultat pour ce type
 */

/**
 * @swagger
 * /administration/demandes/employe/{id_employe}:
 *   get:
 *     summary: Lister les demandes RH d'un employé
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id_employe
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des demandes RH de l'employé
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Demande'
 *       404:
 *         description: Aucun résultat pour cet employé
 */

/**
 * @swagger
 * /administration/demandes/{id}:
 *   get:
 *     summary: Obtenir une demande RH par ID (avec document associé)
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la demande RH (incluant le document associé)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_demandes:
 *                   type: integer
 *                 date_absence:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *                 date_retour:
 *                   type: string
 *                   format: date
 *                 motif:
 *                   type: string
 *                 type_demande:
 *                   type: string
 *                 duree:
 *                   type: integer
 *                   nullable: true
 *                 heure_debut:
 *                   type: string
 *                   nullable: true
 *                 heure_fin:
 *                   type: string
 *                   nullable: true
 *                 id_employes:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 document:
 *                   type: object
 *                   properties:
 *                     id_documents:
 *                       type: integer
 *                     libelle_document:
 *                       type: string
 *                     classification_document:
 *                       type: string
 *                     date_document:
 *                       type: string
 *                       format: date
 *                     lien_document:
 *                       type: string
 *                     etat_document:
 *                       type: string
 *                     id_livrable:
 *                       type: integer
 *                       nullable: true
 *                     id_projet:
 *                       type: integer
 *                       nullable: true
 *                     id_demandes:
 *                       type: integer
 *                     id_contrat:
 *                       type: integer
 *                       nullable: true
 *                     id_employes:
 *                       type: integer
 *                     id_intervention:
 *                       type: integer
 *                       nullable: true
 *                     id_nature_document:
 *                       type: integer
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Demande RH non trouvée
 *
 *   put:
 *     summary: Modifier une demande RH existante
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/requestBodies/DemandeUpdate'
 *     responses:
 *       200:
 *         description: Demande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demande'
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer une demande RH
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Suppression réussie
 *       404:
 *         description: Demande non trouvée
 */

/**
 * @swagger
 * /administration/demandes/docdemande/{id_document}:
 *   delete:
 *     summary: Supprimer un document associé à une demande RH
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id_document
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 *       404:
 *         description: Document non trouvé
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../../../utils/middleware/uploadMiddleware');
const demandeController = require('../controllers/demande.controller');

const UPLOAD_PATHS = {
  DEMANDES: 'media/documents/administration/RH/demandes'
};

// Créer une nouvelle demande RH avec fichier
router.post(
  '/',
  (req, res, next) => {
    try {
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.DEMANDES);
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
  demandeController.createDemande
);

// Récupérer toutes les demandes RH
router.get('/', demandeController.getAllDemandes);

// Filtrer par type
router.get('/type/:type', demandeController.getDemandeByType);

// Filtrer par employé
router.get('/employe/:id_employe', demandeController.getDemandeByEmploye);

// Récupérer une demande par ID
router.get('/:id', demandeController.getDemandeById);

// Modifier une demande
router.put('/:id', demandeController.updateDemande);

// Supprimer une demande
router.delete('/:id', demandeController.deleteDemande);

router.delete('/docdemande/:id_document', demandeController.deleteDocumentById);

module.exports = router;
