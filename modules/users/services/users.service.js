const { db } = require('../../../core/database/config');
const { employes } = require('../../../core/database/models');

module.exports = {
  getAllUsers: async () => {
    return await db.select().from(employes);
  },
  
  createUser: async (userData) => {
    const [newUser] = await db.insert(employes)
      .values(userData)
      .returning();
    return newUser;
  },
  
  syncUser: async (keycloakId, userData) => {
    const [user, created] = await db.transaction(async (tx) => {
      const existing = await tx.select()
        .from(employes)
        .where(eq(employes.keycloak_id, keycloakId));
      
      if (existing.length > 0) {
        const [updated] = await tx.update(employes)
          .set(userData)
          .where(eq(employes.keycloak_id, keycloakId))
          .returning();
        return [updated, false];
      } else {
        const [created] = await tx.insert(employes)
          .values({ ...userData, keycloak_id: keycloakId })
          .returning();
        return [created, true];
      }
    });
    
    return { user, created };
  }
};