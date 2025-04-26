const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const livrableController = require("../controllers/livrable.controller");
const uploadMiddleware = require("../../utils/middleware/uploadMiddleware");

const UPLOAD_PATHS = {
  LIVRABLES: 'media/documents/technique/livrables'
};

// CRUD Livrable
router.get("/", livrableController.getAllLivrables);
router.get("/:id", livrableController.getLivrableById);
router.post("/", livrableController.createLivrable);
router.put("/:id", livrableController.updateLivrable);
router.delete("/:id", livrableController.deleteLivrable);

// Documents liés au livrable
router.post("/:id/documents",
  (req, res, next) => {
    try {
      const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.LIVRABLES);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      req.uploadPath = uploadPath;
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadMiddleware.single("document"),
  livrableController.addDocumentToLivrable
);

router.get("/:id/documents", livrableController.getLivrableDocuments);
router.delete("/:id/documents/:documentId", livrableController.deleteDocument);

module.exports = router;