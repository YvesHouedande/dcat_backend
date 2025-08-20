const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");

let io;

// JWT secret pour vérifier les tokens
const JWT_SECRET = process.env.JWT_SECRET || "sorosamuel";

// Map pour suivre les utilisateurs connectés
const connectedUsers = new Map(); // userId -> Set of socketIds
const userSockets = new Map(); // socketId -> userId

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
          nom: clients_en_ligne.nom,
          email: clients_en_ligne.email
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
        role: users[0].role,
        nom: users[0].nom,
        email: users[0].email
      };
      
      next();
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    
    // Ajouter à la map des utilisateurs connectés
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);
    userSockets.set(socket.id, userId);
    
    // Rejoindre les canaux appropriés
    socket.join(`user:${userId}`);
    socket.join(`role:${socket.user.role}`);
    
    console.log(`Utilisateur ${socket.user.nom} (ID: ${userId}) connecté via WebSocket`);
    
    // Événement de déconnexion
    socket.on('disconnect', () => {
      // Retirer de la map des utilisateurs connectés
      if (connectedUsers.has(userId)) {
        connectedUsers.get(userId).delete(socket.id);
        if (connectedUsers.get(userId).size === 0) {
          connectedUsers.delete(userId);
        }
      }
      userSockets.delete(socket.id);
      
      console.log(`Utilisateur ${socket.user.nom} (ID: ${userId}) déconnecté`);
    });

    // Événement pour marquer les notifications comme lues
    socket.on('mark_notifications_read', async (data) => {
      try {
        const notificationService = require('../services/notification_websocket.service');
        
        if (data.notificationIds && Array.isArray(data.notificationIds)) {
          // Marquer plusieurs notifications comme lues
          for (const notifId of data.notificationIds) {
            await notificationService.markAsRead(notifId, userId);
          }
        } else if (data.markAll) {
          // Marquer toutes comme lues
          await notificationService.markAllAsRead(userId);
        }
        
        // Confirmer à l'utilisateur que les notifications sont marquées
        socket.emit('notifications_marked_read', { success: true });
      } catch (error) {
        console.error('Erreur lors du marquage des notifications:', error);
        socket.emit('notifications_marked_read', { success: false, error: error.message });
      }
    });
  });

  return io;
}

// Fonctions utilitaires
function getConnectedUsers() {
  return Array.from(connectedUsers.keys());
}

function isUserConnected(userId) {
  return connectedUsers.has(userId);
}

function getConnectedUsersCount() {
  return connectedUsers.size;
}

function getUserConnectionsCount(userId) {
  return connectedUsers.has(userId) ? connectedUsers.get(userId).size : 0;
}

// Méthode pour diffuser une annonce à tous les utilisateurs connectés
function broadcastToAll(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

// Méthode pour diffuser à tous les utilisateurs d'un rôle
function broadcastToRole(role, event, data) {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
}

// Exporter le module
module.exports = {
  initializeWebSocket,
  getConnectedUsers,
  isUserConnected,
  getConnectedUsersCount,
  getUserConnectionsCount,
  broadcastToAll,
  broadcastToRole,
  get io() {
    if (!io) {
      throw new Error('WebSocket server not initialized. Call initializeWebSocket first.');
    }
    return io;
  }
};
