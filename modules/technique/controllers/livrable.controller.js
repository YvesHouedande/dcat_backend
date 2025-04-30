const fs = require('fs').promises;
const livrableService = require("../services/livrable.service");

const livrableController = {
  getAllLivrables: async (req, res) => {
    try {
      const data = await livrableService.getAllLivrables();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getLivrableById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await livrableService.getLivrableById(parseInt(id));
      if (!data) return res.status(404).json({ success: false, message: "Livrable non trouvé" });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createLivrable: async (req, res) => {
    try {
      const data = req.body;
      const newLivrable = await livrableService.createLivrable(data);
      res.status(201).json({ success: true, data: newLivrable });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateLivrable: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await livrableService.updateLivrable(parseInt(id), data);
      if (!updated) return res.status(404).json({ success: false, message: "Livrable non trouvé" });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteLivrable: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await livrableService.deleteLivrable(parseInt(id));
      if (!deleted) return res.status(404).json({ success: false, message: "Livrable non trouvé" });
      res.status(200).json({ success: true, message: "Livrable supprimé", data: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Documents liés
  addDocumentToLivrable: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Aucun fichier n'a été téléchargé" });
      }
      const { id } = req.params;
      const relativePath = req.file.path.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\//, '');
      const documentData = {
        libelle_document: req.body.libelle_document,
        lien_document: relativePath,
        etat_document: req.body.etat_document || 'actif',
        id_livrable: parseInt(id),
        id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null
      };
      let document;
      try {
        document = await livrableService.addDocumentToLivrable(documentData);
      } catch (dbError) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du document en base", error: dbError.message });
      }
      res.status(201).json({ success: true, message: "Document ajouté au livrable", data: document });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getLivrableDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const documents = await livrableService.getLivrableDocuments(parseInt(id));
      res.status(200).json({ success: true, data: documents });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const { id, documentId } = req.params;
      const document = await livrableService.getDocumentById(parseInt(documentId));
      if (!document || document.id_livrable !== parseInt(id)) {
        return res.status(404).json({ success: false, message: "Document non trouvé ou n'appartenant pas à ce livrable" });
      }
      await livrableService.deleteDocument(parseInt(documentId));
      res.status(200).json({ success: true, message: "Document supprimé" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = livrableController;