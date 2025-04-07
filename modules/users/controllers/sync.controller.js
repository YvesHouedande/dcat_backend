const { db } = require('../../../core/database/config');
const { employes, fonction } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');
const logger = require('../../../core/utils/logger');

module.exports = {
  syncUser: async (req, res) => {
    const token = req.kauth.grant.access_token;
    const { email, firstName, lastName } = req.body;

    // Validation email/token
    if (!token?.content?.email || !email) {
      logger.warn('Token ou email manquant', { token, email });
      return res.status(400).json({ error: "Token ou email invalide" });
    }

    if (token.content.email !== email) {
      logger.warn('Incohérence email/token', {
        tokenEmail: token.content.email,
        providedEmail: email,
        userId: token.content.sub
      });
      return res.status(400).json({ error: "Email ne correspond pas au token" });
    }

        // Validation du token
    if (!token.content.email_verified) {
      return res.status(403).json({ 
        error: "Unverified email",
        action: "complete_account_setup",
        login_url: `http://keycloak:8080/auth/realms/your-realm/protocol/openid-connect/auth?client_id=frontend-client&redirect_uri=${encodeURIComponent('http://localhost:3000')}&response_type=code`
      });
    }

    try {
      // Récupération de l'ID de la fonction Technicien
      const technicien = await db.select()
        .from(fonction)
        .where(eq(fonction.nom, 'Technicien'))
        .limit(1);
      console.log("Résultat recherche Technicien:", technicien);

      if (!technicien || technicien.length === 0) {
        throw new Error('La fonction Technicien n\'existe pas en base');
      }

      const fonctionId = technicien[0].id;

      // Données utilisateur
      const userData = {
        keycloak_id: token.content.sub,
        email: token.content.email,
        nom: lastName || token.content.family_name || 'Non spécifié',
        prenom: firstName || token.content.given_name || 'Non spécifié',
        status: 'actif',
        fonctionId: fonctionId,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Upsert
      await db.insert(employes)
        .values(userData)
        .onConflictDoUpdate({
          target: employes.keycloak_id,
          set: {
            email: userData.email,
            nom: userData.nom,
            prenom: userData.prenom,
            fonctionId: fonctionId,
            updated_at: userData.updated_at
          }
        });

      res.status(204).end();
    } catch (error) {
      logger.error('Erreur de synchronisation', {
        error: error.message,
        userId: token.content.sub,
        email: token.content.email
      });

      if (error.message.includes('Technicien')) {
        res.status(400).json({ 
          error: "Configuration manquante",
          details: "La fonction Technicien doit être créée en base de données"
        });
      } else {
        res.status(500).json({ 
          error: "Échec de la synchronisation",
          details: error.message
        });
      }
    }
  }
};