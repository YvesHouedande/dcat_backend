const { eq } = require("drizzle-orm");
const { db } = require("../../../../core/database/config");
const { entites, partenaires } = require("../../../../core/database/models");

const createEntite = async (data) => {
    try {
        // Validation des données d'entrée
        if (!data.denomination || typeof data.denomination !== 'string') {
            throw new Error("Le nom de l'entité (denomination) est requis et doit être une chaîne de caractères");
        }

        // Préparer les données d'insertion
        // Filtrer les champs qui ne doivent pas être définis par l'utilisateur
        const { id_entite, created_at, updated_at, ...allowedFields } = data;
        const insertData = { ...allowedFields, created_at: new Date(), updated_at: new Date() };

        // Validation de l'id_partenaire s'il est fourni
        if (allowedFields.id_partenaire !== undefined) {
            // Si id_partenaire est null, undefined ou une chaîne vide, on le définit comme null
            if (allowedFields.id_partenaire === null || allowedFields.id_partenaire === undefined || allowedFields.id_partenaire === '') {
                insertData.id_partenaire = null;
            } else {
                if (isNaN(parseInt(allowedFields.id_partenaire))) {
                    throw new Error("id_partenaire doit être un entier valide");
                }
                
                // Vérifier si le partenaire existe
                const partenaire = await db
                    .select()
                    .from(partenaires)
                    .where(eq(partenaires.id_partenaire, parseInt(allowedFields.id_partenaire)))
                    .limit(1);
                
                if (partenaire.length === 0) {
                    throw new Error("Le partenaire spécifié n'existe pas");
                }
                
                insertData.id_partenaire = parseInt(allowedFields.id_partenaire);
            }
        }

        const [result] = await db
            .insert(entites)
            .values(insertData)
            .returning();
        
        return result;
    } catch (error) {
        console.error("Erreur lors de la création de l'entité:", error);
        throw error;
    }
};

const getEntites = async () => {
    try {
        return await db
            .select()
            .from(entites)
            .orderBy(entites.denomination);
    } catch (error) {
        console.error("Erreur lors de la récupération des entités:", error);
        throw error;
    }
};

const getEntiteById = async (id) => {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID d'entité invalide");
        }

        const [result] = await db
            .select()
            .from(entites)
            .where(eq(entites.id_entite, parseInt(id)));
        
        return result;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'entité par ID:", error);
        throw error;
    }
};

const updateEntite = async (id, data) => {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID d'entité invalide");
        }

        // Validation des données d'entrée
        if (allowedFields.denomination !== undefined && typeof allowedFields.denomination !== 'string') {
            throw new Error("Le nom de l'entité (denomination) doit être une chaîne de caractères");
        }

        // Préparer les données de mise à jour
        // Filtrer les champs qui ne doivent pas être modifiés par l'utilisateur
        const { id_entite, created_at, updated_at, ...allowedFields } = data;
        const updateData = { ...allowedFields, updated_at: new Date() };

        // Validation de l'id_partenaire s'il est fourni
        if (allowedFields.id_partenaire !== undefined) {
            // Si id_partenaire est null, undefined ou une chaîne vide, on le définit comme null
            if (allowedFields.id_partenaire === null || allowedFields.id_partenaire === undefined || allowedFields.id_partenaire === '') {
                updateData.id_partenaire = null;
            } else {
                if (isNaN(parseInt(allowedFields.id_partenaire))) {
                    throw new Error("id_partenaire doit être un entier valide");
                }
                
                // Vérifier si le partenaire existe
                const partenaire = await db
                    .select()
                    .from(partenaires)
                    .where(eq(partenaires.id_partenaire, parseInt(allowedFields.id_partenaire)))
                    .limit(1);
                
                if (partenaire.length === 0) {
                    throw new Error("Le partenaire spécifié n'existe pas");
                }
                
                updateData.id_partenaire = parseInt(allowedFields.id_partenaire);
            }
        }

        const [result] = await db
            .update(entites)
            .set(updateData)
            .where(eq(entites.id_entite, parseInt(id)))
            .returning();
        
        return result;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'entité:", error);
        throw error;
    }
};

const deleteEntite = async (id) => {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID d'entité invalide");
        }

        const [result] = await db
            .delete(entites)
            .where(eq(entites.id_entite, parseInt(id)))
            .returning();
        
        return result;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'entité:", error);
        throw error;
    }
};

const getEntitesByPartenaire = async (id_partenaire) => {
    try {
        if (!id_partenaire || isNaN(parseInt(id_partenaire))) {
            throw new Error("ID de partenaire invalide");
        }

        return await db
            .select()
            .from(entites)
            .where(eq(entites.id_partenaire, parseInt(id_partenaire)))
            .orderBy(entites.denomination);
    } catch (error) {
        console.error("Erreur lors de la récupération des entités par partenaire:", error);
        throw error;
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
