
  exports.validate = (schema) => {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req.body, { abortEarly: false });
      req.body = value; // Données validées et nettoyées
      next();
    } catch (error) {
      if (error.details) {
        const formattedErrors = error.details.map(err => ({
          param: err.context.key,
          message: err.message,
          location: 'body'
        }));

        return res.status(400).json({
          success: false,
          errors: formattedErrors
        });
      }

      // Autres types d'erreurs non liées à Joi
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne lors de la validation'
      });
    }
  };
};
