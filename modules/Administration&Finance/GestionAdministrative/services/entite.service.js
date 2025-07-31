const { eq } = require("drizzle-orm");
const { db } = require("../../../../core/database/config");
const { entites, partenaires } = require("../../../../core/database/models");

const createEntite = async (data) => {
    try {
        // Validation des données d'entrée
        if (!data.nom_entite || typeof data.nom_entite !== 'string') {
            throw new Error("Le nom de l'entité est requis et doit être une chaîne de caractères");
        }

        // Validation de l'id_partenaire s'il est fourni
        if (data.id_partenaire !== undefined) {
            if (isNaN(parseInt(data.id_partenaire))) {
                throw new Error("id_partenaire doit être un entier valide");
            }
            
            // Vérifier si le partenaire existe
            const partenaire = await db
                .select()
                .from(partenaires)
                .where(eq(partenaires.id_partenaire, parseInt(data.id_partenaire)))
                .limit(1);
            
            if (partenaire.length === 0) {
                throw new Error("Le partenaire spécifié n'existe pas");
            }
        }

        const [result] = await db
            .insert(entites)
            .values({
                ...data,
                created_at: new Date(),
                updated_at: new Date()
            })
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
            .orderBy(entites.nom_entite);
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
        if (data.nom_entite !== undefined && typeof data.nom_entite !== 'string') {
            throw new Error("Le nom de l'entité doit être une chaîne de caractères");
        }

        // Validation de l'id_partenaire s'il est fourni
        if (data.id_partenaire !== undefined) {
            if (isNaN(parseInt(data.id_partenaire))) {
                throw new Error("id_partenaire doit être un entier valide");
            }
            
            // Vérifier si le partenaire existe
            const partenaire = await db
                .select()
                .from(partenaires)
                .where(eq(partenaires.id_partenaire, parseInt(data.id_partenaire)))
                .limit(1);
            
            if (partenaire.length === 0) {
                throw new Error("Le partenaire spécifié n'existe pas");
            }
        }

        const [result] = await db
            .update(entites)
            .set({
                ...data,
                updated_at: new Date()
            })
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
            .orderBy(entites.nom_entite);
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
