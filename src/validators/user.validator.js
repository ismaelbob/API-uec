const { check, param } = require('express-validator');
const User = require('../models/user.model');

exports.createUserValidator = [
  check('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .custom(async (value) => {
      const exists = await User.findOne({ email: value });
      if (exists) throw new Error('El email ya está registrado');
    }),

  check('usuario')
    .notEmpty().withMessage('El usuario es obligatorio')
    .isLength({ min: 4, max: 10 }).withMessage('El usuario debe tener entre 4 y 10 caracteres'),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),

  check('nivel')
    .isInt({ min: 1, max: 3 }).withMessage('Nivel inválido')
];

exports.updateUserValidator = [
  check('email')
    .optional()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (!value) return;
      const exists = await User.findOne({ 
        email: value, 
        _id: { $ne: req.params.id } 
      });
      if (exists) throw new Error('El email ya está en uso');
    }),

  check('usuario')
    .optional()
    .isLength({ min: 4, max: 10 })
    .withMessage('El usuario debe tener entre 4 y 10 caracteres'),

  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  check('nombre')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),

  check('nivel')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Nivel inválido')
];

exports.changePasswordUserValidator = [
  check('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

exports.registerExternalValidator = [
  check('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),

  check('usuario')
    .notEmpty().withMessage('El usuario es obligatorio')
    .isLength({ min: 4, max: 10 }).withMessage('El usuario debe tener entre 4 y 10 caracteres')
];

exports.resendVerificationValidator = [
  check('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
];

