const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require("../../../core/database/models");
const bcrypt = require('bcryptjs');
const { eq, or } = require("drizzle-orm");

const clientsService = {
  
  login: async ({ identifiant, password }) => {
    // Validation des champs
    if (!identifiant || !password) {
      throw new Error("L'identifiant et le mot de passe sont requis");
    }

    const user = await db.select().from(clients_en_ligne)
      .where(
        or(
          eq(clients_en_ligne.email, identifiant),
          eq(clients_en_ligne.contact, identifiant)
        )
      ).limit(1);

    if (user.length === 0) {
      throw new Error("Aucun compte trouvé avec cet identifiant");
    }

    const passwordOk = await bcrypt.compare(password, user[0].password);
    if (!passwordOk) {
      throw new Error("Mot de passe incorrect");
    }

    return { client: user[0], passwordOk };
  },
  
  // Inscription d'un client
  register: async ({ nom, email, contact, password }) => {
    const exist = await db.select().from(clients_en_ligne).where(eq(clients_en_ligne.email, email)).limit(1);
    
    if (exist.length > 0) throw new Error("Email déjà utilisé");

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(clients_en_ligne).values({
      nom: nom,
      email: email,
      contact: contact,
      password: hashedPassword,
      role: "client",
    });

    return { message: "Inscription réussie" };
  }
};

module.exports = clientsService;