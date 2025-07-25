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


const createContrat = async (req, res) => {
    try {
        // Validation douce du champ id_entite
        if (typeof req.body.id_entite !== 'undefined' && isNaN(parseInt(req.body.id_entite))) {
            return res.status(400).json({ message: "id_entite doit être un entier si fourni." });
        }
        const contratData = {
            nom_contrat: req.body.nom_contrat,
            type_contrat: req.body.type_contrat,
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin,
            reference : req.body.reference,
            type_de_contrat: req.body.type_de_contrat,
            statut: req.body.statut || "actif",
            id_partenaire: req.body.id_partenaire ? parseInt(req.body.id_partenaire) : null,
            id_entite: req.body.id_entite ? parseInt(req.body.id_entite) : null,
            duree_contrat: req.body.duree_contrat,
            nom_interlocuteur: req.body.nom_interlocuteur,
            contact_interlocuteur: req.body.contact_interlocuteur,
            contenu_contrat: req.body.contenu_contrat,
            cout: req.body.cout,
            modalite_paiement: req.body.modalite_paiement
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
                message: "Aucun fichier n'a été téléchargé"
            });
        }

        const { id } = req.params;

        // Nettoyage du chemin relatif
        const relativePath = req.file.path
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')
            .replace(/^\//, '');

        const documentData = {
            libelle_document: req.body.libelle_document,
            classification_document: req.body.classification_document,
            lien_document: relativePath,
            etat_document: req.body.etat_document || 'actif',
            date_document: req.body.date_document ? new Date(req.body.date_document) : new Date(),
            id_nature_document: req.body.id_nature_document ? parseInt(req.body.id_nature_document) : null,
            id_contrat: parseInt(id)
        };

        let document;
        try {
            document = await contratService.addDocumentTocontrat(documentData);

            return res.status(201).json({
                success: true,
                message: "Document ajouté au contrat avec succès",
                data: document
            });

        } catch (dbError) {
            // Supprimer le fichier en cas d'erreur d'enregistrement en base
            await fs.promises.unlink(req.file.path).catch(() => {});

            // Log technique (console ou fichier)
            logger.error("Erreur lors de l'enregistrement du document en base", {
                message: dbError.message,
                stack: dbError.stack,
                ...dbError
            });

            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'enregistrement du document en base",
                error: dbError.message,
                stack: dbError.stack,
                details: dbError // ⚠️ À désactiver en production
            });
        }

    } catch (error) {
        logger.error("Erreur interne dans addDocumentToContrat", {
            message: error.message,
            stack: error.stack,
            ...error
        });

        return res.status(500).json({
            success: false,
            message: "Erreur interne",
            error: error.message,
            stack: error.stack,
            details: error // ⚠️ À désactiver en production
        });
    }
};

const getAllContrats = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await contratService.getContrats(page, limit);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Erreur récupération contrats", {
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code,
                name: error.name,
                ...error
            },
            route: req.originalUrl,
            params: req.params,
            body: req.body,
            query: req.query
        });
        res.status(500).json({
            message: "Erreur récupération contrats",
            details: {
                message: error.message,
                stack: error.stack,
                code: error.code,
                name: error.name,
                params: req.params,
                body: req.body,
                query: req.query
            }
        });
    }
};

const getContratsByPartenaire = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID partenaire requis" });
        }
        const data = await contratService.getContratsbyPartenaire(id);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Aucun contrat trouvé pour ce partenaire." });
        }
        res.status(200).json(data);
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
        const { page = 1, limit = 10 } = req.query;
        logger.info(`Recherche des contrats par type: ${type}`);
        if (!type) {
            logger.warn("Type de contrat non spécifié");
            return res.status(400).json({ message: "Le type de contrat est requis." });
        }
        const result = await contratService.getContratByType(type, page, limit);
        if (!Array.isArray(result.data)) {
            logger.error("Le service getContratByType n'a pas retourné un tableau");
            return res.status(500).json({
                message: "Données invalides retournées par le service de contrat.",
                details: "Le résultat n'est pas un tableau"
            });
        }
        if (result.data.length === 0) {
            logger.info(`Aucun contrat trouvé pour le type: ${type}`);
            return res.status(404).json({ 
                message: "Aucun contrat trouvé pour ce type.",
                details: `Type recherché: ${type}` 
            });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des contrats de type ${req.params.type}` , {
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
        // Validation douce du champ id_entite
        if (typeof updateData.id_entite !== 'undefined' && isNaN(parseInt(updateData.id_entite))) {
            return res.status(400).json({ message: "id_entite doit être un entier si fourni." });
        }
        updateData.updated_at = new Date();
        if (updateData.id_partenaire) updateData.id_partenaire = parseInt(updateData.id_partenaire);
        if (updateData.id_entite) updateData.id_entite = parseInt(updateData.id_entite);
        // Ajout des nouveaux champs (ils seront présents si envoyés dans le body)
        if (req.body.nom_interlocuteur !== undefined) updateData.nom_interlocuteur = req.body.nom_interlocuteur;
        if (req.body.contact_interlocuteur !== undefined) updateData.contact_interlocuteur = req.body.contact_interlocuteur;
        if (req.body.contenu_contrat !== undefined) updateData.contenu_contrat = req.body.contenu_contrat;
        if (req.body.cout !== undefined) updateData.cout = req.body.cout;
        if (req.body.modalite_paiement !== undefined) updateData.modalite_paiement = req.body.modalite_paiement;

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

        // Récupérer et supprimer les documents liés
        const documents = await contratService.getDocumentByContrat(id);
        if (documents && documents.length > 0) {
            for (const doc of documents) {
                if (doc.lien_document) {
                    await safeUnlink(doc.lien_document).catch(() => {});
                }
            }
        }
        await contratService.deleteDocumentsByContrat(id);

        // Supprimer le contrat
        const deleted = await contratService.deleteContrat(id);
        if (!deleted) {
            return res.status(500).json({ message: "Échec suppression du contrat." });
        }

        res.status(200).json({ 
            message: "Suppression réussie.",
            documentsSupprimes: documents ? documents.length : 0
        });

    } catch (e) {
        res.status(500).json({ message: "Erreur lors de la suppression du contrat." });
    }
};

const deleteDocumentById = async (req, res) => {
  try {
    logger.info("Paramètres reçus pour suppression document", {
      params: req.params,
      body: req.body,
      query: req.query
    });

    const { id, docId } = req.params;
    const contratId = parseInt(id);
    const documentId = parseInt(docId);

    if (isNaN(contratId) || isNaN(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID de contrat ou de document invalide",
      });
    }

    const documents = await contratService.getDocumentById(documentId);
    const document = Array.isArray(documents) ? documents[0] : documents;
    logger.info("Document récupéré pour suppression", { document });

    if (!document || document.id_contrat !== contratId) {
      return res.status(404).json({
        success: false,
        message: "Document non trouvé ou n'appartenant pas à ce contrat",
      });
    }

    await contratService.deleteDocumentById(documentId);

    // Supprimer le fichier physique (si lien_document est défini)
    if (document.lien_document) {
      await safeUnlink(document.lien_document);
    }

    return res.status(200).json({
      success: true,
      message: "Document supprimé avec succès",
      data: {
        contrat_id: contratId,
        document_id: documentId,
      },
    });

  } catch (error) {
    logger?.error("Erreur suppression document", { error });
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      details: error.message,
    });
  }
};

const getContratsByEntite = async (req, res) => {
    try {
        const { id_entite } = req.params;
        if (!id_entite) {
            return res.status(400).json({ message: "ID entité requis" });
        }
        const contrats = await contratService.getContratsByEntite(id_entite);
        if (!contrats || contrats.length === 0) {
            return res.status(404).json({ message: "Aucun contrat trouvé pour cette entité." });
        }
        res.status(200).json({
            success: true,
            count: contrats.length,
            data: contrats
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur récupération contrats entité", details: error.message });
    }
};

const getContratsPartenairesSansEntite = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await contratService.getContratsPartenairesSansEntite(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des contrats des partenaires sans entité",
      details: error.message
    });
  }
};


module.exports = {
    createContrat,
    getAllContrats,
    getContratsByPartenaire,
    getContratById,
    getContratByType,
    updateContrat,
    deleteContrat,
    deleteDocumentById,
    addDocumentToContrat,
    getContratsByEntite,
    getContratsPartenairesSansEntite
};
