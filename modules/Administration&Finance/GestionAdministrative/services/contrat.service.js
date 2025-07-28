const {eq, sql} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {contrats,documents} = require("../../../../core/database/models")
const {partenaires,entites} = require("../../../../core/database/models")

const createContrat=async(data)=>{
    const [result]=await db
    .insert(contrats)
    .values(data)
    .returning()
    return result
};

const addDocumentTocontrat=async(data)=>{
    const [result]=await db
    .insert(documents)
    .values(data)
    .returning()
    return result
};

const getContrats = async (page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNumber - 1) * pageSize;

    const data = await db
        .select()
        .from(contrats)
        .limit(pageSize)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(contrats);

    return {
        data,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total: Number(count),
            totalPages: Math.ceil(Number(count) / pageSize)
        }
    };
};

const getContratsbyPartenaire = async (id) => {
    const data = await db
        .select()
        .from(contrats)
        .where(eq(contrats.id_partenaire, id));
    return data;
};

const getContratById=async(id)=>{
    const [result]=await db
    .select()
    .from(contrats)
    .where(eq(contrats.id_contrat,id))
    return result
};

const getContratByType = async (type, page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNumber - 1) * pageSize;

    // Recherche partielle avec LIKE et wildcards
    const searchPattern = `%${type.toLowerCase()}%`;

    const data = await db
        .select()
        .from(contrats)
        .where(sql`LOWER(${contrats.type_de_contrat}) LIKE ${searchPattern}`)
        .limit(pageSize)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(contrats)
        .where(sql`LOWER(${contrats.type_de_contrat}) LIKE ${searchPattern}`);

    return {
        data,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total: Number(count),
            totalPages: Math.ceil(Number(count) / pageSize)
        }
    };
};


const getDocumentByContrat=async(id_contrat)=>{
    const result =await db
    .select()
    .from(documents)
    .where(eq(documents.id_contrat,id_contrat))
    return result
};

const getDocumentById=async(id)=>{
    const [result] = await db
        .select()
        .from(documents)
        .where(eq(documents.id_documents, id)); // <-- clé primaire correcte
    return result;
};


const updateContrat=async(id,data)=>{
    const [result]=await db
    .update(contrats)
    .set({...data ,updated_at:new Date()})
    .where(eq(contrats.id_contrat,id)).returning()
    return result
};

const deleteContrat=async(id)=>{
    const [result]=await db
    .delete(contrats)
    .where(eq(contrats.id_contrat,id))
    .returning()
    return result
};

const deleteDocumentsByContrat = async (id_contrat) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_contrat, id_contrat))
        .returning();
    return result;
};

const deleteDocumentById = async (id) => {
    const result = await db
        .delete(documents)
        .where(eq(documents.id_documents, id)) // <-- clé primaire correcte
        .returning();
    return result;
};

const getContratsByEntite=async(id_entite)=>{
    return await db
        .select()
        .from(contrats)
        .where(eq(contrats.id_entite, id_entite));
};

const getContratsPartenairesSansEntite = async (page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNumber - 1) * pageSize;

    const data = await db
        .select()
        .from(contrats)
        .innerJoin(partenaires, eq(contrats.id_partenaire, partenaires.id_partenaire))
        .leftJoin(entites, eq(partenaires.id_partenaire, entites.id_partenaire))
        .where(sql`${entites.id_entite} IS NULL`)
        .limit(pageSize)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(contrats)
        .innerJoin(partenaires, eq(contrats.id_partenaire, partenaires.id_partenaire))
        .leftJoin(entites, eq(partenaires.id_partenaire, entites.id_partenaire))
        .where(sql`${entites.id_entite} IS NULL`);

    return {
        data,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total: Number(count),
            totalPages: Math.ceil(Number(count) / pageSize)
        }
    };
};

module.exports = {
    createContrat,
    getContrats,
    getContratsbyPartenaire,
    updateContrat,
    deleteContrat,
    addDocumentTocontrat,
    getContratById,
    getDocumentByContrat,
    getContratByType,
    deleteDocumentsByContrat,
    getDocumentById,
    deleteDocumentById,
    getContratsByEntite,
    getContratsPartenairesSansEntite
}