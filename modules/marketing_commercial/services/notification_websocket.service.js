const { io } = require('../utils/websocket');
const { db } = require('../../../core/database/config');
const { notifications } = require("../../../core/database/models");
const { eq, and, desc, sql } = require("drizzle-orm");

const notificationService = {
  // Envoyer une notification à un utilisateur spécifique
  sendToUser: async (userId, notification) => {
    try {
      // Sauvegarder la notification dans la base de données
      const [savedNotification] = await db
        .insert(notifications)
        .values({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          is_read: false,
        })
        .returning();
      
      // Envoyer via WebSocket
      io.to(`user:${userId}`).emit('notification', {
        ...savedNotification,
        created_at: new Date()
      });
      
      return savedNotification;
    } catch (error) {
      console.error("Erreur lors de l'envoi de notification:", error);
      throw error;
    }
  },
  
  // Envoyer une notification à tous les utilisateurs d'un rôle spécifique
  sendToRole: async (role, notification) => {
    try {
      // Pour les notifications à plusieurs utilisateurs, on pourrait
      // utiliser une approche différente pour stocker en DB
      
      // Envoyer via WebSocket
      io.to(`role:${role}`).emit('notification', {
        ...notification,
        created_at: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de notification:", error);
      throw error;
    }
  },
  
  // Récupérer les notifications d'un utilisateur
  getUserNotifications: async (userId) => {
    try {
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.user_id, userId))
        .orderBy(desc(notifications.created_at));
      
      return userNotifications;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw error;
    }
  },
  
  // Marquer une notification comme lue
  markAsRead: async (notificationId) => {
    try {
      await db
        .update(notifications)
        .set({ is_read: true })
        .where(eq(notifications.id, notificationId));
      
      return true;
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
      throw error;
    }
  },
  
  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead: async (userId) => {
    try {
      await db
        .update(notifications)
        .set({ is_read: true })
        .where(eq(notifications.user_id, userId));
      
      return true;
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications:", error);
      throw error;
    }
  },
  
  // Compter les notifications non lues d'un utilisateur
  countUnread: async (userId) => {
    try {
      const result = await db
        .select({ count: sql`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.is_read, false)
          )
        );
      
      return result[0]?.count || 0;
    } catch (error) {
      console.error("Erreur lors du comptage des notifications:", error);
      return 0;
    }
  },
};

module.exports = notificationService;
