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
 *     description: Retourne toutes les notifications de l'utilisateur
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

module.exports = router;
