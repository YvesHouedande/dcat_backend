const doc_FCController = require('../controllers/doc_Fc.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATHS = {
  INTERVENTIONS: 'media/documents/administration/finance&compta'
};



router.post('/ajouter',
  (req, res, next) => {
    try {
      // Définir et créer le chemin avant l'upload
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.INTERVENTIONS);
      
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
    doc_FCController.addDocument
  );
router.get('/', doc_FCController.getAllDocuments);
router.get('/nature/:id', doc_FCController.getDocumentByNature);
router.put('/modifier/:id', doc_FCController.updateDocument);
router.delete('/supprimer/:id', doc_FCController.deleteDocument);

module.exports = router;
