const entiteService = require('../services/entite.service');

const createEntite = async (req, res) => {
    try {
        const entite = await entiteService.createEntite(req.body);
        res.status(201).json({
            success: true,
            data: entite,
            message: "Entité créée avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'entité:", error);
        
        if (error.message.includes("denomination") || error.message.includes("nom de l'entité")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes("partenaire")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

const getEntites = async (req, res) => {
    try {
        const entites = await entiteService.getEntites();
        res.status(200).json({
            success: true,
            data: entites,
            count: entites.length
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des entités:", error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

const getEntiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const entite = await entiteService.getEntiteById(id);
        
        if (!entite) {
            return res.status(404).json({
                success: false,
                message: "Entité non trouvée"
            });
        }
        
        res.status(200).json({
            success: true,
            data: entite
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'entité par ID:", error);
        
        if (error.message.includes("ID d'entité invalide")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

const updateEntite = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEntite = await entiteService.updateEntite(id, req.body);
        
        if (!updatedEntite) {
            return res.status(404).json({
                success: false,
                message: "Entité non trouvée"
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedEntite,
            message: "Entité mise à jour avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'entité:", error);
        
        if (error.message.includes("ID d'entité invalide")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes("denomination") || error.message.includes("nom de l'entité") || error.message.includes("partenaire")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

const deleteEntite = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntite = await entiteService.deleteEntite(id);
        
        if (!deletedEntite) {
            return res.status(404).json({
                success: false,
                message: "Entité non trouvée"
            });
        }
        
        res.status(200).json({
            success: true,
            data: deletedEntite,
            message: "Entité supprimée avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'entité:", error);
        
        if (error.message.includes("ID d'entité invalide")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

const getEntitesByPartenaire = async (req, res) => {
    try {
        const { id_partenaire } = req.params;
        const entites = await entiteService.getEntitesByPartenaire(id_partenaire);
        
        res.status(200).json({
            success: true,
            data: entites,
            count: entites.length,
            message: entites.length > 0 
                ? `${entites.length} entité(s) trouvée(s) pour ce partenaire`
                : "Aucune entité trouvée pour ce partenaire"
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des entités par partenaire:", error);
        
        if (error.message.includes("ID de partenaire invalide")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

module.exports = {
    createEntite,
    getEntites,
    getEntiteById,
    updateEntite,
    deleteEntite,
    getEntitesByPartenaire
};