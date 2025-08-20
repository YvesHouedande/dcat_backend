const operationsService = require("../services/operations.service");

const operationsController = {
  getAllOperations: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        search,
        statut,
        priorite,
        dateDebut,
        dateFin,
        projetId
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        search,
        statut,
        priorite,
        dateDebut,
        dateFin,
        projetId: projetId ? parseInt(projetId) : undefined
      };

      const result = await operationsService.getAllOperations(options);
      res.status(200).json({ 
        success: true, 
        data: result.data, 
        pagination: result.pagination 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOperationById: async (req, res) => {
    try {
      const { id } = req.params;
      const operation = await operationsService.getOperationById(parseInt(id));
      if (!operation) {
        return res.status(404).json({ success: false, message: "Opération non trouvée" });
      }
      res.status(200).json({ success: true, data: operation });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createOperation: async (req, res) => {
    try {
      const operationData = req.body;
      const newOperation = await operationsService.createOperation(operationData);
      res.status(201).json({ success: true, data: newOperation });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateOperation: async (req, res) => {
    try {
      const { id } = req.params;
      const operationData = req.body;
      const updatedOperation = await operationsService.updateOperation(parseInt(id), operationData);
      if (!updatedOperation) {
        return res.status(404).json({ success: false, message: "Opération non trouvée" });
      }
      res.status(200).json({ success: true, data: updatedOperation });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteOperation: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await operationsService.deleteOperation(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Opération non trouvée" });
      }
      res.status(200).json({ success: true, message: "Opération supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOperationTaches: async (req, res) => {
    try {
      const { id } = req.params;
      const taches = await operationsService.getOperationTaches(parseInt(id));
      res.status(200).json({ success: true, data: taches });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOperationsByProjet: async (req, res) => {
    try {
      const { projetId } = req.params;
      const operations = await operationsService.getOperationsByProjet(parseInt(projetId));
      res.status(200).json({ success: true, data: operations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = operationsController;
