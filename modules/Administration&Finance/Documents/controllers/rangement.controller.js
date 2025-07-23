const dossierService = require('../services/rangement.service');
const logger = require('../../../../core/utils/logger');

const createDossier = async (req, res) => {
    try {
        const dossierData = req.body;
        const newDossier = await dossierService.createDossier(dossierData);
        res.status(201).json(newDossier);
    } catch (error) {
        logger.error("Error creating dossier:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getDossiers = async (req, res) => {
    try {
        const dossiers = await dossierService.getDossiers();
        // Si aucune ressource, retourner [] avec code 200
        if (!dossiers || dossiers.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }
        res.status(200).json({
            success: true,
            count: dossiers.length,
            data: dossiers
        });
    } catch (error) {
        logger.error("Error fetching dossiers:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getDossierById = async (req, res) => {
    try {
        const { id } = req.params;
        const dossier = await dossierService.getDossierById(id);
        if (!dossier) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }
        const documents = await dossierService.getdocumentsBydossier(id);
        dossier.documents = documents || [];
        res.status(200).json({
            success: true,
            count: 1,
            data: [dossier]
        });
    } catch (error) {
        logger.error("Error fetching dossier by ID:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const updateDossier = async (req, res) => {
    try {
        const { id } = req.params;
        const dossierData = req.body;
        const updatedDossier = await dossierService.updateDossier(id, dossierData);
        if (!updatedDossier) {
            return res.status(404).json({ message: "Dossier not found" });
        }
        res.status(200).json(updatedDossier);
    } catch (error) {
        logger.error("Error updating dossier:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const deleteDossier = async (req, res) => {
    try {
        const { id } = req.params;
        await dossierService.deleteDocumentByDossier(id);
        const deletedDossier = await dossierService.deleteDossier(id);
        if (!deletedDossier) {
            return res.status(404).json({ message: "Dossier not found" });
        }
        res.status(200).json(deletedDossier);
    } catch (error) {
        logger.error("Error deleting dossier:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await dossierService.deleteDocumentById(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(deletedDocument);
    } catch (error) {
        logger.error("Error deleting document by ID:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createDossier,
    getDossiers,
    getDossierById,
    updateDossier,
    deleteDossier,
    deleteDocumentById
};

