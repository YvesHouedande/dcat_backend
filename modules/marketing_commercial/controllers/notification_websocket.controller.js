const notificationService = require('../services/notification_websocket.service');
const { getConnectedUsers, isUserConnected, getConnectedUsersCount } = require('../utils/websocket');

const notificationController = {
  // Récupérer toutes les notifications d'un utilisateur
  getUserNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const notifications = await notificationService.getUserNotifications(userId);
      
      res.json({ 
        success: true, 
        notifications 
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération des notifications" 
      });
    }
  },
  
  // Récupérer toutes les notifications d'un utilisateur (incluant les anciennes lues)
  getAllUserNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const notifications = await notificationService.getAllUserNotifications(userId);
      
      res.json({ 
        success: true, 
        notifications 
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de toutes les notifications:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la récupération de toutes les notifications" 
      });
    }
  },
  
  // Marquer une notification comme lue
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;
      
      if (!notificationId) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de notification requis" 
        });
      }
      
      await notificationService.markAsRead(notificationId, userId);
      
      res.json({ 
        success: true, 
        message: "Notification marquée comme lue" 
      });
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erreur lors du marquage de la notification" 
      });
    }
  },
  
  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await notificationService.markAllAsRead(userId);
      
      res.json({ 
        success: true, 
        message: "Toutes les notifications marquées comme lues" 
      });
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors du marquage des notifications" 
      });
    }
  },
  
  // Compter les notifications non lues
  countUnread: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const count = await notificationService.countUnread(userId);
      
      res.json({ 
        success: true, 
        count 
      });
    } catch (error) {
      console.error("Erreur lors du comptage des notifications:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors du comptage des notifications" 
      });
    }
  },
  
  // Supprimer les notifications lues anciennes (plus de 5 minutes)
  deleteOldReadNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await notificationService.deleteOldReadNotifications(userId);
      
      res.json({ 
        success: true, 
        message: "Notifications lues anciennes supprimées avec succès" 
      });
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications lues anciennes:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la suppression des notifications lues anciennes" 
      });
    }
  },
  
  // Supprimer toutes les notifications lues
  deleteReadNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await notificationService.deleteReadNotifications(userId);
      
      res.json({ 
        success: true, 
        message: "Notifications lues supprimées avec succès" 
      });
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors de la suppression des notifications" 
      });
    }
  },

  // Obtenir les statistiques de connexion WebSocket (pour les admins)
  getConnectionStats: async (req, res) => {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: "Accès non autorisé"
        });
      }

      const connectedUsers = getConnectedUsers();
      const totalConnected = getConnectedUsersCount();
      const userConnectionStatus = req.user.id ? {
        isConnected: isUserConnected(req.user.id),
        userId: req.user.id
      } : null;

      res.json({
        success: true,
        stats: {
          totalConnectedUsers: totalConnected,
          connectedUserIds: connectedUsers,
          currentUser: userConnectionStatus
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des statistiques"
      });
    }
  }
};

module.exports = notificationController;
