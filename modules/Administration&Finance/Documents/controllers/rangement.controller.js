const dossierService = require('../services/rangement.service');
const logger = require('../../../../core/utils/logger');
const fs = require('fs/promises'); // Ajoute ceci en haut du fichier

async function safeUnlink(path) {
    try {
        await fs.unlink(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

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
        res.status(200).json(dossiers);
    } catch (error) {
        logger.error("Error fetching dossiers:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getDossierById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dossierService.getDossierById(id);
        const dossier = Array.isArray(result) ? result[0] : result;

        if (!dossier) {
            return res.status(200).json([]);
        }
        res.status(200).json(dossier);
    } catch (error) {
        logger.error(`Erreur lors de la récupération du dossier ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json([]);
    }
};

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
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID requis." });

    try {
        // Vérifier si le dossier existe
        const dossier = await dossierService.getDossierById(id);
        if (!dossier) return res.status(404).json({ message: "Dossier introuvable." });

        // Récupérer tous les documents liés au dossier
        const documents = await dossierService.getdocumentsBydossier(id);

        if (documents && documents.length > 0) {
            logger.info(`${documents.length} document(s) trouvé(s) pour le dossier ${id}`);

            // Supprimer les fichiers du disque pour chaque document
            for (const doc of documents) {
                if (doc.lien_document) {
                    try {
                        await safeUnlink(doc.lien_document);
                        logger.info(`Fichier ${doc.lien_document} supprimé du disque`);
                    } catch (fileError) {
                        if (fileError.code === 'ENOENT') {
                            logger.warn(`Fichier ${doc.lien_document} déjà supprimé ou inexistant`);
                        } else {
                            logger.error(`Erreur lors de la suppression du fichier ${doc.lien_document}`, { error: fileError });
                        }
                    }
                }
            }

            // Supprimer tous les documents de la base liés au dossier
            try {
                await dossierService.deleteDocumentByDossier(id);
                logger.info(`Documents liés au dossier ${id} supprimés de la base de données`);
            } catch (docDbError) {
                logger.error(`Erreur lors de la suppression des documents en base`, { error: docDbError });
                return res.status(500).json({ message: "Erreur lors de la suppression des documents liés." });
            }
        } else {
            logger.info(`Aucun document lié au dossier ${id}`);
        }

        // Supprimer le dossier après avoir supprimé tous les documents
        const deleted = await dossierService.deleteDossier(id);
        if (!deleted) {
            return res.status(500).json({ message: "Échec suppression du dossier." });
        }

        logger.info(`Dossier ${id} supprimé avec succès`);
        res.status(200).json({
            message: "Suppression réussie.",
            documentsSupprimes: documents ? documents.length : 0
        });

    } catch (e) {
        logger.error(`Erreur lors de la suppression du dossier ${id}`, { error: e });

        let msg = "Erreur serveur.";
        if (e.code === '23503') {
            msg = "Impossible de supprimer : dossier lié à d'autres données.";
        } else if (e.code === '23502') {
            msg = "Erreur de contrainte de données.";
        }

        res.status(500).json({ message: msg });
    }
};

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
};

const getDossierByType = async (req, res) => {
    try {
        const { type } = req.params;
        const dossiers = await dossierService.getDossierByType(type);
        res.status(200).json(dossiers);
    } catch (error) {
        logger.error("Error fetching dossiers by type:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getdocumentsBydossier = async (req, res) => {
    try {
        const { id } = req.params;
        const { documents } = await dossierService.getdocumentsBydossier(id);
        res.status(200).json(documents);
    } catch (error) {
        logger.error("Error fetching documents by dossier:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createDossier,
    getDossiers,
    getDossierById,
    updateDossier,
    deleteDossier,
    deleteDocumentById,
    getDossierByType,
    getdocumentsBydossier
};

