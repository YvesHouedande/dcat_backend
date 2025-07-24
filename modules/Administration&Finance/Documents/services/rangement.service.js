const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {dossiers,documents} = require("../../../../core/database/models");


const getDossiers = async (options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const [totalResult] = await db.select({ count: db.fn.count() }).from(dossiers);
    const total = Number(totalResult.count);
    const data = await db
        .select()
        .from(dossiers)
        .limit(limit)
        .offset(offset);
    return { data, total };
}

const getDossierById = async (id) => {
    const [result] = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.id_dossier, id));
    return result;
}

const getdocumentsBydossier = async (id, options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const [totalResult] = await db
        .select({ count: db.fn.count() })
        .from(documents)
        .where(eq(documents.id_dossier, id));
    const total = Number(totalResult.count);
    const documentsList = await db
        .select()
        .from(documents)
        .where(eq(documents.id_dossier, id))
        .limit(limit)
        .offset(offset);
    return { documents: documentsList, total };
}

const getDossierByType = async (type, options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const [totalResult] = await db
        .select({ count: db.fn.count() })
        .from(dossiers)
        .where(eq(dossiers.type_dossier, type));
    const total = Number(totalResult.count);
    const data = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.type_dossier, type))
        .limit(limit)
        .offset(offset);
    return { data, total };
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