const fs = require('fs').promises;
const path = require('path');
const projetsService = require("../services/projets.service");

const projetsController = {
  getAllProjets: async (req, res) => {
    try {
      const projets = await projetsService.getAllProjets();
      res.status(200).json({ success: true, data: projets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjetById: async (req, res) => {
    try {
      const { id } = req.params;
      const projet = await projetsService.getProjetById(parseInt(id));
      if (!projet) {
        return res.status(404).json({ success: false, message: "Projet non trouvé" });
      }
      res.status(200).json({ success: true, data: projet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createProjet: async (req, res) => {
    try {
      const projetData = {
        nom_projet: req.body.nom_projet,
        type_projet: req.body.type_projet,
        devis_estimatif: parseFloat(req.body.devis_estimatif),
        date_debut: new Date(req.body.date_debut),
        date_fin: new Date(req.body.date_fin),
        duree_prevu_projet: req.body.duree_prevu_projet,
        description_projet: req.body.description_projet,
        etat: req.body.etat || 'en_cours',
        lieu: req.body.lieu,
        responsable: req.body.responsable,
        site: req.body.site,
        id_famille: req.body.id_famille ? parseInt(req.body.id_famille) : null
      };

      const newProjet = await projetsService.createProjet(projetData);

      res.status(201).json({
        success: true,
        message: "Projet créé avec succès",
        data: {
          projet: newProjet,
          details: {
            dateCreation: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création du projet",
        error: error.message
      });
    }
  },

  updateProjet: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (updateData.devis_estimatif) updateData.devis_estimatif = parseFloat(updateData.devis_estimatif);
      if (updateData.date_debut) updateData.date_debut = new Date(updateData.date_debut);
      if (updateData.date_fin) updateData.date_fin = new Date(updateData.date_fin);
      if (updateData.id_famille) updateData.id_famille = parseInt(updateData.id_famille);

      const updatedProjet = await projetsService.updateProjet(parseInt(id), updateData);

      if (!updatedProjet) {
        return res.status(404).json({ success: false, message: "Projet non trouvé" });
      }

      res.status(200).json({ success: true, data: updatedProjet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteProjet: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await projetsService.deleteProjet(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Projet non trouvé" });
      }
      res.status(200).json({
        success: true,
        message: "Projet supprimé avec succès",
        data: { id: parseInt(id) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  addDocumentToProjet: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Aucun fichier n'a été téléchargé"
        });
      }

      const { id } = req.params;
      const relativePath = req.file.path
        .replace(process.cwd(), '')
        .replace(/\\/g, '/')
        .replace(/^\//, '');

      const documentData = {
        libelle_document: req.body.libelle_document,
        classification_document: req.body.classification_document,
        lien_document: relativePath,
        etat_document: req.body.etat_document || 'actif',
        id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null,
        id_projet: parseInt(id)
      };

      let document;
      try {
        document = await projetsService.addDocumentToProjet(documentData);
      } catch (dbError) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'enregistrement du document en base",
          error: dbError.message
        });
      }

      res.status(201).json({
        success: true,
        message: "Document ajouté avec succès au projet",
        data: {
          document: document,
          details: {
            dateCreation: new Date().toISOString(),
            chemin: relativePath
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout du document",
        error: error.message
      });
    }
  },

  addPartenaireToProjet: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_partenaire } = req.body;
      const result = await projetsService.addPartenaireToProjet(
        parseInt(id),
        parseInt(id_partenaire)
      );
      res.status(201).json({
        success: true,
        message: "Partenaire ajouté au projet avec succès",
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  removePartenaireFromProjet: async (req, res) => {
    try {
      const { id, partenaireId } = req.params;
      const result = await projetsService.removePartenaireFromProjet(
        parseInt(id),
        parseInt(partenaireId)
      );
      if (!result) {
        return res.status(404).json({ success: false, message: "Association non trouvée" });
      }
      res.status(200).json({
        success: true,
        message: "Partenaire retiré du projet avec succès",
        data: {
          projet_id: parseInt(id),
          partenaire_id: parseInt(partenaireId)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjetPartenaires: async (req, res) => {
    try {
      const { id } = req.params;
      const partenaires = await projetsService.getProjetPartenaires(parseInt(id));
      res.status(200).json({
        success: true,
        message: "Liste des partenaires du projet récupérée avec succès",
        data: partenaires
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjetLivrables: async (req, res) => {
    try {
      const { id } = req.params;
      const livrables = await projetsService.getProjetLivrables(parseInt(id));
      res.status(200).json({
        success: true,
        message: "Liste des livrables du projet récupérée avec succès",
        data: livrables
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjetLivrablesWithDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const livrables = await projetsService.getProjetLivrablesWithDocuments(parseInt(id));
      res.status(200).json({
        success: true,
        message: "Liste des livrables avec documents du projet récupérée avec succès",
        data: livrables
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjetDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const documents = await projetsService.getProjetDocuments(parseInt(id));
      res.status(200).json({
        success: true,
        message: "Liste des documents du projet récupérée avec succès",
        data: documents
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const { id, documentId } = req.params;
      const document = await projetsService.getDocumentById(parseInt(documentId));
      if (!document || document.id_projet !== parseInt(id)) {
        return res.status(404).json({
          success: false,
          message: "Document non trouvé ou n'appartenant pas à ce projet"
        });
      }
      const deleted = await projetsService.deleteDocument(parseInt(documentId));
      res.status(200).json({
        success: true,
        message: "Document supprimé avec succès",
        data: {
          projet_id: parseInt(id),
          document_id: parseInt(documentId)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = projetsController;
