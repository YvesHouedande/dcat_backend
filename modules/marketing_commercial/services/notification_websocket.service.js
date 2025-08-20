const { io } = require('../utils/websocket');
const { db } = require('../../../core/database/config');
const { notifications, clients_en_ligne } = require("../../../core/database/models");
const { eq, and, desc, sql, gt, inArray } = require("drizzle-orm");

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
      
      // Envoyer via WebSocket uniquement au destinataire concerné (si connecté)
      try {
        io.to(`user:${userId}`).emit('notification', {
          ...savedNotification,
          created_at: new Date()
        });
      } catch (wsError) {
        console.warn(`WebSocket non disponible pour l'utilisateur ${userId}:`, wsError.message);
        // La notification est déjà sauvée en base, donc elle sera récupérée lors de la prochaine connexion
      }
      
      return savedNotification;
    } catch (error) {
      console.error("Erreur lors de l'envoi de notification:", error);
      throw error;
    }
  },
  
  // Envoyer une notification à tous les utilisateurs d'un rôle spécifique (optimisé)
  sendToRole: async (role, notification) => {
    try {
      // Récupérer tous les utilisateurs avec ce rôle en une seule requête
      const users = await db
        .select({
          id_client: clients_en_ligne.id_client,
          role: clients_en_ligne.role
        })
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.role, role));

      if (users.length === 0) {
        return true; // Pas d'utilisateurs avec ce rôle
      }

      // Préparer les notifications pour insertion groupée
      const notificationsToInsert = users.map(user => ({
        user_id: user.id_client,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: false,
      }));

      // Insertion groupée en base de données
      const savedNotifications = await db
        .insert(notifications)
        .values(notificationsToInsert)
        .returning();

      // Envoyer via WebSocket à tous les utilisateurs du rôle
      try {
        io.to(`role:${role}`).emit('notification', {
          title: notification.title,
          message: notification.message,
          type: notification.type,
          created_at: new Date()
        });
      } catch (wsError) {
        console.warn(`WebSocket non disponible pour le rôle ${role}:`, wsError.message);
      }
      
      return savedNotifications;
    } catch (error) {
      console.error("Erreur lors de l'envoi de notification de rôle:", error);
      throw error;
    }
  },

  // Méthode intelligente pour envoyer notifications commande (évite les doublons)
  sendCommandeNotifications: async (clientId, clientInfo, admins) => {
    try {
      const results = [];

      // 1. Notification pour le client
      const clientNotification = await notificationService.sendToUser(clientId, {
        title: 'Commande confirmée',
        message: `Votre commande a été enregistrée avec succès. Vous recevrez une confirmation par email.`,
        type: 'command_client',
      });
      results.push({ type: 'client', notification: clientNotification });

      // 2. Vérifier si le client est aussi admin
      const clientRole = await db
        .select({ role: clients_en_ligne.role })
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.id_client, clientId))
        .limit(1);

      const isClientAdmin = clientRole.length > 0 && clientRole[0].role === 'admin';

      // 3. Notification pour les admins (excluant le client s'il est admin)
      if (admins && admins.length > 0) {
        // Filtrer les admins pour exclure le client s'il est admin
        const filteredAdmins = isClientAdmin 
          ? admins.filter(admin => admin.id_client !== clientId)
          : admins;

        if (filteredAdmins.length > 0) {
          // Envoyer individuellement pour éviter les doublons avec sendToRole
          for (const admin of filteredAdmins) {
            const adminNotification = await notificationService.sendToUser(admin.id_client, {
              title: 'Nouvelle commande reçue',
              message: `Une nouvelle commande a été passée par ${clientInfo ? clientInfo.nom : 'un client'}.`,
              type: 'command_admin',
            });
            results.push({ type: 'admin', notification: adminNotification, adminId: admin.id_client });
          }
        }
      }

      // 4. Si le client est admin, lui envoyer AUSSI la notification admin
      if (isClientAdmin) {
        const adminNotificationForClient = await notificationService.sendToUser(clientId, {
          title: 'Nouvelle commande (Admin)',
          message: `Une commande a été passée par ${clientInfo ? clientInfo.nom : 'vous-même'}.`,
          type: 'command_admin_self',
        });
        results.push({ type: 'admin_self', notification: adminNotificationForClient });
      }

      return results;
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications de commande:", error);
      throw error;
    }
  },

  // Méthode pour envoyer notification de changement de statut
  sendStatusChangeNotifications: async (commandeId, clientId, clientInfo, newStatus, admins) => {
    try {
      const results = [];

      // Messages selon le nouveau statut
          const statusMessages = {
      'livree': {
        client: 'Votre commande a été marquée comme livrée.',
        admin: `La commande de ${clientInfo ? clientInfo.nom : 'un client'} a été marquée comme livrée.`
      },
      'annulee': {
        client: 'Votre commande a été annulée.',
        admin: `La commande de ${clientInfo ? clientInfo.nom : 'un client'} a été annulée.`
      },
      'retournee': {
        client: 'Votre commande a été retournée.',
        admin: `La commande de ${clientInfo ? clientInfo.nom : 'un client'} a été retournée.`
      },
      'en_cours': {
        client: 'Votre commande est maintenant en cours de traitement.',
        admin: `La commande de ${clientInfo ? clientInfo.nom : 'un client'} est maintenant en cours de traitement.`
      }
    };

      const messages = statusMessages[newStatus];
      if (!messages) {
        return results; // Statut non géré
      }

      // Notification client
      const clientNotification = await notificationService.sendToUser(clientId, {
        title: `Commande ${newStatus}`,
        message: messages.client,
        type: 'command_status',
      });
      results.push({ type: 'client', notification: clientNotification });

      // Notifications admins (pour annulation et retour uniquement)
      if ((newStatus === 'annulee' || newStatus === 'retournee') && admins && admins.length > 0) {
        for (const admin of admins) {
          // Éviter de notifier le client s'il est admin
          if (admin.id_client !== clientId) {
            const adminNotification = await notificationService.sendToUser(admin.id_client, {
              title: `Commande ${newStatus}`,
              message: messages.admin,
              type: 'command_status_admin',
            });
            results.push({ type: 'admin', notification: adminNotification, adminId: admin.id_client });
          }
        }
      }

      return results;
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications de changement de statut:", error);
      throw error;
    }
  },
  
  // Récupérer les notifications d'un utilisateur avec logique d'affichage optimisée
  getUserNotifications: async (userId) => {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes
      
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            // Afficher les notifications non lues OU les notifications lues récentes (moins de 5 minutes)
            sql`(${notifications.is_read} = false OR (${notifications.is_read} = true AND ${notifications.updated_at} > ${fiveMinutesAgo.toISOString()}))`
          )
        )
        .orderBy(desc(notifications.created_at));
      
      return userNotifications;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw error;
    }
  },

  // Récupérer toutes les notifications d'un utilisateur (pour les admins ou cas spéciaux)
  getAllUserNotifications: async (userId) => {
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

      // Marquer comme lue avec updated_at pour le tracking
      await db
        .update(notifications)
        .set({ 
          is_read: true,
          updated_at: new Date()
        })
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
        .set({ 
          is_read: true,
          updated_at: new Date()
        })
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.is_read, false) // Seulement les non lues
          )
        );
      
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
  
  // Supprimer les notifications lues anciennes (plus de 5 minutes)
  deleteOldReadNotifications: async (userId) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.is_read, true),
            sql`${notifications.updated_at} < ${fiveMinutesAgo.toISOString()}`
          )
        );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications lues anciennes:", error);
      throw error;
    }
  },

  // Supprimer toutes les notifications lues d'un utilisateur
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

  // Méthode utilitaire pour nettoyer les notifications anciennes (tâche de maintenance)
  cleanupOldNotifications: async (daysOld = 30) => {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      const deletedCount = await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.is_read, true),
            sql`${notifications.updated_at} < ${cutoffDate.toISOString()}`
          )
        );
      
      console.log(`Nettoyage automatique : ${deletedCount} notifications supprimées`);
      return deletedCount;
    } catch (error) {
      console.error("Erreur lors du nettoyage automatique:", error);
      return 0;
    }
  },
};

module.exports = notificationService;
