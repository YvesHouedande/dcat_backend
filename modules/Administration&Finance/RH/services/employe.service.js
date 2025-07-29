const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {employes, documents, nature_documents} = require("../../../../core/database/models");
const { sql } = require("drizzle-orm");


const getEmployes = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const data = await db
        .select()
        .from(employes)
        .limit(limit)
        .offset(offset);
    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(employes);
    return {
        data,
        pagination: {
            total: Number(count),
            page,
            limit,
            totalPages: Math.ceil(Number(count) / limit)
        }
    };
}

const getEmployeById = async (id) => {
    const [result] = await db
    .select()
    .from(employes)
    .where(eq(employes.id_employes, id));
    return result;
}

const employesByEmail = async (email) => {
    const [result] = await db
    .select()
    .from(employes)
    .where(eq(employes.email_employes, email));
    return result;
}


const getEmployeByFonction = async (id) => {
    const result = await db
    .select()
    .from(employes)
    .where(eq(employes.id_fonction, id));
    return result;
}


const getEmployeByStatut = async (statut, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const data = await db
        .select()
        .from(employes)
        .where(eq(employes.status_employes, statut))
        .limit(limit)
        .offset(offset);
    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(employes)
        .where(eq(employes.status_employes, statut));
    return {
        data,
        pagination: {
            total: Number(count),
            page,
            limit,
            totalPages: Math.ceil(Number(count) / limit)
        }
    };
}

const updateEmploye = async (id, data) => {
    if (!data || Object.keys(data).length === 0) return null;
    const [result] = await db
        .update(employes)
        .set({...data, updated_at: new Date()})
        .where(eq(employes.id_employes, id))
        .returning();
    return result;
}

const deleteEmploye = async (id) => {
    const [result] = await db
        .delete(employes)
        .where(eq(employes.id_employes, id))
        .returning();
    return result;
}

const getEmployeDocuments = async (id, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    // Récupérer les documents avec pagination
    const data = await db
        .select({
            id_documents: documents.id_documents,
            libelle_document: documents.libelle_document,
            date_document: documents.date_document,
            lien_document: documents.lien_document,
            etat_document: documents.etat_document,
            created_at: documents.created_at,
            updated_at: documents.updated_at,
            nature_document: nature_documents.libelle
        })
        .from(documents)
        .leftJoin(nature_documents, eq(documents.id_nature_document, nature_documents.id_nature_document))
        .where(eq(documents.id_employes, id))
        .limit(limit)
        .offset(offset);
    
    // Compter le total des documents
    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(documents)
        .where(eq(documents.id_employes, id));
    
    return {
        data,
        pagination: {
            total: Number(count),
            page,
            limit,
            totalPages: Math.ceil(Number(count) / limit)
        }
    };
}

module.exports = {
    getEmployes,
    getEmployeById,
    getEmployeByFonction,
    getEmployeByStatut,
    updateEmploye,
    deleteEmploye,
    getEmployeDocuments
}

