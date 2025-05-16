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