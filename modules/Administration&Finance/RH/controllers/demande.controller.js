const demandeService = require('../services/demande.service');

const createDemande = async (req, res) => {
    try {
        const data = req.body;
        const result = await demandeService.createDemande(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating demande:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllDemandes = async (req, res) => {
    try {
        const result = await demandeService.getAllDemandes();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching demandes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getDemandeByType = async (req, res) => {
    try {
        const { type } = req.params;
        const result = await demandeService.getDemandeByType(type);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching demande by type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await demandeService.updateDemande(id, data);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating demande:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await demandeService.deleteDemande(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting demande:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createDemande,
    getAllDemandes,
    getDemandeByType,
    updateDemande,
    deleteDemande
};