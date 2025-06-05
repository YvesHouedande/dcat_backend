const clientsService = require("../services/clients.service");
const jwt = require("jsonwebtoken");
const { db } = require('../../../core/database/config');
const { refresh_tokens } = require("../../../core/database/models");
const dayjs = require('dayjs');
const { eq } = require("drizzle-orm"); // Ajout de l'import manquant

const JWT_SECRET = process.env.JWT_SECRET || "sorosamuel";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

const clientsController = {
  register: async (req, res) => {
    try {
      const result = await clientsService.register(req.body);
      
      // Si l'inscription est réussie, connecter automatiquement l'utilisateur
      if (result.client) {
        // Générer les tokens
        const token = jwt.sign(
          { id: result.client.id, role: result.client.role },
          JWT_SECRET,
          { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
          { id: result.client.id, role: result.client.role },
          JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        // Sauvegarder le refresh token
        await db.insert(refresh_tokens).values({
          user_id: result.client.id,
          token: refreshToken,
          expires_at: dayjs().add(7, 'day').toDate(),
        });

        // Retourner les informations d'inscription et de connexion
        res.status(201).json({ 
          success: true, 
          message: result.message,
          client: result.client,
          token,
          refreshToken,
          autoLogin: true
        });
      } else {
        res.status(201).json({ success: true, ...result });
      }
    } catch (error) {
      // Gestion d'erreurs spécifiques avec codes d'erreur
      const errorMessage = error.message;
      let statusCode = 400;
      let errorCode = "REGISTRATION_ERROR";

      if (errorMessage.includes("email est déjà associée")) {
        errorCode = "EMAIL_EXISTS";
      } else if (errorMessage.includes("numéro de téléphone est déjà associé")) {
        errorCode = "PHONE_EXISTS";
      } else if (errorMessage.includes("Format d'email invalide")) {
        errorCode = "INVALID_EMAIL_FORMAT";
      } else if (errorMessage.includes("format international")) {
        errorCode = "INVALID_PHONE_FORMAT";
      } else if (errorMessage.includes("champs sont requis")) {
        errorCode = "MISSING_FIELDS";
      } else if (errorMessage.includes("mot de passe doit contenir")) {
        errorCode = "WEAK_PASSWORD";
      }

      res.status(statusCode).json({ 
        success: false, 
        error: errorMessage,
        errorCode 
      });
    }
  },

  //gere la connexion des clients
  login: async (req, res) => {
    try {
      // Vérification des champs requis dès le début
      const { identifiant, password } = req.body;
      if (!identifiant || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "L'identifiant et le mot de passe sont requis",
          errorCode: "MISSING_FIELDS"
        });
      }

      try {
        const { client, passwordOk } = await clientsService.login(req.body);

        if (!passwordOk) {
          return res.status(401).json({ 
            success: false, 
            error: "Mot de passe incorrect", 
            errorCode: "INVALID_PASSWORD"
          });
        }

        const token = jwt.sign(
          { id: client.id_client, role: client.role },
          JWT_SECRET,
          { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
          { id: client.id_client, role: client.role },
          JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        await db.insert(refresh_tokens).values({
          user_id: client.id_client,
          token: refreshToken,
          expires_at: dayjs().add(7, 'day').toDate(),
        });

        res.json({
          success: true,
          client: {
            id: client.id_client,
            nom: client.nom,
            email: client.email,
            contact: client.contact,
            role: client.role,
          },
          token,
          refreshToken,
        });
      } catch (error) {
        // Messages d'erreur plus précis avec codes d'erreur
        if (error.message === "Aucun compte trouvé avec cet identifiant") {
          return res.status(401).json({ 
            success: false, 
            error: error.message,
            errorCode: "USER_NOT_FOUND" 
          });
        } else if (error.message === "Mot de passe incorrect") {
          return res.status(401).json({ 
            success: false, 
            error: error.message,
            errorCode: "INVALID_PASSWORD" 
          });
        } else {
          return res.status(400).json({ 
            success: false, 
            error: error.message,
            errorCode: "LOGIN_ERROR"
          });
        }
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur serveur: " + error.message,
        errorCode: "SERVER_ERROR"
      });
    }
  },

  verifyToken: async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ success: true, id: decoded.id, role: decoded.role });
    } catch (error) {
      res.status(401).json({ success: false, error: "Token invalide" });
    }
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        error: "Refresh token manquant",
        errorCode: "MISSING_REFRESH_TOKEN"
      });
    }

    try {
      // 1. Vérifier le refresh token dans la base de données
      const tokens = await db.select().from(refresh_tokens)
        .where(eq(refresh_tokens.token, refreshToken));
      
      if (tokens.length === 0) {
        return res.status(403).json({ 
          success: false, 
          error: "Refresh token invalide",
          errorCode: "INVALID_REFRESH_TOKEN"
        });
      }

      // 2. Vérifier si le token n'est pas expiré
      if (dayjs(tokens[0].expires_at).isBefore(dayjs())) {
        // Supprimer le token expiré
        await db.delete(refresh_tokens)
          .where(eq(refresh_tokens.token, refreshToken));
        return res.status(403).json({ 
          success: false, 
          error: "Refresh token expiré",
          errorCode: "EXPIRED_REFRESH_TOKEN"
        });
      }

      // 3. Vérifier la signature du token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // 4. Supprimer l'ancien refresh token
      await db.delete(refresh_tokens)
        .where(eq(refresh_tokens.token, refreshToken));

      // 5. Générer les nouveaux tokens
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // 6. Sauvegarder le nouveau refresh token
      await db.insert(refresh_tokens).values({
        user_id: decoded.id,
        token: newRefreshToken,
        expires_at: dayjs().add(7, 'day').toDate(),
      });

      res.json({ 
        success: true, 
        token: newAccessToken, 
        refreshToken: newRefreshToken 
      });
    } catch (error) {
      // Si le token JWT est invalide
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        // Nettoyer le token invalide s'il existe en base
        await db.delete(refresh_tokens)
          .where(eq(refresh_tokens.token, refreshToken))
          .catch(() => {}); // Ignorer les erreurs de nettoyage
        
        return res.status(401).json({ 
          success: false, 
          error: "Refresh token invalide",
          errorCode: "INVALID_REFRESH_TOKEN"
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors du rafraîchissement du token",
        errorCode: "REFRESH_ERROR"
      });
    }
  },

  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ 
          success: false, 
          error: "Refresh token manquant", 
          errorCode: "MISSING_TOKEN" 
        });
      }
      
      // Limiter le temps de l'opération de suppression
      const deletePromise = db.delete(refresh_tokens)
        .where(eq(refresh_tokens.token, refreshToken));
        
      // Ajouter un timeout à la suppression pour éviter les blocages
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );
      
      // Utiliser Promise.race pour garantir que l'opération ne prend pas trop de temps
      await Promise.race([deletePromise, timeoutPromise])
        .catch(err => {
          // Journaliser l'erreur mais ne pas la propager afin de répondre au client
          console.error("Erreur de suppression du token:", err.message);
        });
      
      // Répondre au client rapidement, même si l'opération de BD échoue
      return res.json({ success: true, message: "Déconnexion réussie" });
    } catch (error) {
      // Journaliser l'erreur
      console.error("Erreur durant la déconnexion:", error.message);
      
      // Répondre avec une erreur mais assurer que la réponse est envoyée
      return res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la déconnexion",
        errorCode: "LOGOUT_ERROR"
      });
    }
  },

  // Récupérer tous les clients (fonctionnalité admin)
  getAllClients: async (req, res) => {
    try {
      const clients = await clientsService.getAllClients();
      res.json({ success: true, clients });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération des clients: " + error.message
      });
    }
  },

  // Demander une réinitialisation de mot de passe
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          error: "L'adresse email est requise",
          errorCode: "MISSING_EMAIL"
        });
      }

      const result = await clientsService.requestPasswordReset(email);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const errorMessage = error.message;
      let statusCode = 400;
      let errorCode = "REQUEST_RESET_ERROR";

      if (errorMessage.includes("Format d'email invalide")) {
        errorCode = "INVALID_EMAIL_FORMAT";
      } else if (errorMessage.includes("Erreur lors de l'envoi")) {
        statusCode = 500;
        errorCode = "EMAIL_SEND_ERROR";
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorCode
      });
    }
  },

  // Réinitialiser le mot de passe avec token
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Le token et le nouveau mot de passe sont requis",
          errorCode: "MISSING_FIELDS"
        });
      }

      const result = await clientsService.resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const errorMessage = error.message;
      let statusCode = 400;
      let errorCode = "RESET_PASSWORD_ERROR";

      if (errorMessage.includes("Token de réinitialisation invalide")) {
        statusCode = 401;
        errorCode = "INVALID_TOKEN";
      } else if (errorMessage.includes("Token de réinitialisation expiré")) {
        statusCode = 401;
        errorCode = "EXPIRED_TOKEN";
      } else if (errorMessage.includes("mot de passe doit contenir")) {
        errorCode = "WEAK_PASSWORD";
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorCode
      });
    }
  },
};

module.exports = clientsController;
