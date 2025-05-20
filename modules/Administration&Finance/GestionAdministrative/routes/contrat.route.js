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
    // Définir et créer le chemin avant l'upload
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
    contratcontroller.createContrats // <-- assurez-vous d'utiliser le même nom que dans l'export
);

router.get("/", contratcontroller.getAllContrats);
router.get("/:id", contratcontroller.getContratById);
router.put("/:id", contratcontroller.updateContrat);
router.delete("/:id", contratcontroller.deleteContrat);

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