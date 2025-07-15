const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../../../utils/middleware/uploadMiddleware');
const demandeController = require('../controllers/demande.controller');

const UPLOAD_PATHS = {
  DEMANDES: 'media/documents/administration/RH/demandes'
};

router.post('/', demandeController.createDemande);
router.post('/:id/documents',
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
  demandeController.addDocumentToDemande
);
router.get('/', demandeController.getAllDemandes);
router.get('/type/:type', demandeController.getDemandeByType);
router.get('/employe/:id_employe', demandeController.getDemandeByEmploye);
router.get('/:id', demandeController.getDemandeById);
router.put('/:id', demandeController.updateDemande);
router.delete('/:id', demandeController.deleteDemande);
router.delete('/:id/docdemande/:docId', demandeController.deleteDocumentById);

module.exports = router;


/**
 * @swagger
 * tags:
 *   - name: Demandes RH
 *     description: Gestion des demandes RH (congés, absences, etc.)
 */

/**
 * @swagger
 * /administration/demandes:
 *   post:
 *     summary: Créer une nouvelle demande RH
 *     tags:
 *       - Demandes RH
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motif
 *               - date_absence
 *               - type_demande
 *               - id_employes
 *             properties:
 *               motif:
 *                 type: string
 *               date_absence:
 *                 type: string
 *                 format: date
 *               heure_debut:
 *                 type: string
 *               heure_fin:
 *                 type: string
 *               date_retour:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: string
 *               type_demande:
 *                 type: string
 *               status:
 *                 type: string
 *               id_employes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/{id}:
 *   put:
 *     summary: Mettre à jour une demande RH
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motif:
 *                 type: string
 *               date_absence:
 *                 type: string
 *                 format: date
 *               heure_debut:
 *                 type: string
 *               heure_fin:
 *                 type: string
 *               date_retour:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: string
 *               type_demande:
 *                 type: string
 *               status:
 *                 type: string
 *               id_employes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Demande mise à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/{id}/documents:
 *   post:
 *     summary: Ajouter un document à une demande RH
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               libelle_document:
 *                 type: string
 *               date_document:
 *                type: string
 *               classification_document:
 *                 type: string
 *               etat_document:
 *                 type: string
 *               id_nature_document:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Document ajouté avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes:
 *   get:
 *     summary: Récupérer toutes les demandes RH
 *     tags:
 *       - Demandes RH
 *     responses:
 *       200:
 *         description: Liste des demandes RH
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DemandeRH'
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /administration/demandes/{id}:
 *   get:
 *     summary: Récupérer une demande RH par son identifiant
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la demande RH
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemandeRH'
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/type/{type}:
 *   get:
 *     summary: Récupérer les demandes RH par type
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des demandes RH par type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DemandeRH'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/employe/{id_employe}:
 *   get:
 *     summary: Récupérer les demandes RH par employé
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - name: id_employe
 *         in: path
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
 *                 $ref: '#/components/schemas/DemandeRH'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/{id}:
 *   delete:
 *     summary: Supprimer une demande RH
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Demande supprimée avec succès
 *       404:
 *         description: Demande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/demandes/{id}/docdemande/{docId}:
 *   delete:
 *     summary: Supprimer un document d'une demande RH
 *     tags:
 *       - Demandes RH
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: docId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 *       404:
 *         description: Document ou demande non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DemandeRH:
 *       type: object
 *       properties:
 *         id_demandes:
 *           type: integer
 *         motif:
 *           type: string
 *         date_absence:
 *           type: string
 *           format: date
 *         heure_debut:
 *           type: string
 *           nullable: true
 *         heure_fin:
 *           type: string
 *           nullable: true
 *         date_retour:
 *           type: string
 *           format: date
 *           nullable: true
 *         duree:
 *           type: string
 *           nullable: true
 *         type_demande:
 *           type: string
 *         status:
 *           type: string
 *         id_employes:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */
