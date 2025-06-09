const { io } = require('../utils/websocket');
const { db } = require('../../../core/database/config');
const { notifications } = require("../../../core/database/models");
const { eq, and, desc, sql } = require("drizzle-orm");

const notificationService = {
  // Envoyer une notification à un utilisateur spécifique
  sendToUser: async (userId, notification) => {
    try {
      // Vérifier si une notification similaire non lue existe déjà
      const existingNotification = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.title, notification.title),
            eq(notifications.message, notification.message),
            eq(notifications.is_read, false)
          )
        )
        .limit(1);

      // Si une notification similaire non lue existe déjà, ne pas en créer une nouvelle
      if (existingNotification.length > 0) {
        return existingNotification[0];
      }

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
      
      // Envoyer via WebSocket uniquement au destinataire concerné
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
      // Récupérer tous les utilisateurs avec ce rôle
      const users = await db
        .select()
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.role, role));

      // Envoyer la notification à chaque utilisateur individuellement
      for (const user of users) {
        await notificationService.sendToUser(user.id_client, notification);
      }
      
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
  markAsRead: async (notificationId, userId) => {
    try {
      // Vérifier que la notification appartient bien à l'utilisateur
      const notification = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.user_id, userId)
          )
        )
        .limit(1);

      if (notification.length === 0) {
        throw new Error("Notification non trouvée ou non autorisée");
      }

      // Marquer comme lue
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
  
  // Supprimer les notifications lues d'un utilisateur
  deleteReadNotifications: async (userId) => {
    try {
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.is_read, true)
          )
        );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications lues:", error);
      throw error;
    }
  },
};

module.exports = notificationService;
