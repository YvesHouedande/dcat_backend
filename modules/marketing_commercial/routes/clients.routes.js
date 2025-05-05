const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients.controller");

router.post('/login', clientsController.login);
router.post('/register', clientsController.register);
router.get('/verify-token', clientsController.verifyToken);
router.post('/refresh-token', clientsController.refreshToken);
router.post('/logout', clientsController.logout);

module.exports = router;
