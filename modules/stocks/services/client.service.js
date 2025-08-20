const { eq } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { clients_en_ligne } = require("../../../core/database/models");


const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // 10 est un bon équilibre sécurité/perf


// CRUD complet avec Drizzle
const createClient = async (data) => {
  // 1. Hasher le mot de passe AVANT insertion
  const hash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const [result] = await db
    .insert(clients_en_ligne)
    .values({
      ...data,
      password: hash,      // on stocke le hash
    })
    .returning({
      id: clients_en_ligne.id_client,
      nom: clients_en_ligne.nom,
      role: clients_en_ligne.role,
      email: clients_en_ligne.email,
      contact: clients_en_ligne.contact,
    });

  return result;
};

const getClients = async () => {
  return await db
    .select({
      id: clients_en_ligne.id_client,
      nom: clients_en_ligne.nom,
      role: clients_en_ligne.role,
      email: clients_en_ligne.email,
      contact: clients_en_ligne.contact,
    })
    .from(clients_en_ligne);
};

const getClientById = async (id) => {
  const [result] = await db
    .select({
      id: clients_en_ligne.id_client,
      nom: clients_en_ligne.nom,
      role: clients_en_ligne.role,
      email: clients_en_ligne.email,
      contact: clients_en_ligne.contact,
    })
    .from(clients_en_ligne)
    .where(eq(clients_en_ligne.id_client, id));
  return result;
};

const updateClient = async (id, data) => {
  const [result] = await db
    .update(clients_en_ligne)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(clients_en_ligne.id_client, id))
    .returning();
  return result;
};

const deleteClient = async (id) => {
  const [result] = await db
    .delete(clients_en_ligne)
    .where(eq(clients_en_ligne.id_client, id))
    .returning();
  return result;
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};
