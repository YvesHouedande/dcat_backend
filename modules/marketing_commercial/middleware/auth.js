const jwt = require('jsonwebtoken');
const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");

// Clé secrète pour la validation JWT - idéalement stockée dans une variable d'environnement
const JWT_SECRET = process.env.JWT_SECRET || "sorosamuel";

/**
 * Middleware d'authentification qui vérifie la validité du token JWT
 * et extrait les informations de l'utilisateur
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extraire le token de l'en-tête Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentification requise" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier la validité du token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: "Token expiré" 
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: "Token invalide" 
      });
    }

    // Vérifier que l'utilisateur existe toujours en base de données
    const user = await db
      .select({
        id_client: clients_en_ligne.id_client,
        nom: clients_en_ligne.nom,
        email: clients_en_ligne.email,
        role: clients_en_ligne.role,
      })
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, decoded.id))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: "Utilisateur non trouvé" 
      });
    }

    // Ajouter les informations de l'utilisateur à l'objet de requête
    req.user = {
      id: user[0].id_client,
      nom: user[0].nom,
      email: user[0].email,
      role: user[0].role,
    };

    // Passer au middleware suivant
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erreur lors de l'authentification" 
    });
  }
};

/**
 * Middleware de vérification des rôles
 * @param {array} roles - Liste des rôles autorisés
 * @returns Middleware qui vérifie si l'utilisateur a un des rôles requis
 */
const checkRoles = (roles = []) => {
  return (req, res, next) => {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentification requise" 
      });
    }

    // Si aucun rôle n'est spécifié, autoriser tous les utilisateurs authentifiés
    if (roles.length === 0) {
      return next();
    }

    // Vérifier si l'utilisateur a un des rôles requis
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: "Accès interdit: vous n'avez pas les permissions requises" 
      });
    }

    // Utilisateur autorisé
    next();
  };
};

module.exports = { authMiddleware, checkRoles }; 