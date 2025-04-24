const express = require("express");
const router = express.Router();
const projetsController = require("../controllers/projets.controller");
const uploadMiddleware = require("../utils/middleware/uploadMiddleware");

// Routes pour les projets
router.get("/", projetsController.getAllProjets);
router.get("/:id", projetsController.getProjetById);
router.post("/", projetsController.createProjet);
router.put("/:id", projetsController.updateProjet);
router.delete("/:id", projetsController.deleteProjet);

// Route pour ajouter un document à un projet
router.post("/:id/documents", uploadMiddleware.single("document"), projetsController.addDocumentToProjet);

// Routes pour la gestion des partenaires de projet
router.post("/:id/partenaires", projetsController.addPartenaireToProjet);
router.delete("/:id/partenaires/:partenaireId", projetsController.removePartenaireFromProjet);
router.get("/:id/partenaires", projetsController.getProjetPartenaires);

// Routes pour les livrables du projet
router.get("/:id/livrables", projetsController.getProjetLivrables);
router.post("/:id/livrables", projetsController.createLivrable);

module.exports = router;
