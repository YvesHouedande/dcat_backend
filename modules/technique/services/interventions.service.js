const { eq, and } = require("drizzle-orm");
const { db } = require('../../../core/database/config');
const { interventions, intervention_employes, employes, intervention_taches } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createIntervention = async (data) => {
  const [result] = await db.insert(interventions).values(data).returning();
  return result;
};

const getInterventions = async () => {
  return await db.select().from(interventions);
};

const getInterventionById = async (id) => {
  const [result] = await db.select().from(interventions).where(eq(interventions.id_intervention, id));
  return result;
};

const getInterventionsByTache = async (tacheId) => {
  return await db
    .select({
      intervention: interventions
    })
    .from(intervention_taches)
    .innerJoin(interventions, eq(intervention_taches.id_intervention, interventions.id_intervention))
    .where(eq(intervention_taches.id_tache, tacheId))
    .then(results => results.map(r => r.intervention));
};

const updateIntervention = async (id, data) => {
  const [result] = await db
    .update(interventions)
    .set({
      ...data,
      updated_at: new Date() // Mettre à jour la date de modification
    })
    .where(eq(interventions.id_intervention, id))
    .returning();
  return result;
};

const deleteIntervention = async (id) => {
  const [result] = await db
    .delete(interventions)
    .where(eq(interventions.id_intervention, id))
    .returning();
  return result;
};

const assignEmployeToIntervention = async (interventionId, employeId) => {
  const [result] = await db
    .insert(intervention_employes)
    .values({
      id_intervention: interventionId,
      id_employes: employeId
    })
    .returning();
  return result;
};

const removeEmployeFromIntervention = async (interventionId, employeId) => {
  return await db
    .delete(intervention_employes)
    .where(
      and(
        eq(intervention_employes.id_intervention, interventionId),
        eq(intervention_employes.id_employes, employeId)
      )
    );
};

const getEmployesByIntervention = async (interventionId) => {
  return await db
    .select({
      employe: employes
    })
    .from(intervention_employes)
    .innerJoin(employes, eq(intervention_employes.id_employes, employes.id_employes))
    .where(eq(intervention_employes.id_intervention, interventionId))
    .then(results => results.map(r => r.employe));
};

module.exports = {
  createIntervention,
  getInterventions,
  getInterventionById,
  getInterventionsByTache,
  updateIntervention,
  deleteIntervention,
  assignEmployeToIntervention,
  removeEmployeFromIntervention,
  getEmployesByIntervention
};
