const entiteService = require('../services/entite.service');

const createEntite = async (req, res) => {
    try {
        // Validation douce du champ id_partenaire
        if (typeof req.body.id_partenaire !== 'undefined' && isNaN(parseInt(req.body.id_partenaire))) {
            return res.status(400).json({ message: "id_partenaire doit être un entier si fourni." });
        }
        const entite = await entiteService.createEntite(req.body);
        res
        .status(201)
        .json(entite);
    }
    catch (error) {
        console.error("Error creating entite:", error);
        res
        .status(500)
        .json({ message: "Internal server error" });
    }
}

const getEntites = async (req, res) => {
    try {
        const entites = await entiteService.getEntites();
        res
        .status(200)
        .json(entites);
    } catch (error) {
        console.error("Error fetching entites:", error);
        res
        .status(500)
        .json({ message: "Internal server error" });
    }
}

const getEntiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const entite = await entiteService.getEntiteById(id);
        if (!entite) {
            return res.status(404).json({ message: "Entite not found" });
        }
        res.status(200).json(entite);
    } catch (error) {
        console.error("Error fetching entite by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const updateEntite = async (req, res) => {
    try {
        const { id } = req.params;
        // Validation douce du champ id_partenaire
        if (typeof req.body.id_partenaire !== 'undefined' && isNaN(parseInt(req.body.id_partenaire))) {
            return res.status(400).json({ message: "id_partenaire doit être un entier si fourni." });
        }
        const updatedEntite = await entiteService.updateEntite(id, req.body);
        if (!updatedEntite) {
            return res.status(404).json({ message: "Entite not found" });
        }
        res.status(200).json(updatedEntite);
    } catch (error) {
        console.error("Error updating entite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteEntite = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntite = await entiteService.deleteEntite(id);
        if (!deletedEntite) {
            return res.status(404).json({ message: "Entite not found" });
        }
        res.status(200).json(deletedEntite);
    } catch (error) {
        console.error("Error deleting entite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getEntitesByPartenaire = async (req, res) => {
    try {
        const { id_partenaire } = req.params;
        const entites = await entiteService.getEntitesByPartenaire(id_partenaire);
        if (!entites || entites.length === 0) {
            return res.status(404).json({ message: "Aucune entité trouvée pour ce partenaire" });
        }
        res.status(200).json(entites);
    } catch (error) {
        console.error("Erreur lors de la récupération des entités par partenaire:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports = {
    createEntite,
    getEntites,
    getEntiteById,
    updateEntite,
    deleteEntite,
    getEntitesByPartenaire
}