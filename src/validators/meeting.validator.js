const { body, param } = require('express-validator');

const idValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

const createMeetingValidator = [
  body('dia')
    .notEmpty().withMessage('El día es obligatorio')
    .isLength({ max: 20 }).withMessage('Día demasiado largo'),

  body('hora')
    .notEmpty().withMessage('La hora es obligatoria')
    .isLength({ max: 10 }).withMessage('Hora demasiado larga'),

  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 150 }).withMessage('Descripción demasiado larga'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

const updateMeetingValidator = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('dia')
    .optional()
    .notEmpty().withMessage('El día no puede estar vacío')
    .isLength({ max: 20 }).withMessage('Día demasiado largo'),

  body('hora')
    .optional()
    .notEmpty().withMessage('La hora no puede estar vacía')
    .isLength({ max: 10 }).withMessage('Hora demasiado larga'),

  body('descripcion')
    .optional()
    .notEmpty().withMessage('La descripción no puede estar vacía')
    .isLength({ max: 150 }).withMessage('Descripción demasiado larga'),

  body('orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

module.exports = {
  createMeetingValidator,
  updateMeetingValidator,
  meetingIdValidator: idValidator
};