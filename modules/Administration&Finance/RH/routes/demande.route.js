const demandeController = require('../controllers/demande.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATHS = {
  DEMANDES: 'media/documents/administration/RH/demandes'
};

// Route POST - Créer une demande avec fichier
router.post(
  '/',
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.DEMANDES);

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
  upload.single("document"),
  demandeController.createDemande
);

// Routes GET, PUT, DELETE
router.get('/', demandeController.getAllDemandes);
router.get('/:type', demandeController.getDemandeByType);
router.put('/:id', demandeController.updateDemande);
router.delete('/:id', demandeController.deleteDemande);

/**
 * @swagger
 * tags:
 *   - name: Demandes
 *     description: Gestion des demandes
 */

/**
 * @swagger
 * /administration/demandes:
 *   post:
 *     summary: Créer une demande
 *     tags: [Demandes]
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
 *               classification_document:
 *                 type: string
 *               id_employes:
 *                 type: integer
 *               type_demande:
 *                 type: string
 *               motif:
 *                 type: string
 *               date_absence:
 *                 type: string
 *                 format: date
 *               date_retour:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: string
 *               heure_debut:
 *                 type: string
 *               heure_fin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Demande créée
 *       400:
 *         description: Erreur de validation
 *   get:
 *     summary: Lister toutes les demandes
 *     tags: [Demandes]
 *     responses:
 *       200:
 *         description: Liste des demandes
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
 *         description: Type de demande
 *     responses:
 *       200:
 *         description: Liste filtrée
 *       404:
 *         description: Non trouvé
 */

/**
 * @swagger
 * /administration/demandes/{id}:
 *   put:
 *     summary: Modifier une demande RH
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_employes:
 *                 type: integer
 *               type_demande:
 *                 type: string
 *               motif:
 *                 type: string
 *               date_absence:
 *                 type: string
 *                 format: date
 *               date_retour:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: string
 *               heure_debut:
 *                 type: string
 *               heure_fin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mise à jour réussie de la demande RH
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes)
 *       404:
 *         description: Demande RH non trouvée
 *       500:
 *         description: Erreur serveur interne
 *   delete:
 *     summary: Supprimer une demande RH
 *     tags: [Demandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande
 *     responses:
 *       200:
 *         description: Supprimée
 *       404:
 *         description: Non trouvé
 */

module.exports = router;