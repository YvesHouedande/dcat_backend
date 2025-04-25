const path = require('path');
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
      const interventionData = {
        date_: new Date(req.body.date_),
        cause_defaillance: req.body.cause_defaillance,
        rapport_intervention: req.body.rapport_intervention,
        type_intervention: req.body.type_intervention,
        type_defaillance: req.body.type_defaillance,
        duree: req.body.duree,
        lieu: req.body.lieu,
        statut_intervention: req.body.statut_intervention || 'en_cours',
        recommandation: req.body.recommandation,
        probleme_signale: req.body.probleme_signale,
        mode_intervention: req.body.mode_intervention,
        detail_cause: req.body.detail_cause,
        type: req.body.type,
        id_partenaire: req.body.id_partenaire ? parseInt(req.body.id_partenaire) : null,
        id_contrat: req.body.id_contrat ? parseInt(req.body.id_contrat) : null
      };

      const newIntervention = await interventionsService.createIntervention(interventionData);

      res.status(201).json({
        success: true,
        message: "Intervention créée avec succès",
        data: {
          intervention: newIntervention,
          details: {
            dateCreation: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'intervention",
        error: error.message
      });
    }
  },

  updateIntervention: async (req, res) => {
    try {
      const { id } = req.params;
      // Prendre directement toutes les données du corps de la requête
      const updateData = req.body;
      
      // Convertir les types de données si nécessaire
      if (updateData.date_) updateData.date_ = new Date(updateData.date_);
      if (updateData.id_partenaire) updateData.id_partenaire = parseInt(updateData.id_partenaire);
      if (updateData.id_contrat) updateData.id_contrat = parseInt(updateData.id_contrat);

      const updatedIntervention = await interventionsService.updateIntervention(
        parseInt(id), 
        updateData
      );

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
        return res.status(404).json({ 
          success: false,
          message: "Intervention non trouvée" 
        });
      }
      
      // Remplacer le status 204 (sans contenu) par un 200 avec un message de succès
      res.status(200).json({
        success: true,
        message: "Intervention supprimée avec succès",
        data: { id: parseInt(id) }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },
  
  addDocumentToIntervention: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Aucun fichier n'a été téléchargé"
        });
      }

      const { id } = req.params;
      const documentData = {
        libelle_document: req.body.libelle_document,
        classification_document: req.body.classification_document,
        lien_document: req.file.path.replace(/\\/g, '/'), // Normalise le chemin pour la BD
        etat_document: req.body.etat_document || 'actif',
        id_nature_document: parseInt(req.body.id_nature_document),
        // id_intervention: parseInt(id)
      };

      const document = await interventionsService.addDocumentToIntervention(documentData);
      
      res.status(201).json({
        success: true,
        message: "Document ajouté avec succès à l'intervention",
        data: {
          document: document,
          details: {
            dateCreation: new Date().toISOString(),
            chemin: documentData.lien_document
          }
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du document :", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout du document",
        error: error.message
      });
    }
  },


  // Dans interventionsController, ajoutez cette méthode pour récupérer les documents d'une intervention

  getInterventionDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const documents = await interventionsService.getInterventionDocuments(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: "Liste des documents de l'intervention récupérée avec succès",
        data: documents
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  
  deleteDocument: async (req, res) => {
    try {
      const { id, documentId } = req.params;
      
      // Vérification que le document appartient bien à l'intervention
      const document = await interventionsService.getDocumentById(parseInt(documentId));
      if (!document || document.id_intervention !== parseInt(id)) {
        return res.status(404).json({ 
          success: false, 
          message: "Document non trouvé ou n'appartenant pas à cette intervention" 
        });
      }
      
      const deleted = await interventionsService.deleteDocument(parseInt(documentId));
      
      res.status(200).json({
        success: true,
        message: "Document supprimé avec succès",
        data: { 
          intervention_id: parseInt(id), 
          document_id: parseInt(documentId) 
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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
      
      res.status(201).json({
        success: true,
        message: "Employé ajouté à l'intervention avec succès",
        data: result
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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
        return res.status(404).json({ 
          success: false, 
          message: "Association non trouvée" 
        });
      }
      
      // Changer le status à 200 et ajouter un message de succès
      res.status(200).json({
        success: true,
        message: "Employé retiré de l'intervention avec succès",
        data: { 
          intervention_id: parseInt(id), 
          employe_id: parseInt(employeId) 
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },
  
  getInterventionEmployes: async (req, res) => {
    try {
      const { id } = req.params;
      const employes = await interventionsService.getInterventionEmployes(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: "Liste des employés de l'intervention récupérée",
        data: employes
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};
  

module.exports = interventionsController;
