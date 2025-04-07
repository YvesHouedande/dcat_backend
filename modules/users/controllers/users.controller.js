const logger = require('../../../core/utils/logger');
const userService = require('../services/users.service');

module.exports = {
  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      logger.info(`Récupération de ${users.length} utilisateurs`);
      res.json(users);
    } catch (error) {
      logger.error('Échec de récupération des utilisateurs:', {
        error: error.message,
        stack: error.stack
      });
      next(error);
    }
  }
};