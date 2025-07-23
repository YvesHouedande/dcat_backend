const path = require('path');
const fs = require('fs');
const contratcontroller = require('../controllers/contrat.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');

const UPLOAD_PATHS = {
  CONTRATS: 'media/documents/administration/contrat'
};

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



router.get("/", contratcontroller.getAllContrats);

router.post("/", contratcontroller.createContrat);
router.post("/:id/doc",
  prepareUploadPath,
  upload.single("document"),
  contratcontroller.addDocumentToContrat
);

router.get("/:id", contratcontroller.getContratById);
router.get("/type/:type", contratcontroller.getContratByType);
router.get("/partenaire/:id", contratcontroller.getContratsByPartenaire);

router.put("/:id", contratcontroller.updateContrat);

router.delete("/:id", contratcontroller.deleteContrat);
router.delete("/:id/docContrat/:docId", contratcontroller.deleteDocumentById);

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
 *     responses:
 *       200:
 *         description: Contrat trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_contrat:
 *                   type: integer
 *                 nom_contrat:
 *                   type: string
 *                 date_debut:
 *                   type: string
 *                   format: date
 *                 date_fin:
 *                   type: string
 *                   format: date
 *                 reference:
 *                   type: string
 *                 duree_contrat:
 *                   type: string
 *                 type_de_contrat:
 *                   type: string
 *                 statut:
 *                   type: string
 *                 id_partenaire:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
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
 *                        type: string
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
 *                        type: string
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
 * /administration/contrats:
 *   post:
 *     summary: Créer un nouveau contrat
 *     tags: [Contrats]
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom_contrat:
 *                 type: string
 *               duree_contrat:
 *                type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               reference:
 *                 type: string
 *               type_de_contrat:
 *                 type: string
 *               statut:
 *                 type: string
 *                 default: actif
 *               id_partenaire:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}/doc:
 *   post:
 *     summary: Ajouter un document à un contrat
 *     tags: [Contrats]
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
 *               classification_document:
 *                 type: string
 *               date_document:
 *                type: string
 *               etat_document:
 *                 type: string
 *                 default: actif
 *               id_nature_document:
 *                 type: integer
 *               id_contrat:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   put:
 *     summary: Modifier un contrat
 *     tags: [Contrats]
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
 *               nom_contrat:
 *                 type: string
 *               duree_contrat:
 *                type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               reference:
 *                 type: string
 *               type_de_contrat:
 *                 type: string
 *               statut:
 *                 type: string
 *               id_partenaire:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   delete:
 *     summary: Supprimer un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */

/**
 * @swagger
 * /administration/contrats/docContrat/{docId}:
 *   delete:
 *     summary: Supprimer un document lié à un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: integer
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
 *         id_nature_document:
 *           type: integer
 *           nullable: true
 *         id_contrat:
 *           type: integer
 *         id_employes:
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
 *          type: string
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
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 */
