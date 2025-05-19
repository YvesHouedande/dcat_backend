const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");

let io;

// JWT secret pour vérifier les tokens
const JWT_SECRET = process.env.JWT_SECRET || "sorosamuel";

/**
 * Initialise le serveur WebSocket
 * @param {Object} server - Serveur HTTP
 */
function initializeWebSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "*", // Pour le développement, à restreindre en production
      methods: ["GET", "POST"]
    }
  });

  // Middleware d'authentification WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Récupérer l'utilisateur depuis la base de données
      const users = await db
        .select({
          id_client: clients_en_ligne.id_client,
          role: clients_en_ligne.role,
        })
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.id_client, decoded.id))
        .limit(1);
      
      if (!users || users.length === 0) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attacher les données utilisateur au socket
      socket.user = {
        id: users[0].id_client,
        role: users[0].role
      };
      
      next();
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log(`Nouvel utilisateur connecté: ${socket.id}, User ID: ${socket.user.id}, Role: ${socket.user.role}`);
    
    // Rejoindre les canaux appropriés
    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);
    
    // Écouter les déconnexions
    socket.on('disconnect', () => {
      console.log(`Utilisateur déconnecté: ${socket.id}`);
    });
  });

  return io;
}

// Exporter le module
module.exports = {
  initializeWebSocket,
  get io() {
    if (!io) {
      throw new Error('WebSocket server not initialized. Call initializeWebSocket first.');
    }
    return io;
  }
};
