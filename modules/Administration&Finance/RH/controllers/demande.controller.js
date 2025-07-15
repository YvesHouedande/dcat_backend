const fs = require('fs');
const demandeService = require('../services/demande.service');  
const logger = require('../../../../core/utils/logger');

// Fonction utilitaire pour supprimer un fichier de façon asynchrone
async function safeUnlink(filePath) {
    try {
        await fs.promises.unlink(filePath);
        logger.info(`Fichier supprimé avec succès: ${filePath}`);
    } catch (err) {
        logger.error(`Erreur lors de la suppression du fichier ${filePath}:`, { error: err });
    }
}

const createDemande = async (req, res) => {
    try {
        const DemandeData = {
            date_absence: req.body.date_absence,
            status: req.body.status,
            date_retour: req.body.date_retour,
            motif: req.body.motif,
            type_demande: req.body.type_demande,
            duree: req.body.duree,
            heure_debut: req.body.heure_debut,
            heure_fin: req.body.heure_fin,
            id_employes: req.body.id_employes ? parseInt(req.body.id_employes) : null,
        }
        const Demande = await demandeService.createDemande(DemandeData);
        logger.info("Demande créée avec succès", { demandeId: Demande.id_demande });
        res.status(201).json({
            success: true,
            message: "Demande créée avec succès",
            data: Demande
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur interne lors de la création de la demande.",
            details: error.message
        });
    }
};

const addDocumentToDemande = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier n'a été téléchargé"
            });
        }

        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID de la demande manquant ou invalide"
            });
        }

        const relativePath = req.file.path
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')
            .replace(/^\//, '');

        const docData = {
            libelle_document: req.body.libelle_document,
            classification_document: req.body.classification_document,
            lien_document: relativePath,
            etat_document: req.body.etat_document || 'actif',
            date_document: req.body.date_document ? new Date(req.body.date_document) : new Date(),
            id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null,
            id_demandes: parseInt(id)
        };

        let document;
        try {
            document = await demandeService.addDocumentToDemande(docData);
            logger.info("Document ajouté à la demande", { documentId: document.id_document });
        } catch (dbError) {
            await fs.promises.unlink(req.file.path).catch(() => {});
            logger.error("Erreur base de données lors de l'ajout du document à la demande", {
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
            message: "Document ajouté à la demande avec succès",
            data: {
                document,
                details: {
                    dateCreation: new Date().toISOString(),
                    chemin: relativePath
                }
            }
        });
    } catch (error) {
        logger.error("Erreur lors de l'ajout du document à la demande", {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({
            success: false,
            message: "Erreur interne lors de l'ajout du document à la demande.",
            error: error.message
        });
    }
};

const getAllDemandes = async (req, res) => {
    try {
        logger.info("Récupération de toutes les demandes");
        const result = await demandeService.getAllDemandes();
        logger.info(`${result.length} demandes récupérées`);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Erreur lors de la récupération des demandes", {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ 
            message: "Erreur interne lors de la récupération des demandes.",
            details: error.message 
        });
    }
};

const getDemandeByType = async (req, res) => {
    try {
        const { type } = req.params;
        logger.info(`Recherche de demandes par type: ${type}`);
        
        if (!type) {
            logger.warn("Type de demande non spécifié");
            return res.status(400).json({ message: "Le type de demande est requis." });
        }
        
        const result = await demandeService.getdemandeBytype(type);
        logger.info(`${result.length} demandes trouvées pour le type: ${type}`);
        
        if (!result || result.length === 0) {
            logger.info(`Aucune demande trouvée pour le type: ${type}`);
            return res.status(404).json({ 
                message: "Aucune demande trouvée pour ce type.",
                details: `Type recherché: ${type}` 
            });
        }
        
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des demandes de type ${req.params.type}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ 
            message: "Erreur interne lors de la récupération par type.",
            details: error.message 
        });
    }
};

const getDemandeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await demandeService.getdemandeById(id);
        const documents = await demandeService.getDocumentByDemande(id);

        const demande = Array.isArray(result) ? result[0] : result;
        if (!demande) {
            return res.status(200).json([]); // Tableau vide si non trouvé
        }

        // Ajoute tous les documents
        demande.documents = documents || [];

        res.status(200).json(demande);
    } catch (error) {
        logger.error(`Erreur lors de la récupération de la demande ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json([]);
    }
};


const getDemandeByEmploye = async (req, res) => {
    try {
        const { id_employe } = req.params;
        const result = await demandeService.getDemnandeByEmploye(id_employe);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des demandes de l'employé ${req.params.id_employe}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
    }
};
const updateDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        logger.info(`Mise à jour de la demande ${id}`, { updateData: data });
        
        if (!id) {
            logger.warn("Tentative de mise à jour sans ID");
            return res.status(400).json({ message: "L'ID de la demande est requis." });
        }
        
        if (!data || Object.keys(data).length === 0) {
            logger.warn(`Mise à jour de la demande ${id} sans données`);
            return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour." });
        }
        
        const result = await demandeService.updateDemande(id, data);
        logger.debug(`Résultat de la mise à jour`, { result });
        
        if (!result) {
            logger.warn(`Demande ${id} non trouvée pour mise à jour`);
            return res.status(404).json({ 
                message: "Demande à mettre à jour non trouvée.",
                details: `ID recherché: ${id}` 
            });
        }
        
        logger.info(`Demande ${id} mise à jour avec succès`);
        res.status(200).json({
            success: true,
            message: "Demande mise à jour avec succès",
            data: result
        });
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour de la demande ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ 
            message: "Erreur interne lors de la mise à jour de la demande.",
            details: error.message 
        });
    }
};

const deleteDemande = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID requis." });

    try {
        // Vérifier si la demande existe
        const demande = await demandeService.getdemandeById(id);
        if (!demande) return res.status(404).json({ message: "Demande introuvable." });

        // Vérifier s'il y a des documents liés à la demande
        const documents = await demandeService.getDocumentByDemande(id);
        
        if (documents && documents.length > 0) {
            // Il y a des documents liés : les supprimer d'abord
            logger.info(`${documents.length} document(s) trouvé(s) pour la demande ${id}`);
            
            try {
                // Supprimer les fichiers du disque d'abord
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
                                // Continuer même si le fichier ne peut pas être supprimé
                            }
                        }
                    }
                }
                
                // Supprimer tous les documents de la base en une fois
                // Utiliser l'ID de la demande, pas l'ID du document individuel
                const deletedDocs = await demandeService.deleteDocumentByDemande(id);
                if (!deletedDocs || deletedDocs.length === 0) {
                    throw new Error("Aucun document supprimé de la base");
                }
                logger.info(`${deletedDocs.length} document(s) supprimé(s) de la base de données`);
                
            } catch (docError) {
                logger.error(`Erreur lors de la suppression des documents`, { error: docError });
                return res.status(500).json({ 
                    message: "Erreur lors de la suppression des documents liés." 
                });
            }
        } else {
            logger.info(`Aucun document lié à la demande ${id}`);
        }

        // Supprimer la demande après avoir supprimé tous les documents
        const deleted = await demandeService.deleteDemande(id);
        if (!deleted) {
            return res.status(500).json({ message: "Échec suppression de la demande." });
        }

        logger.info(`Demande ${id} supprimée avec succès`);
        res.status(200).json({ 
            message: "Suppression réussie.",
            documentsSupprimes: documents ? documents.length : 0
        });

    } catch (e) {
        logger.error(`Erreur lors de la suppression de la demande ${id}`, { error: e });
        
        // Gestion spécifique des erreurs de clé étrangère
        let msg = "Erreur serveur.";
        if (e.code === '23503') {
            msg = "Impossible de supprimer : demande liée à d'autres données.";
        } else if (e.code === '23502') {
            msg = "Erreur de contrainte de données.";
        }
        
        res.status(500).json({ message: msg });
    }
};

const deleteDocumentById = async (req, res) => {
    try{
        const { id ,docId } = req.params;
        const documents = await demandeService.getDocumentById(parseInt(docId));
        const document = Array.isArray(documents) ? documents[0] : documents;
        if(!document || document.id_demandes !== parseInt(id)){
            return res.status(404).json({
                success:false,
                message:"Document non trouvé ou n'appartenant pas à cette demande" 
            });
        }
        const deletedoc = await demandeService.deleteDocumentById(parseInt(docId));
        res.status(200).json({
            succes : true,
            message: "Document supprimé avec succès",
            data: {
                demande_id: parseInt(id),
                document_id: parseInt(docId)
        }
        });
        // Supprimer le fichier du disque 
        if (documents.lien_document) {
            try {
                await safeUnlink(documents.lien_document);
            } catch (fileError) {
                logger.error(`Erreur lors de la suppression du fichier ${documents.lien_document}`, { error: fileError });
            }
        }
    } catch (error){
        res.status(500).json({
            succes: false,
            message: error.message
    });
}
};

module.exports = {
    createDemande,
    getAllDemandes,
    getDemandeByType,
    getDemandeById,
    updateDemande,
    deleteDemande,
    getDemandeByEmploye,
    deleteDocumentById,
    addDocumentToDemande
};