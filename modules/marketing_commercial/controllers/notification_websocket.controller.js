const notificationService = require('../services/notification_websocket.service');

const notificationController = {
  // Récupérer toutes les notifications d'un utilisateur
  getUserNotifications: async (req, res) => {
    try {
      const userId = req.params.userId || req.user.id;
      
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
  
  // Marquer une notification comme lue
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        return res.status(400).json({ 
          success: false, 
          error: "ID de notification requis" 
        });
      }
      
      await notificationService.markAsRead(notificationId);
      
      res.json({ 
        success: true, 
        message: "Notification marquée comme lue" 
      });
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
      res.status(500).json({ 
        success: false, 
        error: "Erreur lors du marquage de la notification" 
      });
    }
  },
  
  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.params.userId || req.user.id;
      
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
      const userId = req.params.userId || req.user.id;
      
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
  }
};

module.exports = notificationController;
