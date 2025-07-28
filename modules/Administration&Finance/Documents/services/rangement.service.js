const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {dossiers,documents} = require("../../../../core/database/models");


const getDossiers = async () => {
    return await db.select().from(dossiers);
}

const getDossierById = async (id) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    return result;
}

const getDossierByLibelleAndType = async (libelle, type) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(
            eq(dossiers.libelle_dossier, libelle),
            eq(dossiers.type_dossier, type)
        );
    return result;
}

const getDossierByLibelle = async (libelle) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.libelle_dossier, libelle));
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

const getDossiersByTypeAndLibelle = async (type, libelle = "") => {
    if (libelle === "" || !libelle) {
        // Si libellé n'est pas fourni, on récupère tous les dossiers du type
        return await db.select().from(dossiers).where(eq(dossiers.type_dossier, type));
    } else {
        // Si libellé est fourni, on filtre par type et libellé
        return await db.select().from(dossiers).where(
            eq(dossiers.type_dossier, type),
            eq(dossiers.libelle_dossier, libelle)
        );
    }
}

const getDocumentsByDossierIdAndLibelle = async (id, libelle = "") => {
    // Vérifier d'abord que le dossier existe
    const [dossier] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    
    if (!dossier) return null;
    
    // Récupérer les documents selon le libellé
    if (libelle === "" || !libelle) {
        // Si libellé n'est pas fourni, récupérer tous les documents du dossier
        const docs = await db.select().from(documents).where(eq(documents.id_dossier, id));
        return { dossier, documents: docs };
    } else {
        // Si libellé est fourni, filtrer par libellé du document
        const docs = await db.select().from(documents).where(
            eq(documents.id_dossier, id),
            eq(documents.libelle_document, libelle)
        );
        return { dossier, documents: docs };
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
    createDocument
};