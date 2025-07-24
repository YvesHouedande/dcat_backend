const doc_FCController = require('../controllers/doc_Fc.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATHS = {
  INTERVENTIONS: 'media/documents/administration/finance&compta'
};

// Middleware pour créer le dossier d'upload si nécessaire
const prepareUploadPath = (req, res, next) => {
  try {
    // Définir et créer le chemin avant l'upload
    const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.INTERVENTIONS);
    

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    req.uploadPath = uploadPath;
    next();
  } catch (error) {
    next(error);
  }
};

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
 *         lien_document:
 *           type: string
 *         etat_document:
 *           type: string
 *         id_employes:
 *           type: integer
 *         id_nature_document:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /administration/documents/ajouter:
 *   post:
 *     summary: Ajouter un nouveau document Finance/Compta
 *     tags:
 *       - Documents Finance/Compta
 *     consumes:
 *       - multipart/form-data
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
 *     responses:
 *       200:
 *         description: Document ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 */
router.post('/ajouter',
  prepareUploadPath,
  upload.single("document"),
  doc_FCController.addDocument
  
);

/**
 * @swagger
 * /administration/documents:
 *   get:
 *     summary: Récupérer tous les documents Finance/Compta
 *     tags:
 *       - Documents Finance/Compta
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
 *         description: Liste paginée des documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 42
 *               data:
 *                 - id_documents: 1
 *                   libelle_document: "Facture Janvier"
 *                   classification_document: "finance"
 *                   lien_document: "media/documents/finance/facture_janvier.pdf"
 *                   etat_document: "actif"
 *                   id_employes: 2
 *                   id_nature_document: 1
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 */
router.get('/', doc_FCController.getAllDocuments);

/**
 * @swagger
 * /administration/documents/nature/{id_nature_document}:
 *   get:
 *     summary: Récupérer les documents par nature
 *     tags:
 *       - Documents Finance/Compta
 *     parameters:
 *       - in: path
 *         name: id_nature_document
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des documents filtrés par nature
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 */
router.get('/nature/:id_nature_document', doc_FCController.getDocumentByNature);

/**
 * @swagger
 * /administration/documents/modifier/{id}:
 *   put:
 *     summary: Modifier un document Finance/Compta
 *     tags:
 *       - Documents Finance/Compta
 *     consumes:
 *       - multipart/form-data
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
 *     responses:
 *       200:
 *         description: Document modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 */
router.put('/modifier/:id', 
  prepareUploadPath,
  upload.single("document"),
  doc_FCController.updateDocument
);

/**
 * @swagger
 * /administration/documents/supprimer/{id}:
 *   delete:
 *     summary: Supprimer un document Finance/Compta
 *     tags:
 *       - Documents Finance/Compta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 */
router.delete('/supprimer/:id', doc_FCController.deleteDocument);

module.exports = router;