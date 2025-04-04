// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../../core/auth/middleware');
// const UsersController = require('../controllers/users.controller');

// // Route publique
// router.post('/sync', UsersController.syncUser);

// // Route protégée - version corrigée
// router.get('/', protect(['admin']), UsersController.getAllUsers); // Notez les crochets pour créer un tableau

// module.exports = router;



const express = require('express');
const router = express.Router();
const { protect } = require('../../../core/auth/middleware');
const { syncUser, getAllUsers } = require('../controllers/users.controller');


router.get('/test', (req, res) => res.send('Test OK'));

// Debug: Vérifiez que les fonctions sont bien importées
console.log('Controller methods:', { syncUser, getAllUsers });

// Route publique
router.post('/sync', syncUser);

// Route protégée
router.get('/', protect(['admin']), getAllUsers);

module.exports = router;