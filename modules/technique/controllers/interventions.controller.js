const interventionsService = require("../services/interventions.service");

const interventionsController = {
  getAllInterventions: async (req, res) => {
    try {
      const interventions = await interventionsService.getAllInterventions();
      res.status(200).json(interventions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInterventionById: async (req, res) => {
    try {
      const { id } = req.params;
      const intervention = await interventionsService.getInterventionById(parseInt(id));
      if (!intervention) {
        return res.status(404).json({ message: "Intervention non trouvée" });
      }
      res.status(200).json(intervention);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createIntervention: async (req, res) => {
    try {
      const interventionData = req.body;
      const newIntervention = await interventionsService.createIntervention(interventionData);
      res.status(201).json(newIntervention);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateIntervention: async (req, res) => {
    try {
      const { id } = req.params;
      const interventionData = req.body;
      const updatedIntervention = await interventionsService.updateIntervention(parseInt(id), interventionData);
      if (!updatedIntervention) {
        return res.status(404).json({ message: "Intervention non trouvée" });
      }
      res.status(200).json(updatedIntervention);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteIntervention: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await interventionsService.deleteIntervention(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Intervention non trouvée" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addDocumentToIntervention: async (req, res) => {
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
        id_intervention: parseInt(id)
      };
      
      const document = await interventionsService.addDocumentToIntervention(documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addEmployeToIntervention: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_employes } = req.body;
      
      const result = await interventionsService.addEmployeToIntervention(
        parseInt(id),
        parseInt(id_employes)
      );
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeEmployeFromIntervention: async (req, res) => {
    try {
      const { id, employeId } = req.params;
      
      const result = await interventionsService.removeEmployeFromIntervention(
        parseInt(id),
        parseInt(employeId)
      );
      
      if (!result) {
        return res.status(404).json({ message: "Association non trouvée" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInterventionEmployes: async (req, res) => {
    try {
      const { id } = req.params;
      const employes = await interventionsService.getInterventionEmployes(parseInt(id));
      res.status(200).json(employes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = interventionsController;
