const fonctionsService = require("../services/fonction.service");

const createFonction = async (req, res) => {
    try {
        const data = req.body;
        const fonction = await fonctionsService.createFonction(data);
        return res.status(201).json(fonction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getFonctions = async (req, res) => {
    try {
        const fonctions = await fonctionsService.getFonctions();
        return res.status(200).json(fonctions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getFonctionById = async (req, res) => {
    try {
        const { id } = req.params;
        const fonction = await fonctionsService.getFonctionById(id);
        if (!fonction) {
            return res.status(404).json({ message: "Fonction not found" });
        }
        return res.status(200).json(fonction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateFonction = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const fonction = await fonctionsService.updateFonction(id, data);
        if (!fonction) {
            return res.status(404).json({ message: "Fonction not found" });
        }
        return res.status(200).json(fonction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteFonction = async (req, res) => {
    try {
        const { id } = req.params;
        const fonction = await fonctionsService.deleteFonction(id);
        if (!fonction) {
            return res.status(404).json({ message: "Fonction not found" });
        }
        return res.status(200).json(fonction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createFonction,
    getFonctions,
    getFonctionById,
    updateFonction,
    deleteFonction
}