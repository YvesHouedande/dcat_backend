const fs = require('fs');
const contratService = require('../services/contrat.service');
const logger = require('../../../../core/utils/logger');

/**
 * Suppression sécurisée d’un fichier
 */
async function safeUnlink(filePath) {
    try {
        await fs.promises.unlink(filePath);
        logger.info(`Fichier supprimé avec succès : ${filePath}`);
    } catch (err) {
        logger.error(`Erreur suppression fichier ${filePath} :`, { error: err });
    }
}

/**
 * Ajoute un document lié à un contrat
 */
async function handleDocumentUpload(req, contratId) {
    if (!req.file) return null;

    const { libelle_document, classification_document } = req.body;
    if (!libelle_document) {
        await safeUnlink(req.file.path);
        throw new Error("Le libellé du document est obligatoire.");
    }

    const relativePath = req.file.path
        .replace(process.cwd(), '')
        .replace(/\\/g, '/')
        .replace(/^\//, '');

    const documentData = {
        libelle_document,
        classification_document: classification_document || "Contrat",
        lien_document: relativePath,
        etat_document: req.body.etat_document || "actif",
        date_document: new Date().toISOString().split('T')[0],
        id_contrat: contratId,
        id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null
    };

    return await contratService.addDocument(documentData);
}

const createContrat = async (req, res) => {
    try {
        const contratData = {
            nom_contrat: req.body.nom_contrat,
            type_contrat: req.body.type_contrat,
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin,
            reference : req.body.reference,
            type_de_contrat: req.body.type_de_contrat,
            statut: req.body.statut || "actif",
            id_partenaire: req.body.id_partenaire ? parseInt(req.body.id_partenaire) : null,
        }
        const createdContrat = await contratService.createContrat(contratData);
        res.status(201).json({
            success: true,
            message: "Contrat créé avec succès",
            data: createdContrat
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur création contrat",
            details: error.message
        });
    }
};

const addDocumentToContrat = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: "Aucun fichier fourni." 
            });
        }
        const {id} = req.params;
        const documentData =  {
        libelle_document: req.body.libelle_document,
        classification_document: req.body.classification_document,
        lien_document: req.file.path.replace(/\\/g, '/'), // Normalise le chemin pour la BD
        etat_document: req.body.etat_document || 'actif',
        id_nature_document: parseInt(req.body.id_nature_document),
        id_contrat : parseInt(req.body.id_contrat)
        }
        const document = await contratService.addDocumentTocontrat(documentData);
        res.status(201).json({
            success: true,
            message: `Document ajouté avec succès au contrat ${document.id_contrat}`,
            data: {
                document: document,
                details: {
                    dateCreation: new Date().toISOString(),
                    chemin: documentData.lien_document
                    }
            }

        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du document :", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout du document",
        error: error.message
        });
    }
}



const getAllContrats = async (req, res) => {
    try {
        const contrats = await contratService.getContrats();
        res.status(200).json({
            success: true,
            count: contrats.length,
            data: contrats
        });
    } catch (error) {
        logger.error("Erreur récupération contrats", {
            error: {
                message: error.message,
                stack: error.stack
            }
        });

        res.status(500).json({
            success: false,
            message: "Erreur récupération contrats",
            details: error.message
        });
    }
};

const getContratsByPartenaire = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID partenaire requis" });
        }

        const contrats = await contratService.getContratsbyPartenaire(id);
        if (!contrats || contrats.length === 0) {
            return res.status(404).json({ message: "Aucun contrat trouvé pour ce partenaire." });
        }

        res.status(200).json({
            success: true,
            count: contrats.length,
            data: contrats
        });
    } catch (error) {
        logger.error(`Erreur récupération contrats partenaire ID: ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({
            message: "Erreur récupération contrats partenaire",
            details: error.message
        });
    }
};

const getContratById = async (req, res) => {
    try {
        const { id } = req.params;
        const contrat = await contratService.getContratById(id);
        if (!contrat) {
            return res.status(404).json({ message: "Contrat non trouvé" });
        }

        const documents = await contratService.getDocumentByContrat(id);
        contrat.documents = documents || [];

        res.status(200).json({
            success: true,
            count: 1,
            data: [contrat]
        });
    } catch (error) {
        logger.error(`Erreur récupération contrat ID: ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ message: "Erreur récupération contrat", details: error.message });
    }
};

const getContratByType = async (req, res) => {
    try {
        const { type } = req.params;
        logger.info(`Recherche des contrats par type: ${type}`);

        if (!type) {
            logger.warn("Type de contrat non spécifié");
            return res.status(400).json({ message: "Le type de contrat est requis." });
        }

        const result = await contratService.getContratByType(type);

        if (!Array.isArray(result)) {
            logger.error("Le service getContratByType n'a pas retourné un tableau");
            return res.status(500).json({
                message: "Données invalides retournées par le service de contrat.",
                details: "Le résultat n'est pas un tableau"
            });
        }

        if (result.length === 0) {
            logger.info(`Aucun contrat trouvé pour le type: ${type}`);
            return res.status(404).json({ 
                message: "Aucun contrat trouvé pour ce type.",
                details: `Type recherché: ${type}` 
            });
        }

        // Ne pas ajouter le champ documents ici

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        logger.error(`Erreur lors de la récupération des contrats de type ${req.params.type}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ 
            message: "Erreur interne lors de la récupération par type de contrat.",
            details: error.message 
        });
    }
};


const updateContrat = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) return res.status(400).json({ message: "ID contrat requis" });
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucune donnée fournie" });
        }

        updateData.updated_at = new Date();
        if (updateData.id_partenaire) updateData.id_partenaire = parseInt(updateData.id_partenaire);

        const result = await contratService.updateContrat(id, updateData);
        if (!result) {
            return res.status(404).json({ message: "Contrat non trouvé" });
        }

        res.status(200).json({ success: true, message: "Contrat mis à jour", data: result });
    } catch (error) {
        logger.error(`Erreur mise à jour contrat ${req.params.id}`, {
            error: { message: error.message, stack: error.stack }
        });

        let errorMessage = "Erreur mise à jour contrat";
        let statusCode = 500;

        if (error.code === '23505') {
            errorMessage = "Ce contrat existe déjà.";
            statusCode = 409;
        } else if (error.code === '23503') {
            errorMessage = "Clé étrangère invalide.";
            statusCode = 400;
        }

        res.status(statusCode).json({ message: errorMessage, details: error.message });
    }
};

const deleteContrat = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID requis." });

    try {
        // Vérifier si le contrat existe
        const contrat = await contratService.getContratById(id);
        if (!contrat) return res.status(404).json({ message: "Contrat introuvable." });

        // Vérifier s'il y a des documents liés au contrat
        const documents = await contratService.getDocumentByContrat(id);
        
        // Toujours essayer de supprimer les documents d'abord (même si la liste semble vide)
        // car il peut y avoir des références orphelines dans la base
        try {
            if (documents && documents.length > 0) {
                // Il y a des documents liés : les supprimer d'abord
                logger.info(`${documents.length} document(s) trouvé(s) pour le contrat ${id}`);
                
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
            } else {
                logger.info(`Aucun document lié au contrat ${id}`);
            }
            
            // Supprimer tous les documents de la base en une fois (même si la liste est vide)
            // Cela permet de nettoyer d'éventuelles références orphelines
            const deletedDocs = await contratService.deleteDocumentsByContrat(id);
            if (deletedDocs && deletedDocs.length > 0) {
                logger.info(`${deletedDocs.length} document(s) supprimé(s) de la base de données`);
            }
            
        } catch (docError) {
            logger.error(`Erreur lors de la suppression des documents`, { error: docError });
            return res.status(500).json({ 
                message: "Erreur lors de la suppression des documents liés." 
            });
        }

        // Supprimer le contrat après avoir supprimé tous les documents
        const deleted = await contratService.deleteContrat(id);
        if (!deleted) {
            return res.status(500).json({ message: "Échec suppression du contrat." });
        }

        logger.info(`Contrat ${id} supprimé avec succès`);
        res.status(200).json({ 
            message: "Suppression réussie.",
            documentsSupprimes: documents ? documents.length : 0
        });

    } catch (e) {
        logger.error(`Erreur lors de la suppression du contrat ${id}`, { error: e });
        
        // Gestion spécifique des erreurs de clé étrangère
        let msg = "Erreur serveur.";
        if (e.code === '23503') {
            msg = "Impossible de supprimer : contrat lié à d'autres données.";
        } else if (e.code === '23502') {
            msg = "Erreur de contrainte de données.";
        }
        
        res.status(500).json({ message: msg });
    }
};

const deleteDocumentById = async (req, res) => {
    try{
        const { id ,docId } = req.params;
        const document = await contratService.getDocumentById(parseInt(docId));
        if(!document || document.id_contrat !== parseInt(id)){
            return res.status(404).json({
                success:false,
                message:"Document non trouvé ou n'appartenant pas à cette intervention" 
            });
        }
        const deletedoc = await contratService.deleteDocumentById(parseInt(docId));
        res.status(200).json({
            succes : true,
            message: "Document supprimé avec succès",
            data: {
                intervention_id: parseInt(id),
                document_id: parseInt(docId)
        }
        })
} catch (error){
    res.status(500).json({
        succes: false,
        message: error.message
    });
}

}

module.exports = {
    createContrat,
    getAllContrats,
    getContratsByPartenaire,
    getContratById,
    getContratByType,
    updateContrat,
    deleteContrat,
    deleteDocumentById,
    addDocumentToContrat
};
