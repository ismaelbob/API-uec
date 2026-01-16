const { check } = require('express-validator');

exports.createUserValidator = [
  check('usuario')
    .notEmpty().withMessage('El usuario es obligatorio')
    .isLength({ min: 4 }).withMessage('El usuario debe tener al menos 4 caracteres'),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),

  check('nivel')
    .isInt({ min: 1, max: 3 }).withMessage('Nivel inválido')
];

exports.updateUserValidator = [
  check('usuario')
    .optional()
    .isLength({ min: 4 })
    .withMessage('El usuario debe tener al menos 4 caracteres'),

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

