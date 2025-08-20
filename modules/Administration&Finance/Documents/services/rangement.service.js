const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {dossiers,documents} = require("../../../../core/database/models");


const getDossiers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    const [totalCount] = await db
        .select({ count: require("drizzle-orm").sql`count(*)` })
        .from(dossiers);
    
    const results = await db
        .select()
        .from(dossiers)
        .limit(limit)
        .offset(offset);
    
    return {
        data: results,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(totalCount.count),
            totalPages: Math.ceil(totalCount.count / limit)
        }
    };
}

const getDossierById = async (id) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    return result;
}

const getDossierByLibelleAndType = async (libelle, type) => {
    const { and, sql } = require("drizzle-orm");
    const [result] = await db
        .select()
        .from(dossiers)
        .where(
            and(
                sql`LOWER(${dossiers.libelle_dossier}) = LOWER(${libelle})`,
                sql`LOWER(${dossiers.type_dossier}) = LOWER(${type})`
            )
        );
    return result;
}

const getDossierByLibelle = async (libelle) => {
    const { sql } = require("drizzle-orm");
    const [result] = await db
        .select()
        .from(dossiers)
        .where(sql`LOWER(${dossiers.libelle_dossier}) = LOWER(${libelle})`);
    return result;
}

const createDossier = async (dossierData) => {
    const [result] = await db
        .insert(dossiers)
        .values(dossierData)
        .returning();
    return result;
}
const updateDossier = async (id, dossierData) => {
    const [result] = await db
        .update(dossiers)
        .set(dossierData)
        .where(eq(dossiers.id_dossier, id))
        .returning();
    return result;
}
const deleteDossier = async (id) => {
    const [result] = await db
        .delete(dossiers)
        .where(eq(dossiers.id_dossier, id))
        .returning();
    return result;
}

const deleteDocumentByDossier = async (id_dossier) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_dossier, id_dossier))
        .returning();
    return result;
}

const getDocumentsByDossier = async (id_dossier) => {
    const result = await db
        .select()
        .from(documents)
        .where(eq(documents.id_dossier, id_dossier));
    return result;
}

const deleteDocumentById = async (id) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_documents, id))
        .returning();
    return result;
}

const createDocument = async (documentData) => {
    // Vérifier d'abord que le dossier existe
    const [dossier] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, documentData.id_dossier));
    
    if (!dossier) {
        throw new Error("Dossier non trouvé");
    }
    
    const [result] = await db
        .insert(documents)
        .values(documentData)
        .returning();
    return result;
}

const getDossiersByTypeAndLibelle = async (type, libelle = "", page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    // Vérifier si libellé est undefined, null, ou une chaîne vide
    if (libelle === undefined || libelle === null || libelle === "" || libelle === "undefined") {
        // Si libellé n'est pas fourni, on récupère tous les dossiers du type (insensible à la casse)
        const { sql } = require("drizzle-orm");
        
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(dossiers)
            .where(sql`LOWER(${dossiers.type_dossier}) = LOWER(${type})`);
        
        const results = await db
            .select()
            .from(dossiers)
            .where(sql`LOWER(${dossiers.type_dossier}) = LOWER(${type})`)
            .limit(limit)
            .offset(offset);
        
        return {
            data: results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(totalCount.count),
                totalPages: Math.ceil(totalCount.count / limit)
            }
        };
    } else {
        // Si libellé est fourni, on filtre par type et libellé (recherche partielle insensible à la casse)
        const { and, sql } = require("drizzle-orm");
        
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(dossiers)
            .where(
                and(
                    sql`LOWER(${dossiers.type_dossier}) = LOWER(${type})`,
                    sql`LOWER(${dossiers.libelle_dossier}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            );
        
        const results = await db
            .select()
            .from(dossiers)
            .where(
                and(
                    sql`LOWER(${dossiers.type_dossier}) = LOWER(${type})`,
                    sql`LOWER(${dossiers.libelle_dossier}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            )
            .limit(limit)
            .offset(offset);
        
        return {
            data: results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(totalCount.count),
                totalPages: Math.ceil(totalCount.count / limit)
            }
        };
    }
}

const getDocumentsByDossierIdAndLibelle = async (id, libelle = "", page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    // Vérifier d'abord que le dossier existe
    const [dossier] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    
    if (!dossier) return null;
    
    // Récupérer les documents selon le libellé
    if (libelle === "" || !libelle) {
        // Si libellé n'est pas fourni, récupérer tous les documents du dossier
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(documents)
            .where(eq(documents.id_dossier, id));
        
        const docs = await db
            .select()
            .from(documents)
            .where(eq(documents.id_dossier, id))
            .limit(limit)
            .offset(offset);
        
        return { 
            dossier, 
            documents: {
                data: docs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(totalCount.count),
                    totalPages: Math.ceil(totalCount.count / limit)
                }
            }
        };
    } else {
        // Si libellé est fourni, filtrer par libellé du document (recherche partielle insensible à la casse)
        const { and, sql } = require("drizzle-orm");
        
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(documents)
            .where(
                and(
                    eq(documents.id_dossier, id),
                    sql`LOWER(${documents.libelle_document}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            );
        
        const docs = await db
            .select()
            .from(documents)
            .where(
                and(
                    eq(documents.id_dossier, id),
                    sql`LOWER(${documents.libelle_document}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            )
            .limit(limit)
            .offset(offset);
        
        return { 
            dossier, 
            documents: {
                data: docs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(totalCount.count),
                    totalPages: Math.ceil(totalCount.count / limit)
                }
            }
        };
    }
}

const getDocumentsIntervention = async (page = 1, limit = 10, libelle = "") => {
    const offset = (page - 1) * limit;
    const { isNotNull, and, sql } = require("drizzle-orm");
    
    // Si libellé est fourni, filtrer par libellé du document (recherche partielle insensible à la casse)
    if (libelle && libelle !== "" && libelle !== "undefined") {
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(documents)
            .where(
                and(
                    isNotNull(documents.id_intervention),
                    sql`LOWER(${documents.libelle_document}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            );
        
        const results = await db
            .select()
            .from(documents)
            .where(
                and(
                    isNotNull(documents.id_intervention),
                    sql`LOWER(${documents.libelle_document}) LIKE LOWER(${'%' + libelle + '%'})`
                )
            )
            .limit(limit)
            .offset(offset);
        
        return {
            data: results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(totalCount.count),
                totalPages: Math.ceil(totalCount.count / limit)
            }
        };
    } else {
        // Si libellé n'est pas fourni, récupérer tous les documents d'intervention
        const [totalCount] = await db
            .select({ count: require("drizzle-orm").sql`count(*)` })
            .from(documents)
            .where(isNotNull(documents.id_intervention));
        
        const results = await db
            .select()
            .from(documents)
            .where(isNotNull(documents.id_intervention))
            .limit(limit)
            .offset(offset);
        
        return {
            data: results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(totalCount.count),
                totalPages: Math.ceil(totalCount.count / limit)
            }
        };
    }
}

module.exports = {
    getDossiers,
    getDossierById,
    getDossierByLibelleAndType,
    getDossierByLibelle,
    createDossier,
    updateDossier,
    deleteDossier,
    deleteDocumentByDossier,
    getDocumentsByDossier,
    deleteDocumentById,
    getDossiersByTypeAndLibelle,
    getDocumentsByDossierIdAndLibelle,
    createDocument,
    getDocumentsIntervention
};