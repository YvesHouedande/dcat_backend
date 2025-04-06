const { db } = require('../../../core/database/config');
const { employes } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');
const logger = require('../../../core/utils/logger');

module.exports = {
  /**
   * Synchronisation utilisateur
   */
  syncUser: async (req, res) => {
    const token = req.kauth.grant.access_token;
    const { email, firstName, lastName } = req.body;

    if (token.content.email !== email) {
      logger.warn('Incohérence email/token', {
        tokenEmail: token.content.email,
        providedEmail: email
      });
      return res.status(400).json({ error: "Email ne correspond pas au token" });
    }

    try {
      const result = await db.insert(employes)
        .values({
          keycloak_id: token.content.sub,
          email: token.content.email,
          nom: token.content.given_name || firstName,
          prenom: token.content.family_name || lastName,
          status: 'actif',
          fonctionId: 1
        })
        .onConflictDoUpdate({
          target: employes.keycloak_id,
          set: {
            email: token.content.email,
            nom: token.content.given_name || firstName,
            prenom: token.content.family_name || lastName,
            updated_at: new Date()
          }
        });

      res.status(204).end();
    } catch (error) {
      logger.error('Erreur de synchronisation', {
        error: error.message,
        userId: token.content.sub
      });
      res.status(500).json({ error: "Échec de la synchronisation" });
    }
  }
};