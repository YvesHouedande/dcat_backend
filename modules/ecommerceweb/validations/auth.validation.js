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