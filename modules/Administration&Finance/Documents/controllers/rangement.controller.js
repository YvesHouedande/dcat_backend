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
        
        // Vérifier si un dossier existe déjà avec ce libellé (contrainte unique)
        const existing = await dossierService.getDossierByLibelle(dossierData.libelle_dossier);
        if (existing) {
            return res.status(409).json({
                message: "Un dossier avec ce libellé existe déjà.",
                code: "DOSSIER_EXISTS",
                details: {
                    libelle: dossierData.libelle_dossier
                }
            });
        }
        
        const newDossier = await dossierService.createDossier(dossierData);
        res.status(201).json(newDossier);
    } catch (error) {
        logger.error("Error creating dossier:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getDossiers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Validation des paramètres de pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                message: "Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100" 
            });
        }
        
        const result = await dossierService.getDossiers(page, limit);
        res.status(200).json(result);
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
        const documents = await dossierService.getDocumentsByDossier(id);

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

const createDocument = async (req, res) => {
    try {
        const documentData = {
            ...req.body,
            // Conversion des IDs en entiers si fournis
            id_livrable: req.body.id_livrable ? parseInt(req.body.id_livrable) : null,
            id_projet: req.body.id_projet ? parseInt(req.body.id_projet) : null,
            id_demandes: req.body.id_demandes ? parseInt(req.body.id_demandes) : null,
            id_contrat: req.body.id_contrat ? parseInt(req.body.id_contrat) : null,
            id_employes: req.body.id_employes ? parseInt(req.body.id_employes) : null,
            id_intervention: req.body.id_intervention ? parseInt(req.body.id_intervention) : null,
            id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null
        };
        const newDocument = await dossierService.createDocument(documentData);
        res.status(201).json(newDocument);
    } catch (error) {
        if (error.message === "Dossier non trouvé") {
            return res.status(404).json({ message: "Dossier non trouvé" });
        }
        logger.error("Erreur lors de la création du document:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const addDocumentToDossier = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier n'a été téléchargé"
            });
        }

        const { id_dossier } = req.params;
        if (!id_dossier || isNaN(parseInt(id_dossier))) {
            return res.status(400).json({
                success: false,
                message: "ID du dossier manquant ou invalide"
            });
        }

        // Vérifier si le dossier existe
        const dossier = await dossierService.getDossierById(id_dossier);
        if (!dossier) {
            // Supprimer le fichier uploadé si le dossier n'existe pas
            await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(404).json({ 
                success: false,
                message: "Dossier non trouvé" 
            });
        }

        const relativePath = req.file.path
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')
            .replace(/^\//, '');

        const docData = {
            libelle_document: req.body.libelle_document,
            date_document: req.body.date_document ? new Date(req.body.date_document) : new Date(),
            lien_document: relativePath,
            etat_document: req.body.etat_document || 'Actif',
            id_dossier: parseInt(id_dossier),
            // Nouveaux champs pour les relations
            id_livrable: req.body.id_livrable ? parseInt(req.body.id_livrable) : null,
            id_projet: req.body.id_projet ? parseInt(req.body.id_projet) : null,
            id_demandes: req.body.id_demandes ? parseInt(req.body.id_demandes) : null,
            id_contrat: req.body.id_contrat ? parseInt(req.body.id_contrat) : null,
            id_employes: req.body.id_employes ? parseInt(req.body.id_employes) : null,
            id_intervention: req.body.id_intervention ? parseInt(req.body.id_intervention) : null,
            id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null
        };

        let document;
        try {
            document = await dossierService.createDocument(docData);
            logger.info("Document ajouté au dossier", { documentId: document.id_documents, dossierId: id_dossier });
        } catch (dbError) {
            await fs.promises.unlink(req.file.path).catch(() => {});
            logger.error("Erreur base de données lors de l'ajout du document au dossier", {
                error: {
                    message: dbError.message,
                    stack: dbError.stack
                }
            });
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'enregistrement du document en base",
                error: dbError.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Document ajouté au dossier avec succès",
            data: {
                document,
                details: {
                    dateCreation: new Date().toISOString(),
                    chemin: relativePath
                }
            }
        });
    } catch (error) {
        logger.error("Erreur lors de l'ajout du document au dossier", {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: "Erreur interne lors de l'ajout du document au dossier.",
            error: error.message
        });
    }
};

const getDossiersByTypeAndLibelle = async (req, res) => {
    try {
        const { type, libelle } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Validation des paramètres de pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                message: "Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100" 
            });
        }
        
        const result = await dossierService.getDossiersByTypeAndLibelle(type, libelle, page, limit);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Erreur lors de la récupération des dossiers par type et libellé:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getDocumentsByDossierIdAndLibelle = async (req, res) => {
    try {
        const { id, libelle } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Validation des paramètres de pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                message: "Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100" 
            });
        }
        
        const result = await dossierService.getDocumentsByDossierIdAndLibelle(id, libelle, page, limit);
        if (!result) {
            return res.status(404).json({ message: "Dossier non trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error("Erreur lors de la récupération des documents par id et libellé:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getDocumentsIntervention = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Validation des paramètres de pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                message: "Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100" 
            });
        }
        
        const result = await dossierService.getDocumentsIntervention(page, limit);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Erreur lors de la récupération des documents d'intervention:", { error, route: req.originalUrl });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    createDossier,
    getDossiers,
    getDossierById,
    updateDossier,
    deleteDossier,
    deleteDocumentById,
    createDocument,
    addDocumentToDossier,
    getDossiersByTypeAndLibelle,
    getDocumentsByDossierIdAndLibelle,
    getDocumentsIntervention
};

