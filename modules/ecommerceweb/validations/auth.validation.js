const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nom: Joi.string().min(2).required(),
  contact: Joi.string().pattern(/^\+?[0-9]{8,15}$/)
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.syncUserSchema = Joi.object({
  uid: Joi.string().required(),
  email: Joi.string().email().required(),
  nom: Joi.string().optional(),
  contact: Joi.string().allow('').optional(),
  provider: Joi.string().valid('google', 'email').required()
});

// Ajouter ce nouveau schéma
exports.updateProfileSchema = Joi.object({
  nom: Joi.string().min(2).required(),
  contact: Joi.string().pattern(/^\+?[0-9]{8,15}$/).required()
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Veuillez fournir une adresse email valide',
      'string.empty': 'L\'email est requis',
      'any.required': 'L\'email est requis'
    })
});

exports.resetPasswordSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'string.empty': 'Le token est requis',
      'any.required': 'Le token est requis'
    }),
  newPassword: Joi.string().min(6).required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'string.empty': 'Le mot de passe est requis',
      'any.required': 'Le mot de passe est requis'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Veuillez fournir une adresse email valide',
      'string.empty': 'L\'email est requis',
      'any.required': 'L\'email est requis'
    })
});
