const { body, param } = require('express-validator');

const idValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

const createLeaderValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),

  body('cargo')
    .notEmpty().withMessage('El cargo es obligatorio')
    .isLength({ max: 100 }).withMessage('Cargo demasiado largo'),

  body('telefono')
    .optional({ nullable: true })
    .isLength({ max: 30 }).withMessage('Teléfono demasiado largo'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

const updateLeaderValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('nombre')
    .optional()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),

  body('cargo')
    .optional()
    .notEmpty().withMessage('El cargo no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Cargo demasiado largo'),

  body('telefono')
    .optional({ nullable: true })
    .isLength({ max: 30 }).withMessage('Teléfono demasiado largo'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

module.exports = {
  createLeaderValidator,
  updateLeaderValidator,
  leaderIdValidator: idValidator
};