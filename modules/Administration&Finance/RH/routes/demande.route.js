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
 * /administration/demandes/{type}:
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
 *     summary: Obtenir une demande RH par ID
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la demande RH
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Demande'
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
router.get('/:type', demandeController.getDemandeByType);

// Filtrer par employé
router.get('/employe/:id_employe', demandeController.getDemandeByEmploye);

// Récupérer une demande par ID
router.get('/:id', demandeController.getDemandeById);

// Modifier une demande
router.put('/:id', demandeController.updateDemande);

// Supprimer une demande
router.delete('/:id', demandeController.deleteDemande);

module.exports = router;
