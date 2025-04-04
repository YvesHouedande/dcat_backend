const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { marque } = require("../../../core/database/models");

const createMarque=async(data)=>{
    const [result]=await db.insert(marque).values(data).returning()
    return result
}

const getMarques=async()=>{
    return await db.select().from(marque);

}

const getMarqueById=async(id)=>{
    const [result]=await db.select().from(marque).where(eq(marque.id,id))
    return result
}

const updateMarque=async(id,data)=>{
    const [result]=await db.update(marque).set(data).where(eq(marque.id,id)).returning()
    return result
}

const deleteMarque=async(id)=>{
    const [result]=await db.delete(marque).where(eq(marque.id,id)).returning()
    return result
}

module.exports={
    createMarque,
    getMarques, 
    getMarqueById,
    updateMarque,
    deleteMarque
}