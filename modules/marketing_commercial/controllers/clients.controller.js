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
      res.status(201).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

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
    if (!refreshToken) return res.status(401).json({ 
      success: false, 
      error: "Refresh token manquant" 
    });

    try {
      // 1. Vérifier et supprimer l'ancien refresh token
      const tokens = await db.select().from(refresh_tokens)
        .where(eq(refresh_tokens.token, refreshToken));
      
      if (tokens.length === 0 || dayjs(tokens[0].expires_at).isBefore(dayjs())) {
        await db.delete(refresh_tokens)
          .where(eq(refresh_tokens.token, refreshToken));
        return res.status(403).json({ 
          success: false, 
          error: "Refresh token invalide ou expiré" 
        });
      }

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // 2. Supprimer l'ancien refresh token avant d'en créer un nouveau
      await db.delete(refresh_tokens)
        .where(eq(refresh_tokens.token, refreshToken));

      // 3. Générer les nouveaux tokens
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

      // 4. Sauvegarder le nouveau refresh token
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
      res.status(401).json({ 
        success: false, 
        error: "Refresh token invalide" 
      });
    }
  },

  logout: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: "Refresh token manquant" });

    await db.delete(refresh_tokens).where(eq(refresh_tokens.token, refreshToken));
    res.json({ success: true, message: "Déconnexion réussie" });
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
};

module.exports = clientsController;
