const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification_websocket.controller');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la notification
 *         user_id:
 *           type: integer
 *           description: ID de l'utilisateur destinataire
 *         title:
 *           type: string
 *           description: Titre de la notification
 *         message:
 *           type: string
 *           description: Contenu de la notification
 *         type:
 *           type: string
 *           description: Type de notification (info, command, delivery, etc.)
 *         is_read:
 *           type: boolean
 *           description: Indique si la notification a été lue
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de la notification
 */

/**
 * @swagger
 * /marketing_commercial/notifications:
 *   get:
 *     summary: Récupère les notifications de l'utilisateur connecté
 *     description: Retourne les notifications non lues et les notifications lues récentes (moins de 5 minutes)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, notificationController.getUserNotifications);

/**
 * @swagger
 * /marketing_commercial/notifications/all:
 *   get:
 *     summary: Récupère toutes les notifications de l'utilisateur
 *     description: Retourne toutes les notifications (lues et non lues) de l'utilisateur
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les notifications récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/all', authMiddleware, notificationController.getAllUserNotifications);

/**
 * @swagger
 * /marketing_commercial/notifications/count:
 *   get:
 *     summary: Compte les notifications non lues
 *     description: Retourne le nombre de notifications non lues pour l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comptage réussi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/count', authMiddleware, notificationController.countUnread);

/**
 * @swagger
 * /marketing_commercial/notifications/{notificationId}/read:
 *   put:
 *     summary: Marque une notification comme lue
 *     description: Change le statut d'une notification spécifique à "lue"
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification à marquer
 *     responses:
 *       200:
 *         description: Notification marquée comme lue avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification marquée comme lue
 *       400:
 *         description: ID de notification manquant
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);

/**
 * @swagger
 * /marketing_commercial/notifications/read-all:
 *   put:
 *     summary: Marque toutes les notifications comme lues
 *     description: Change le statut de toutes les notifications de l'utilisateur à "lues"
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marquées comme lues avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Toutes les notifications marquées comme lues
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);

/**
 * @swagger
 * /marketing_commercial/notifications/delete-old-read:
 *   delete:
 *     summary: Supprime les notifications lues anciennes
 *     description: Supprime les notifications lues depuis plus de 5 minutes
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications supprimées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notifications lues anciennes supprimées avec succès
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete-old-read', authMiddleware, notificationController.deleteOldReadNotifications);

/**
 * @swagger
 * /marketing_commercial/notifications/delete-read:
 *   delete:
 *     summary: Supprime toutes les notifications lues
 *     description: Supprime définitivement toutes les notifications lues de l'utilisateur
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications supprimées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notifications lues supprimées avec succès
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete-read', authMiddleware, notificationController.deleteReadNotifications);

/**
 * @swagger
 * /marketing_commercial/notifications/connection-stats:
 *   get:
 *     summary: Obtient les statistiques de connexion WebSocket
 *     description: Retourne les informations sur les utilisateurs connectés via WebSocket (admin uniquement)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalConnectedUsers:
 *                       type: integer
 *                       example: 5
 *                     connectedUserIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2, 3, 4, 5]
 *                     currentUser:
 *                       type: object
 *                       properties:
 *                         isConnected:
 *                           type: boolean
 *                         userId:
 *                           type: integer
 *       403:
 *         description: Accès non autorisé (admin requis)
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/connection-stats', authMiddleware, notificationController.getConnectionStats);

module.exports = router;
