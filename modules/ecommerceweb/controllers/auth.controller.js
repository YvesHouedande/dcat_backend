const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

exports.syncUser = async (req, res) => {
  try {
    const { uid, email, nom, contact, photoURL } = req.body;

    // Vérifier si l'utilisateur existe via email
    const [existingUser] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, email))
      .limit(1);

    let client;
    
    if (existingUser) {
      // Mise à jour minimale (nom et contact si manquants)
      const updateData = {};
      if (!existingUser.nom && nom) updateData.nom = nom;
      if (!existingUser.contact && contact) updateData.contact = contact;

      if (Object.keys(updateData).length > 0) {
        [client] = await db.update(clients_en_ligne)
          .set(updateData)
          .where(eq(clients_en_ligne.id_client, existingUser.id_client))
          .returning();
      } else {
        client = existingUser;
      }
    } else {
      // Création nouveau client (sans mot de passe)
      [client] = await db.insert(clients_en_ligne)
        .values({
          email,
          nom: nom || email.split('@')[0], // Fallback si nom absent
          contact: contact || null,
          password: null,
          role: 'client'
        })
        .returning();
    }

    res.json({
      success: true,
      client: {
        id_client: client.id_client,
        email: client.email,
        nom: client.nom,
        contact: client.contact
      }
    });
  } catch (error) {
    console.error('Erreur syncUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur synchronisation client'
    });
  }
};