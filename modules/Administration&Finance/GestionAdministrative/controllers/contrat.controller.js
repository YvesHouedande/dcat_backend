const contratService = require('../services/contrat.service');
const logger = require('../../../../core/utils/logger');
const fs = require('fs');

/**
 * Suppression sécurisée d'un fichier
 */
async function safeUnlink(filePath) {
    try {
        await fs.promises.unlink(filePath);
        logger.info(`Fichier supprimé: ${filePath}`);
    } catch (err) {
        logger.error(`Erreur suppression fichier ${filePath}:`, { error: err });
    }
}


const createContrats = async (req, res) => {
    try {
        logger.info("Début création contrat");
        logger.debug("Body reçu:", { body: { ...req.body } });
        logger.debug("Fichier reçu:", {
            file: req.file ? {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            } : "Aucun fichier"
        });

        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            if (req.file) await safeUnlink(req.file.path);
            return res.status(400).json({ message: "Données contrat requises" });
        }

        const requiredFields = ['date_debut', 'date_fin', 'id_partenaire'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            if (req.file) await safeUnlink(req.file.path);
            return res.status(400).json({ 
                message: "Données incomplètes", 
                details: `Champs manquants: ${missingFields.join(', ')}` 
            });
        }

        const contratData = {
            nom_contrat: data.nom_contrat,
            reference: data.reference,
            date_debut: data.date_debut,
            duree_contrat: data.duree_contrat,
            date_fin: data.date_fin,
            statut_contrat: data.statut,
            id_partenaire: data.id_partenaire ? parseInt(data.id_partenaire) : null,
            type_contrat: data.type_contrat,
        };
        
        const contrat = await contratService.createContrat (contratData);

        
        if (!contrat) {
            if (req.file) await safeUnlink(req.file.path);
            return res.status(500).json({ message: "Erreur création contrat" });
        }

        const contratObj = Array.isArray(contrat) ? contrat[0] : contrat;
        const contratId = contratObj?.id_contrat;

        if (!contratId) {
            if (req.file) await safeUnlink(req.file.path);
            return res.status(500).json({ message: "Erreur: ID contrat manquant" });
        }

        let documentResult = null;
        if (req.file) {
            const { libelle_document, classification_document } = req.body;
            
            if (!libelle_document) {
                await safeUnlink(req.file.path);
                return res.status(400).json({ message: "Libellé document obligatoire" });
            }

            const relativePath = req.file.path
                .replace(process.cwd(), '')
                .replace(/\\/g, '/')
                .replace(/^\//, '');

            const documentData = {
                libelle_document,
                classification_document: classification_document || "Contrat",
                lien_document: relativePath,
                etat_document: req.body.etat_document || "Actif",
                date_document: new Date().toISOString().split('T')[0],
                id_contrat: contratId,
                id_nature_document: data.id_nature_document ? parseInt(data.id_nature_document) : null,
            };

            documentResult = await contratService.addDocument(documentData);
            if (!documentResult) {
                await safeUnlink(req.file.path);
                return res.status(500).json({ message: "Contrat créé mais document non ajouté" });
            }
        }
        
        res.status(201).json({
            success: true,
            message: documentResult ? "Contrat et document ajoutés" : "Contrat ajouté",
            data: { contrat, document: documentResult }
        });
    } catch (error) {
        logger.error("Erreur création contrat", { 
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code
            }
        });
        
        if (req.file && req.file.path) {
            await safeUnlink(req.file.path);
        }
        
        let errorMessage = "Erreur interne";
        let statusCode = 500;
        
        if (error.code === '23505') {
            errorMessage = "Contrat déjà existant";
            statusCode = 409;
        } else if (error.code === '23503') {
            errorMessage = "Référence invalide";
            statusCode = 400;
        } else if (error.message && error.message.includes("invalid input")) {
            errorMessage = "Données invalides";
            statusCode = 400;
        }
        
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            details: error.message,
            type: error.name || "UnknownError"
        });
    }
};

const getAllContrats = async (req, res) => {
    try {
        const contrats = await contratService.getContrats();
        
        return res.status(200).json({
            success: true,
            count: contrats.length,
            data: contrats
        });
    } catch (error) {
        logger.error("Erreur récupération contrats", { 
            error: { message: error.message, stack: error.stack }
        });
        
        return res.status(500).json({
            success: false,
            message: 'Erreur récupération contrats',
            details: error.message
        });
    }
};

const getContratsByPartenaire = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "ID partenaire requis" });
        }

        const contrats = await contratService.getContratsbyPartenaire(id);
        
        if (!contrats || (Array.isArray(contrats) && contrats.length === 0)) {
            return res.status(404).json({
                success: false,
                message: `Aucun contrat trouvé pour partenaire ID: ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            count: Array.isArray(contrats) ? contrats.length : 1,
            data: contrats
        });
    } catch (error) {
        logger.error(`Erreur récupération contrats partenaire ID: ${req.params.id}`, { 
            error: { message: error.message, stack: error.stack }
        });
        
        return res.status(500).json({
            success: false,
            message: 'Erreur récupération contrats partenaire',
            details: error.message
        });
    }
};

const getContratById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID contrat requis" });
        }
        const contrat = await contratService.getContratById(id); 

        if (!contrat) {
            return res.status(404).json({
                success: false,
                message: `Contrat ID: ${id} non trouvé`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contrat trouvé',
            data: contrat
        });
    } catch (error) {   

        logger.error(`Erreur récupération contrat ID: ${req.params.id}`, {
            error: { message: error.message, stack: error.stack }
        });
        return res.status(500).json({
            success: false,
            message: 'Erreur récupération contrat',
            details: error.message
        });
    }
};

const updateContrat = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "ID contrat requis" });
        }
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Aucune donnée fournie" });
        }

        const updateData = { ...req.body };
        
        if (updateData.id_partenaire) updateData.id_partenaire = parseInt(updateData.id_partenaire);
        if (updateData.montant) updateData.montant = parseFloat(updateData.montant);
        updateData.updated_at = new Date();

        const result = await contratService.updateContrat(id, updateData);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Contrat ID: ${id} non trouvé`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contrat mis à jour',
            data: result
        });
    } catch (error) {
        logger.error(`Erreur mise à jour contrat ID: ${req.params.id}`, { 
            error: { message: error.message, stack: error.stack, code: error.code }
        });
        
        let errorMessage = "Erreur mise à jour contrat";
        let statusCode = 500;
        
        if (error.code === '23505') {
            errorMessage = "Contrat avec ces informations déjà existant";
            statusCode = 409;
        } else if (error.code === '23503') {
            errorMessage = "Référence invalide";
            statusCode = 400;
        }
        
        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            details: error.message
        });
    }
};

const deleteContrat = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "ID contrat requis" });
        }

        const result = await contratService.deleteContrat(id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Contrat ID: ${id} non trouvé`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contrat supprimé',
            data: result
        });
    } catch (error) {
        logger.error(`Erreur suppression contrat ID: ${req.params.id}`, { 
            error: { message: error.message, stack: error.stack, code: error.code }
        });
        
        let errorMessage = "Erreur suppression contrat";
        let statusCode = 500;
        
        if (error.code === '23503') {
            errorMessage = "Impossible de supprimer ce contrat (références existantes)";
            statusCode = 400;
        }
        
        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            details: error.message
        });
    }
};

module.exports = {
    createContrats, // <-- corriger ici
    getAllContrats,
    getContratsByPartenaire,
    updateContrat,
    deleteContrat,
    getContratById
};
