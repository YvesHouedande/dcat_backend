const { db } = require("../../../core/database/config");
const {
  clients_en_ligne,
  refresh_tokens,
} = require("../../../core/database/models");
const bcrypt = require("bcryptjs");
const { eq, or, and, sql } = require("drizzle-orm");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configuration de Nodemailer pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "node180-eu.n0c.com",
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "boutique@dcat.ci",
    pass: process.env.EMAIL_PASSWORD || "Dcat@2018!",
  },
});

const clientsService = {
  login: async ({ identifiant, password }) => {
    // Validation des champs
    if (!identifiant || !password) {
      throw new Error("L'identifiant et le mot de passe sont requis");
    }

    const user = await db
      .select()
      .from(clients_en_ligne)
      .where(
        or(
          eq(clients_en_ligne.email, identifiant),
          eq(clients_en_ligne.contact, identifiant)
        )
      )
      .limit(1);

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
    // Validation des champs requis
    if (!nom || !email || !contact || !password) {
      throw new Error("Tous les champs sont requis");
    }

    // Validation du format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Format d'email invalide");
    }

    // Validation du format contact (doit commencer par + suivi de chiffres)
    const contactRegex = /^\+[0-9]{8,15}$/;
    if (!contactRegex.test(contact)) {
      throw new Error(
        "Le numéro de contact doit être au format international (+CodePaysNuméro)"
      );
    }

    // Validation du mot de passe
    if (password.length < 4) {
      throw new Error("Le mot de passe doit contenir au moins 4 caractères");
    }

    // Vérifier l'unicité de l'email ET du contact
    const existingUser = await db
      .select()
      .from(clients_en_ligne)
      .where(
        or(
          eq(clients_en_ligne.email, email),
          eq(clients_en_ligne.contact, contact)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
        throw new Error("Cette adresse email est déjà associée à un compte");
      }
      if (existingUser[0].contact === contact) {
        throw new Error("Ce numéro de téléphone est déjà associé à un compte");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(clients_en_ligne)
      .values({
        nom: nom.trim(),
        email: email.toLowerCase().trim(),
        contact: contact.trim(),
        password: hashedPassword,
        role: "client",
      })
      .returning();

    if (newUser.length === 0) {
      throw new Error("Erreur lors de la création du compte");
    }

    return {
      message: "Inscription réussie",
      client: {
        id: newUser[0].id_client,
        nom: newUser[0].nom,
        email: newUser[0].email,
        contact: newUser[0].contact,
        role: newUser[0].role,
      },
    };
  },

  // Demander une réinitialisation de mot de passe
  requestPasswordReset: async (email) => {
    if (!email) {
      throw new Error("L'adresse email est requise");
    }

    // Validation du format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Format d'email invalide");
    }

    // Vérifier si l'utilisateur existe
    const user = await db
      .select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.email, email.toLowerCase().trim()))
      .limit(1);

    if (user.length === 0) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return {
        message:
          "Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation",
      };
    }

    // Supprimer les anciens tokens de réinitialisation pour cet utilisateur
    await db.delete(refresh_tokens).where(
      and(
        eq(refresh_tokens.user_id, user[0].id_client)
        // Identifier les tokens de réinitialisation par leur durée courte (1 heure)
      )
    );

    // Générer un token de réinitialisation (utiliser la table refresh_tokens)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Stocker le token dans la table refresh_tokens
    await db.insert(refresh_tokens).values({
      user_id: user[0].id_client,
      token: `reset_${resetToken}`, // Préfixe pour identifier les tokens de réinitialisation
      expires_at: resetTokenExpiry,
    });

    // Envoyer l'email de réinitialisation
    const resetUrl = `${
      process.env.FRONTEND_URL || "https://boutique.dcat.ci"
    }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Boutique DCAT" <boutique@dcat.ci>',
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .button { display: inline-block; background-color: #1976D2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Réinitialisation de mot de passe</h2>
            </div>
            
            <p>Bonjour ${user[0].nom},</p>
            
            <p>Vous avez demandé une réinitialisation de votre mot de passe pour votre compte Boutique DCAT.</p>
            
            <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <p><strong>Ce lien expirera dans 1 heure.</strong></p>
            
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            
            <div class="footer">
              <p>Cordialement,<br>L'équipe Boutique DCAT</p>
              <p>© ${new Date().getFullYear()} Boutique DCAT - Tous droits réservés</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return {
        message:
          "Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation",
      };
    } catch (error) {
      console.error("Erreur envoi email:", error);
      throw new Error("Erreur lors de l'envoi de l'email de réinitialisation");
    }
  },

  // Réinitialiser le mot de passe avec le token
  resetPassword: async (token, newPassword) => {
    if (!token || !newPassword) {
      throw new Error("Le token et le nouveau mot de passe sont requis");
    }

    if (newPassword.length < 4) {
      throw new Error("Le mot de passe doit contenir au moins 4 caractères");
    }

    // Vérifier le token dans la table refresh_tokens
    const tokenRecord = await db
      .select()
      .from(refresh_tokens)
      .leftJoin(
        clients_en_ligne,
        eq(refresh_tokens.user_id, clients_en_ligne.id_client)
      )
      .where(eq(refresh_tokens.token, `reset_${token}`))
      .limit(1);

    if (tokenRecord.length === 0) {
      throw new Error("Token de réinitialisation invalide");
    }

    // Vérifier si le token n'est pas expiré
    if (new Date() > new Date(tokenRecord[0].refresh_tokens.expires_at)) {
      // Supprimer le token expiré
      await db
        .delete(refresh_tokens)
        .where(eq(refresh_tokens.token, `reset_${token}`));
      throw new Error("Token de réinitialisation expiré");
    }

    const user = tokenRecord[0].clients_en_ligne;
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await db
      .update(clients_en_ligne)
      .set({ password: hashedPassword })
      .where(eq(clients_en_ligne.id_client, user.id_client));

    // Supprimer le token de réinitialisation utilisé
    await db
      .delete(refresh_tokens)
      .where(eq(refresh_tokens.token, `reset_${token}`));

    return { message: "Mot de passe réinitialisé avec succès" };
  },

  // Récupérer tous les clients (pour admin)
  getAllClients: async () => {
    try {
      const allClients = await db
        .select({
          id_client: clients_en_ligne.id_client,
          nom: clients_en_ligne.nom,
          email: clients_en_ligne.email,
          contact: clients_en_ligne.contact,
          role: clients_en_ligne.role,
          created_at: clients_en_ligne.created_at,
        })
        .from(clients_en_ligne)
        .orderBy(clients_en_ligne.created_at);

      return allClients;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des clients: " + error.message
      );
    }
  },

  // Récupérer le nombre total de clients (excluant les admins)
  getClientsCount: async () => {
    try {
      const result = await db
        .select({
          count: sql`count(*)`.as("count"),
        })
        .from(clients_en_ligne)
        .where(
          or(
            eq(clients_en_ligne.role, "client"),
            eq(clients_en_ligne.role, null) // Au cas où certains clients n'auraient pas de rôle défini
          )
        );

      return parseInt(result[0]?.count) || 0;
    } catch (error) {
      console.error("Erreur lors du comptage des clients:", error);
      throw new Error("Erreur lors du comptage des clients: " + error.message);
    }
  },
};

module.exports = clientsService;
