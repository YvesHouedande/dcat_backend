const natureService = require('../services/nature.service');

const createNature = async (req, res) => {
    try {
        const data = req.body;
        const result = await natureService.createNature(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating nature:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllNatures = async (req, res) => {
    try {
        const result = await natureService.getAllNatures();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching natures:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getNaturebyId = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await natureService.getNaturebyId(id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Nature not found" });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching nature by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateNature = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await natureService.updateNature(id, data);
        if (result.length === 0) {
            return res.status(404).json({ message: "Nature not found" });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error updating nature:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteNature = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await natureService.deleteNature(id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Nature not found" });
        }
        res.status(200).json({ message: "Nature deleted successfully" });
    } catch (error) {
        console.error("Error deleting nature:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createNature,
    getAllNatures,
    getNaturebyId,
    updateNature,
    deleteNature
}
