const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Fonction pour formatter les messages d'erreur
logger.formatError = (error) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      ...error
    };
  }
  return error;
};

module.exports = logger;