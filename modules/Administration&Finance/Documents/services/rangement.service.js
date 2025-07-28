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

const getDossierByType = async (type) => {
    return await db.select().from(dossiers).where(eq(dossiers.type_dossier, type));
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

const deleteDocumentById = async (id) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_documents, id))
        .returning();
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

const getDocumentsByDossierFullParams = async (id, libelle, type) => {
    // On vérifie d'abord que le dossier existe avec ces trois paramètres
    const [dossier] = await db
        .select()
        .from(dossiers)
        .where(
            eq(dossiers.id_dossier, id),
            eq(dossiers.libelle_dossier, libelle),
            eq(dossiers.type_dossier, type)
        );
    if (!dossier) return null;
    // On récupère les documents liés à ce dossier
    const docs = await db.select().from(documents).where(eq(documents.id_dossier, id));
    return { dossier, documents: docs };
}

module.exports = {
    getDossiers,
    getDossierById,
    createDossier,
    updateDossier,
    deleteDossier,
    deleteDocumentByDossier,
    deleteDocumentById,
    getDossierByType,
    getDossierByLibelleAndType,
    getDocumentsByDossierFullParams
};