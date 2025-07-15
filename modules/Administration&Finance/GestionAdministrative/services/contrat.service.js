const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {contrats,documents} = require("../../../../core/database/models")

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

const getContrats=async()=>{
    return await db
    .select()
    .from(contrats);
};

const getContratsbyPartenaire=async(id)=>{
    const result = await db
    .select()
    .from(contrats)
    .where(eq(contrats.id_partenaire,id))
    return result
};

const getContratById=async(id)=>{
    const [result]=await db
    .select()
    .from(contrats)
    .where(eq(contrats.id_contrat,id))
    return result
};

const getContratByType = async (type) => {
    const result = await db
        .select()
        .from(contrats)
        .where(eq(contrats.type_de_contrat, type));
    return result; // <-- on ne fait plus [result], on garde tout
};


const getDocumentByContrat=async(id_contrat)=>{
    const result =await db
    .select()
    .from(documents)
    .where(eq(documents.id_contrat,id_contrat))
    return result
};

const getDocumentById=async(id)=>{
    const [result]=await db
    .select()
    .from(documents)
    .where(eq(documents.id_document,id))
    return result
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

const deleteDocumentsByContrat=async(id_contrat)=>{
    const [result]=await db
    .delete(documents)
    .where(eq(documents.id_contrat,id_contrat))
    .returning()
    return result
};

const deleteDocumentById = async (id) => {
  return await db
    .delete(documents)
    .where(eq(documents.id_documents, id))
    .returning();
};

module.exports={
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
    deleteDocumentById,
    getDocumentById
}