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
        logger.info("Début de création de demande");
        
        // Log des données reçues (sans données sensibles)
        logger.debug("Body reçu:", {
            body: { ...req.body },
            // Masquer les données sensibles si nécessaire
        });
        
        logger.debug("Fichier reçu:", {
            file: req.file ? {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            } : "Aucun fichier"
        });

        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            logger.warn("Aucune donnée reçue dans le corps de la requête");
            if (req.file) await safeUnlink(req.file.path);
            return res.status(400).json({ message: "Les données de la demande sont requises." });
        }

        // Validation des champs requis
        const requiredFields = ['date_absence', 'date_retour', 'motif', 'type_demande', 'id_employes'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            logger.warn(`Champs requis manquants: ${missingFields.join(', ')}`, { fields: missingFields });
            if (req.file) await safeUnlink(req.file.path);
            return res.status(400).json({ 
                message: "Données incomplètes", 
                details: `Champs requis manquants: ${missingFields.join(', ')}` 
            });
        }

        // Création de la demande
        logger.debug("Préparation de la création de la demande avec les données validées");
        const demandeData = {
            date_absence: data.date_absence,
            status: data.status || "en attente",
            date_retour: data.date_retour,
            motif: data.motif,
            type_demande: data.type_demande,
            durée: data.durée,
            heure_debut: data.heure_debut,
            heure_fin: data.heure_fin,
            id_employes: parseInt(data.id_employes) 
        };
        
        logger.debug("Appel au service pour créer la demande", { demandeData });
        const demande = await demandeService.createDemande(demandeData);
        logger.debug("Résultat de la création de demande", { demande });
        
        if (!demande) {
            logger.error("Le service a retourné un résultat vide ou null");
            if (req.file) await safeUnlink(req.file.path);
            return res.status(500).json({ message: "Erreur lors de la création de la demande: le service n'a pas retourné de résultat." });
        }
        
        logger.debug("Clés de la demande retournée:", Object.keys(demande));

        // Gère le cas où le service retourne un tableau ou un objet
        let demandeObj = Array.isArray(demande) ? demande[0] : demande;
        const demandeId = demandeObj?.id_demandes || demandeObj?.id_demande || demandeObj?.id || demandeObj?.demandeId;

        if (!demandeId) {
            logger.error("ID de demande non retourné dans le résultat", { demande });
            if (req.file) await safeUnlink(req.file.path);
            return res.status(500).json({ 
                message: "Erreur lors de la création de la demande: ID manquant.",
                details: "La demande a peut-être été créée mais l'ID n'a pas été retourné."
            });
        }

        // Traitement du document si présent
        let documentResult = null;
        if (req.file) {
            logger.info("Traitement du document joint", { fileInfo: req.file.filename });
            const { libelle_document, classification_document } = req.body;
            
            if (!libelle_document) {
                logger.warn("Libellé du document manquant");
                await safeUnlink(req.file.path);
                return res.status(400).json({ 
                    message: "Le libellé du document est obligatoire.",
                    details: "Le document a été reçu mais pas enregistré car le libellé manque." 
                });
            }

            // Création du chemin relatif
            const relativePath = req.file.path
                .replace(process.cwd(), '')
                .replace(/\\/g, '/')
                .replace(/^\//, '');

            const document = {
                libelle_document,
                classification_document: classification_document || "Demande",
                lien_document: relativePath,
                etat_document: req.body.etat_document || "actif",
                date_document: new Date().toISOString().split('T')[0],
                id_demandes: parseInt(demandeId), 
                id_employes: parseInt(data.id_employes),
                id_nature_document: parseInt(data.id_nature_document) || null
            };

            logger.debug("Appel au service pour ajouter le document", { document });
            documentResult = await demandeService.addDocumentToDemande(document);
            logger.debug("Résultat de l'ajout du document", { documentResult });

            if (!documentResult) {
                logger.error("Échec de l'ajout du document");
                await safeUnlink(req.file.path);
                return res.status(500).json({ 
                    message: "Demande créée mais document non ajouté.",
                    details: "Une erreur s'est produite lors de l'enregistrement du document."
                });
            }
        }

        logger.info("Création de demande terminée avec succès", { 
            demandeId, 
            documentAdded: !!documentResult 
        });
        
        res.status(201).json({
            success: true,
            message: documentResult
                ? "Demande et document ajoutés avec succès"
                : "Demande ajoutée avec succès",
            data: {
                demande,
                document: documentResult
            }
        });
    } catch (error) {
        logger.error("Erreur lors de la création de la demande", { 
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code,
                name: error.name
            }
        });
        
        if (req.file && req.file.path) {
            await safeUnlink(req.file.path);
        }
        
        // Déterminer le type d'erreur
        let errorMessage = "Erreur interne lors de la création de la demande.";
        let statusCode = 500;
        
        // Personnaliser selon le type d'erreur
        if (error.code === '23505') {
            errorMessage = "Une demande identique existe déjà.";
            statusCode = 409; // Conflict
        } else if (error.code === '23503') {
            errorMessage = "Référence invalide (clé étrangère).";
            statusCode = 400; // Bad Request
        } else if (error.message && error.message.includes("invalid input")) {
            errorMessage = "Données d'entrée invalides.";
            statusCode = 400; // Bad Request
        }
        
        res.status(statusCode).json({
            message: errorMessage,
            details: error.message,
            type: error.name || "UnknownError"
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
    try {
        const { id } = req.params;
        logger.info(`Suppression de la demande ${id}`);
        
        if (!id) {
            logger.warn("Tentative de suppression sans ID");
            return res.status(400).json({ message: "L'ID de la demande est requis." });
        }
        
        // Optionnel: vérifier si la demande existe avant de tenter de la supprimer
        const demandeExists = await demandeService.getdemandeById(id);
        if (!demandeExists) {
            logger.warn(`La demande ${id} n'existe pas ou a déjà été supprimée`);
            return res.status(404).json({ 
                message: "Demande à supprimer non trouvée.",
                details: `ID recherché: ${id}` 
            });
        }
        
        const result = await demandeService.deleteDemande(id);
        logger.debug(`Résultat de la suppression`, { result });
        
        if (!result) {
            logger.error(`Échec de la suppression de la demande ${id}`);
            return res.status(500).json({ 
                message: "Échec de la suppression de la demande.",
                details: "La demande existe mais n'a pas pu être supprimée." 
            });
        }
        
        logger.info(`Demande ${id} supprimée avec succès`);
        res.status(200).json({
            success: true,
            message: "Demande supprimée avec succès",
            data: result
        });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de la demande ${req.params.id}`, {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        
        // Personnalisation selon le type d'erreur
        let errorMessage = "Erreur interne lors de la suppression de la demande.";
        let statusCode = 500;
        
        if (error.code === '23503') {
            errorMessage = "Impossible de supprimer cette demande car elle est référencée ailleurs.";
            statusCode = 400;
        }
        
        res.status(statusCode).json({ 
            message: errorMessage,
            details: error.message 
        });
    }
};

module.exports = {
    createDemande,
    getAllDemandes,
    getDemandeByType,
    updateDemande,
    deleteDemande
};