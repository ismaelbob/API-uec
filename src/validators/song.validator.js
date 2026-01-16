const { body, param } = require('express-validator');

const VALID_HIMNARIOS = ['jovenes', 'verde', 'poder'];

const createSongValidator = [
  body('himnario')
    .notEmpty().withMessage('El himnario es obligatorio')
    .isIn(VALID_HIMNARIOS).withMessage('Himnario inválido'),

  body('idcancion')
    .notEmpty().withMessage('El número es obligatorio')
    .isInt({ min: 1 }).withMessage('El número debe ser entero positivo'),

  body('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 100 }).withMessage('Título demasiado largo'),

  body('letra')
    .notEmpty().withMessage('La letra es obligatoria'),

  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser boolean')
];


const updateSongValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('titulo')
    .optional()
    .isLength({ max: 100 }).withMessage('Título demasiado largo'),

  body('autor')
    .optional()
    .isLength({ max: 100 }),

  body('nota')
    .optional()
    .isLength({ max: 50 }),

  body('letra')
    .optional()
    .notEmpty().withMessage('La letra no puede estar vacía'),

  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser boolean')
];

const adminSongUpdateValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('himnario')
    .notEmpty().withMessage('El himnario es obligatorio')
    .isIn(VALID_HIMNARIOS).withMessage('Himnario inválido'),

  body('idcancion')
    .notEmpty().withMessage('El número es obligatorio')
    .isInt({ min: 1 }).withMessage('El número debe ser entero positivo')
];

const deleteSongValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

const restoreSongValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

module.exports = {
  createSongValidator,
  updateSongValidator,
  adminSongUpdateValidator,
  deleteSongValidator,
  restoreSongValidator,
  VALID_HIMNARIOS
};
