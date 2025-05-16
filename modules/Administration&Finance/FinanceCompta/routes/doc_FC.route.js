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

router.post('/ajouter', 
  prepareUploadPath,
  upload.single("document"), 
  doc_FCController.addDocument
);

router.get('/', doc_FCController.getAllDocuments);

router.get('/nature/:id_nature_document', doc_FCController.getDocumentByNature);

router.put('/modifier/:id', 
  prepareUploadPath,
  upload.single("document"),
  doc_FCController.updateDocument
);

router.delete('/supprimer/:id', doc_FCController.deleteDocument);

module.exports = router;