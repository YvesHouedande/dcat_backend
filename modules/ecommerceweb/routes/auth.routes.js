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
} = require('../validations/auth.validation');


router.post('/sync-user',
  validate(syncUserSchema),
  authController.syncUser
);

// Local Auth
router.post('/register',
  validate(registerSchema),
  authController.register
);

router.post('/login',
  validate(loginSchema),
  authController.login
);

// Ajouter ces nouvelles routes
router.get('/me', 
  verifyToken, 
  authController.getCurrentUser
);

router.put('/update-profile',
  verifyToken,
  validate(updateProfileSchema),
  authController.updateProfile
);

module.exports = router;