// const express = require('express');
// const router = express.Router();
// const commandeController = require('../controllers/commande.controller');
// const { verifyToken } = require('../middlewares/jwt.middleware');

// router.post('/', verifyToken, commandeController.creerCommande);

// router.get('/historique', 
//     verifyToken, 
//     commandeController.getHistoriqueCommandes
//   );

// router.get('/:id', 
//   verifyToken, 
//   commandeController.getOrderDetails
// );

// router.put('/:id/annuler', 
//   verifyToken, 
//   commandeController.cancelOrder
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commande.controller');
const { verifyToken } = require('../middlewares/jwt.middleware');

/**
 * @swagger
 * tags:
 *   name: Ecom-Orders
 *   description: Order management
 */

/**
 * @swagger
 * /commande:
 *   post:
 *     summary: Create a new order
 *     tags: [Ecom-Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing delivery address or payment method
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Order creation failed
 */
router.post('/', verifyToken, commandeController.creerCommande);

/**
 * @swagger
 * /commande/historique:
 *   get:
 *     summary: Get order history
 *     tags: [Ecom-Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderWithProducts'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/historique', 
  verifyToken, 
  commandeController.getHistoriqueCommandes
);

/**
 * @swagger
 * /commande/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Ecom-Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithProducts'
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', 
  verifyToken, 
  commandeController.getOrderDetails
);

/**
 * @swagger
 * /commande/{id}/annuler:
 *   put:
 *     summary: Cancel an order
 *     tags: [Ecom-Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/:id/annuler', 
  verifyToken, 
  commandeController.cancelOrder
);

module.exports = router;