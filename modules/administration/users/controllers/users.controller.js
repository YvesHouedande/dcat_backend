const logger = require('../../../core/utils/logger');

class UsersController {
  async getAllUsers(req, res) {
    try {
      logger.info('Accès à la liste des utilisateurs');
      res.json([{ id: 1, name: 'Test User' }]);
    } catch (error) {
      logger.error('Erreur:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createUser(req, res) {
    try {
      logger.info('Création d\'un utilisateur');
      res.status(201).json({ id: 2, ...req.body });
    } catch (error) {
      logger.error('Erreur:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Exportez une instance de la classe
module.exports = new UsersController();