const path = require('path');
const fs = require('fs');
const contratcontroller = require('../controllers/contrat.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');

const UPLOAD_PATHS = {
  CONTRATS: 'media/documents/administration/contrat'
};

// Middleware pour créer le dossier d'upload si nécessaire
const prepareUploadPath = (req, res, next) => {
  try {
    const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.CONTRATS);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    req.uploadPath = uploadPath;
    next();
  } catch (error) {
    next(error);
  }
};

router.post("/",
  prepareUploadPath,
  upload.single("document"),
  contratcontroller.createContrat
);

router.get("/", contratcontroller.getAllContrats);
router.get("/:id", contratcontroller.getContratById);
router.get("/type/:type", contratcontroller.getContratByType);
router.get("/partenaire/:id", contratcontroller.getContratsByPartenaire);
router.put("/:id", contratcontroller.updateContrat);
router.delete("/:id", contratcontroller.deleteContrat);
router.delete("/docContrat/:id", contratcontroller.deleteDocumentById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Contrats
 *     description: Gestion des contrats
 */

/**
 * @swagger
 * /administration/contrats:
 *   post:
 *     summary: Créer un contrat
 *     tags: [Contrats]
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
 *               libelle_contrat:
 *                 type: string
 *               classification_contrat:
 *                 type: string
 *               id_employes:
 *                 type: integer
 *               type_contrat:
 *                 type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contrat créé
 *       400:
 *         description: Erreur de validation
 *   get:
 *     summary: Lister tous les contrats
 *     tags: [Contrats]
 *     responses:
 *       200:
 *         description: Liste des contrats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_contrat:
 *                         type: integer
 *                       nom_contrat:
 *                         type: string
 *                         nullable: true
 *                       duree_contrat:
 *                         type: string
 *                         nullable: true
 *                       date_debut:
 *                         type: string
 *                         format: date
 *                       date_fin:
 *                         type: string
 *                         format: date
 *                       reference:
 *                         type: string
 *                         nullable: true
 *                       type_de_contrat:
 *                         type: string
 *                         nullable: true
 *                       statut:
 *                         type: string
 *                         nullable: true
 *                       id_partenaire:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Aucun contrat trouvé
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   get:
 *     summary: Obtenir un contrat par ID
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du contrat
 *     responses:
 *       200:
 *         description: Contrat trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contrat'
 *       404:
 *         description: Contrat non trouvé
 *   put:
 *     summary: Modifier un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du contrat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle_contrat:
 *                 type: string
 *               classification_contrat:
 *                 type: string
 *               id_employes:
 *                 type: integer
 *               type_contrat:
 *                 type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Contrat mis à jour
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Contrat non trouvé
 *   delete:
 *     summary: Supprimer un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du contrat
 *     responses:
 *       200:
 *         description: Contrat supprimé
 *       404:
 *         description: Contrat non trouvé
 */

/**
 * @swagger
 * /administration/contrats/type/{type}:
 *   get:
 *     summary: Obtenir les contrats par type
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type de contrat
 *     responses:
 *       200:
 *         description: Liste des contrats du type spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_contrat:
 *                         type: integer
 *                       nom_contrat:
 *                         type: string
 *                         nullable: true
 *                       duree_contrat:
 *                         type: string
 *                         nullable: true
 *                       date_debut:
 *                         type: string
 *                         format: date
 *                       date_fin:
 *                         type: string
 *                         format: date
 *                       reference:
 *                         type: string
 *                         nullable: true
 *                       type_de_contrat:
 *                         type: string
 *                         nullable: true
 *                       statut:
 *                         type: string
 *                         nullable: true
 *                       id_partenaire:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Aucun contrat trouvé pour ce type
 */

/**
 * @swagger
 * /administration/contrats/partenaire/{id}:
 *   get:
 *     summary: Obtenir les contrats par partenaire
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Liste des contrats pour le partenaire spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_contrat:
 *                         type: integer
 *                       nom_contrat:
 *                         type: string
 *                         nullable: true
 *                       duree_contrat:
 *                         type: string
 *                         nullable: true
 *                       date_debut:
 *                         type: string
 *                         format: date
 *                       date_fin:
 *                         type: string
 *                         format: date
 *                       reference:
 *                         type: string
 *                         nullable: true
 *                       type_de_contrat:
 *                         type: string
 *                         nullable: true
 *                       statut:
 *                         type: string
 *                         nullable: true
 *                       id_partenaire:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Aucun contrat trouvé pour ce partenaire
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *         libelle_document:
 *           type: string
 *         classification_document:
 *           type: string
 *         date_document:
 *           type: string
 *           format: date
 *         lien_document:
 *           type: string
 *         etat_document:
 *           type: string
 *         id_livrable:
 *           type: integer
 *           nullable: true
 *         id_projet:
 *           type: integer
 *           nullable: true
 *         id_demandes:
 *           type: integer
 *           nullable: true
 *         id_contrat:
 *           type: integer
 *         id_employes:
 *           type: integer
 *           nullable: true
 *         id_intervention:
 *           type: integer
 *           nullable: true
 *         id_nature_document:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Contrat:
 *       type: object
 *       properties:
 *         id_contrat:
 *           type: integer
 *         nom_contrat:
 *           type: string
 *           nullable: true
 *         duree_contrat:
 *           type: string
 *           nullable: true
 *         date_debut:
 *           type: string
 *           format: date
 *         date_fin:
 *           type: string
 *           format: date
 *         reference:
 *           type: string
 *           nullable: true
 *         type_de_contrat:
 *           type: string
 *           nullable: true
 *         statut:
 *           type: string
 *           nullable: true
 *         id_partenaire:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         documents:
 *           $ref: '#/components/schemas/Document'
 */

/**
 * @swagger
 * /administration/contrats/docContrat/{id}:
 *   delete:
 *     summary: Supprimer un document lié à un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 message:
 *                   type: string
 *       404:
 *         description: Document non trouvé
 *       500:
 *         description: Erreur serveur
 */
