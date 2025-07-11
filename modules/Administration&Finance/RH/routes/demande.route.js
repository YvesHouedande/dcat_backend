

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
router.post('/', demandeController.createDemande);

// Ajouter un document à une demande RH
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
