const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {employes} = require("../../../../core/database/models");


const getEmployes = async () => {
    return await db
    .select()
    .from(employes);
}

const getEmployeById = async (id) => {
    const [result] = await db
    .select()
    .from(employes)
    .where(eq(employes.id_employe, id));
    return result;
}

const getEmployeByFonction = async (id) => {
    const result = await db
    .select()
    .from(employes)
    .where(eq(employes.id_fonction, id));
    return result;
}


const getEmployeByStatut = async (statut) => {
    const result = await db
    .select()
    .from(employes)
    .where(eq(employes.status_employes, statut));
    return result;
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

module.exports = {
    getEmployes,
    getEmployeById,
    getEmployeByFonction,
    getEmployeByStatut,
    updateEmploye
}

