const { body, param } = require('express-validator');

const idValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

const createCarouselValidator = [
  body('url')
    .notEmpty().withMessage('La URL de la imagen es obligatoria')
    .isURL({ require_protocol: true }).withMessage('URL de imagen inválida'),

  body('titulo')
    .optional()
    .isLength({ max: 100 }).withMessage('Título demasiado largo'),

  body('descripcion')
    .optional()
    .isLength({ max: 200 }).withMessage('Descripción demasiado larga'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

const updateCarouselValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('url')
    .optional()
    .notEmpty().withMessage('La URL no puede estar vacía')
    .isURL({ require_protocol: true }).withMessage('URL de imagen inválida'),

  body('titulo')
    .optional()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Título demasiado largo'),

  body('descripcion')
    .optional()
    .notEmpty().withMessage('La descripción no puede estar vacía')
    .isLength({ max: 200 }).withMessage('Descripción demasiado larga'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

module.exports = {
  createCarouselValidator,
  updateCarouselValidator,
  carouselIdValidator: idValidator
};