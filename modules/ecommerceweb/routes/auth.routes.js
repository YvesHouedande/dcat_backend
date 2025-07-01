const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../validations/validate');
const { verifyToken } = require('../middlewares/jwt.middleware');
const { 
  registerSchema, 
  loginSchema,
  syncUserSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validations/auth.validation');


/**
 * @swagger
 * tags:
 *   name: Ecom-Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/sync-user:
 *   post:
 *     summary: Sync Firebase user with local database
 *     tags: [Ecom-Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncUser'
 *     responses:
 *       200:
 *         description: User synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/sync-user',
  validate(syncUserSchema),
  authController.syncUser
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Ecom-Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email already exists or validation error
 *       500:
 *         description: Registration failed
 */
router.post('/register',
  validate(registerSchema),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Ecom-Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
router.post('/login',
  validate(loginSchema),
  authController.login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Ecom-Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', 
  verifyToken, 
  authController.getCurrentUser
);

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Ecom-Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Update failed
 */
router.put('/update-profile',
  verifyToken,
  validate(updateProfileSchema),
  authController.updateProfile
);


router.post('/forgot-password', 
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post('/reset-password', 
  validate(resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;