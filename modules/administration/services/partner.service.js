const { eq } = require("drizzle-orm");
const {db} = require("../utils/drizzle-wrapper")
const {partenaire} = require("../../../core/database/models")


const createPartner = async (partner) => {
    const newPartner = await db.insert(partenaire).values(partner).returning();
    return newPartner;
}

const getAllPartners = async () => {
    const partners = await db.select().from(partenaire);
    return partners;
}

const getPartner = async (id) => {
    const partner = await db.select().from(partenaire).where(eq(partenaire.id, id));
    return partner;
}

const updatePartner = async (id, partner) => {
    const updatedPartner = await db.update(partenaire).set(partner).where(eq(partenaire.id, id));
    return updatedPartner;
}

const deletePartner = async (id) => {
    const deletedPartner = await db.delete(partenaire).where(eq(partenaire.id, id));
    return deletedPartner;
}


module.exports = {
    createPartner,
    getAllPartners,
    getPartner,
    updatePartner,
    deletePartner
}











