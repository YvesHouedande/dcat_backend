const projetsService = require("../services/projets.service");

const projetsController = {
  getAllProjets: async (req, res) => {
    try {
      const projets = await projetsService.getAllProjets();
      res.status(200).json(projets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjetById: async (req, res) => {
    try {
      const { id } = req.params;
      const projet = await projetsService.getProjetById(parseInt(id));
      if (!projet) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.status(200).json(projet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createProjet: async (req, res) => {
    try {
      const projetData = req.body;
      const newProjet = await projetsService.createProjet(projetData);
      res.status(201).json(newProjet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProjet: async (req, res) => {
    try {
      const { id } = req.params;
      const projetData = req.body;
      const updatedProjet = await projetsService.updateProjet(parseInt(id), projetData);
      if (!updatedProjet) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.status(200).json(updatedProjet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProjet: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await projetsService.deleteProjet(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addDocumentToProjet: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
      }
      
      const { id } = req.params;
      const documentData = {
        libelle_document: req.body.libelle_document,
        classification_document: req.body.classification_document,
        lien_document: req.file.path,
        etat_document: req.body.etat_document,
        id_nature_document: parseInt(req.body.id_nature_document),
        id_projet: parseInt(id)
      };
      
      const document = await projetsService.addDocumentToProjet(documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        return res.status(404).json({ message: "Association non trouvée" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjetPartenaires: async (req, res) => {
    try {
      const { id } = req.params;
      const partenaires = await projetsService.getProjetPartenaires(parseInt(id));
      res.status(200).json(partenaires);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjetLivrables: async (req, res) => {
    try {
      const { id } = req.params;
      const livrables = await projetsService.getProjetLivrables(parseInt(id));
      res.status(200).json(livrables);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createLivrable: async (req, res) => {
    try {
      const { id } = req.params;
      const livrableData = {
        ...req.body,
        id_projet: parseInt(id)
      };
      
      const newLivrable = await projetsService.createLivrable(livrableData);
      res.status(201).json(newLivrable);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = projetsController;
