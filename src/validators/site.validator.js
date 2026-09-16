const { body } = require('express-validator');

const updateSiteValidator = [
  body('iglesia')
    .optional()
    .notEmpty().withMessage('El nombre de la iglesia no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),

  body('logoUrl')
    .optional({ nullable: true })
    .isURL({ require_protocol: true }).withMessage('URL del logo inválida'),

  body('direccion')
    .optional()
    .notEmpty().withMessage('La dirección no puede estar vacía')
    .isLength({ max: 200 }).withMessage('Dirección demasiado larga'),

  body('mapaUrl')
    .optional()
    .notEmpty().withMessage('La URL del mapa no puede estar vacía')
    .isURL({ require_protocol: true }).withMessage('URL del mapa inválida')
];

module.exports = {
  updateSiteValidator
};