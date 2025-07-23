const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {dossiers,documents} = require("../../../../core/database/models");


const getDossiers = async () => {
    return await db
        .select()
        .from(dossiers);
}

const getDossierById = async (id) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    return result;
}

const getdocumentsBydossier = async (id) => {
    return await db
        .select()
        .from(documents)
        .where(eq(documents.id_dossier, id))
}

const getDossierByType = async (type) => {
    const result = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.type_dossier, type));
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

const deleteDocumentById = async (id) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_documents, id))
        .returning();
    return result;
}

module.exports = {
    getDossiers,
    getDossierById,
    getdocumentsBydossier,
    createDossier,
    updateDossier,
    deleteDossier,
    deleteDocumentByDossier,
    deleteDocumentById,
    getDossierByType
};