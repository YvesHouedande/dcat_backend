const tachesService = require("../services/taches.service");

const tachesController = {
  getAllTaches: async (req, res) => {
    try {
      const taches = await tachesService.getAllTaches();
      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTacheById: async (req, res) => {
    try {
      const { id } = req.params;
      const tache = await tachesService.getTacheById(parseInt(id));
      if (!tache) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }
      res.status(200).json(tache);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTache: async (req, res) => {
    try {
      const tacheData = req.body;
      const newTache = await tachesService.createTache(tacheData);
      res.status(201).json(newTache);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTache: async (req, res) => {
    try {
      const { id } = req.params;
      const tacheData = req.body;
      const updatedTache = await tachesService.updateTache(parseInt(id), tacheData);
      if (!updatedTache) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }
      res.status(200).json(updatedTache);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTache: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await tachesService.deleteTache(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addEmployeToTache: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_employes } = req.body;
      
      const result = await tachesService.addEmployeToTache(
        parseInt(id),
        parseInt(id_employes)
      );
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeEmployeFromTache: async (req, res) => {
    try {
      const { id, employeId } = req.params;
      
      const result = await tachesService.removeEmployeFromTache(
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

  getTacheEmployes: async (req, res) => {
    try {
      const { id } = req.params;
      const employes = await tachesService.getTacheEmployes(parseInt(id));
      res.status(200).json(employes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTachesByProjet: async (req, res) => {
    try {
      const { projetId } = req.params;
      const taches = await tachesService.getTachesByProjet(parseInt(projetId));
      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = tachesController;
