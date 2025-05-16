const fs = require('fs');
const path = require('path');
const documentService = require('../services/doc_FC.service');

/**
 * Récupère tous les documents
 */
const getAllDocuments = async (req, res) => {
    try {
        const documents = await documentService.getDocument();
        
        if (!documents || documents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucun document trouvé"
            });
        }
        
        return res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des documents",
            error: error.message
        });
    }
};

/**
 * Récupère un document par sa nature
 */
const getDocumentByNature = async (req, res) => {
    try {
        const { id_nature_document } = req.params;
        
        if (!id_nature_document || isNaN(parseInt(id_nature_document))) {
            return res.status(400).json({
                success: false,
                message: "ID de nature de document invalide"
            });
        }
        
        const document = await documentService.getDocumentbyNature(parseInt(id_nature_document));
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: `Aucun document trouvé pour la nature d'ID ${id_nature_document}`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du document par nature:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du document par nature",
            error: error.message
        });
    }
};

/**
 * Ajoute un nouveau document
 */
const addDocument = async (req, res) => {
    try {
        // Vérification si un fichier a été uploadé
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier n'a été fourni"
            });
        }

        const { 
            libelle_document, 
            classification_document, 
            etat_document,  
            id_employes, 
            id_nature_document,
        } = req.body;

        // Vérifications des données obligatoires
        if (!libelle_document) {
            // Supprimer le fichier uploadé
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: "Le libellé du document est obligatoire"
            });
        }

        // Création du chemin relatif
        const relativePath = req.file.path
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')
            .replace(/^\//, '');

        const document = {
            libelle_document,
            classification_document: classification_document || "finance",
            lien_document: relativePath,
            etat_document: etat_document || "actif",
            id_employes: id_employes ? parseInt(id_employes) : null,
            id_nature_document: id_nature_document ? parseInt(id_nature_document) : null
        };

        const savedDocument = await documentService.addDocument(document);
        
        return res.status(201).json({
            success: true,
            message: "Document ajouté avec succès",
            data: savedDocument
        });
    } catch (error) {
        // Supprimer le fichier en cas d'échec
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur lors de la suppression du fichier:", err);
            });
        }
        
        console.error("Erreur lors de l'ajout du document:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du document",
            error: error.message
        });
    }
};

/**
 * Met à jour un document existant
 */
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID de document invalide"
            });
        }

        // Données à mettre à jour
        const updateData = { ...req.body };
        
        // Si un nouveau fichier est fourni
        if (req.file) {
            // Récupérer l'ancien lien avant la mise à jour
            const oldDocument = await documentService.getDocumentbyId(parseInt(id));
            
            if (!oldDocument) {
                // Supprimer le nouveau fichier si l'ancien document n'existe pas
                fs.unlinkSync(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: `Document avec l'ID ${id} non trouvé`
                });
            }
            
            // Mettre à jour le lien vers le nouveau fichier (chemin relatif)
            const relativePath = req.file.path
                .replace(process.cwd(), '')
                .replace(/\\/g, '/')
                .replace(/^\//, '');
            updateData.lien_document = relativePath;
            
            // Supprimer l'ancien fichier
            if (oldDocument.lien_document) {
                const oldFilePath = path.join(process.cwd(), oldDocument.lien_document);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }
        
        // Nettoyer les champs vides pour éviter les erreurs SQL
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === "") {
                delete updateData[key];
            }
        });

        // Mettre à jour la date de modification
        updateData.updated_at = new Date();
        
        // Convertir les IDs en entiers
        if (updateData.id_employes) updateData.id_employes = parseInt(updateData.id_employes);
        if (updateData.id_nature_document) updateData.id_nature_document = parseInt(updateData.id_nature_document);
        
        const updatedDocument = await documentService.updateDocument(parseInt(id), updateData);
        
        if (!updatedDocument) {
            // Supprimer le nouveau fichier si la mise à jour a échoué
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: `Document avec l'ID ${id} non trouvé`
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Document mis à jour avec succès",
            data: updatedDocument
        });
    } catch (error) {
        // Supprimer le nouveau fichier en cas d'erreur
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur lors de la suppression du fichier:", err);
            });
        }
        
        console.error("Erreur lors de la mise à jour du document:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du document",
            error: error.message
        });
    }
};

/**
 * Supprime un document
 */
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID de document invalide"
            });
        }
        
        // Récupérer le document avant suppression pour obtenir le chemin du fichier
        const documentToDelete = await documentService.getDocumentbyId(parseInt(id));
        
        if (!documentToDelete) {
            return res.status(404).json({
                success: false,
                message: `Document avec l'ID ${id} non trouvé`
            });
        }
        
        // Supprimer le document de la base de données
        const deletedDocument = await documentService.deleteDocument(parseInt(id));
        
        if (!deletedDocument) {
            return res.status(404).json({
                success: false,
                message: `Erreur lors de la suppression du document avec l'ID ${id}`
            });
        }
        
        // Supprimer le fichier physique
        if (documentToDelete.lien_document) {
            const filePath = path.join(process.cwd(), documentToDelete.lien_document);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        return res.status(200).json({
            success: true,
            message: "Document supprimé avec succès",
            data: deletedDocument
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du document:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du document",
            error: error.message
        });
    }
};

module.exports = {
    getAllDocuments,
    getDocumentByNature,
    addDocument,
    updateDocument,
    deleteDocument
};