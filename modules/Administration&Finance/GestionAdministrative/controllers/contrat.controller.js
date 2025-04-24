const contratService = require('../services/contrat.service');

const createContrat = async (req, res) => {
    try {   
        const contrat = await contratService.createContrat(req.body);
        res.status(201).json(contrat);
    }
    catch (error) {
        console.error("Error creating contrat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getContrats = async (req, res) => {
    try {
        const contrats = await contratService.getContrats();
        res.status(200).json(contrats);
    } catch (error) {
        console.error("Error fetching contrats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getContratbyPartenaire = async (req, res) => {
    try {
        const { id } = req.params;
        const contrat = await contratService.getContratsbyPartenaire(id);
        if (!contrat) {
            return res.status(404).json({ message: "Contrat not found" });
        }
        res.status(200).json(contrat);
    } catch (error) {
        console.error("Error fetching contrat by partenaire:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateContrat = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContrat = await contratService.updateContrat(id, req.body);
        if (!updatedContrat) {
            return res.status(404).json({ message: "Contrat not found" });
        }
        res.status(200).json(updatedContrat);
    } catch (error) {
        console.error("Error updating contrat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteContrat = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContrat = await contratService.deleteContrat(id);
        if (!deletedContrat) {
            return res.status(404).json({ message: "Contrat not found" });
        }
        res.status(200).json(deletedContrat);
    } catch (error) {
        console.error("Error deleting contrat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createContrat,
    getContrats,
    getContratbyPartenaire,
    updateContrat,
    deleteContrat
}