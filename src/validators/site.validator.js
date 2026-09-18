const { body } = require('express-validator');

const updateSiteValidator = [
  body('iglesia')
    .optional()
    .notEmpty().withMessage('El nombre de la iglesia no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),

  body('lema')
    .optional()
    .notEmpty().withMessage('El lema no puede estar vacío')
    .isLength({ max: 100 }).withMessage('Lema demasiado largo'),

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
    .isURL({ require_protocol: true }).withMessage('URL del mapa inválida'),

  body('ciudad')
    .optional()
    .notEmpty().withMessage('La ciudad no puede estar vacía')
    .isLength({ max: 100 }).withMessage('Ciudad demasiado larga'),

  body('anioFundacion')
    .optional({ nullable: true })
    .isInt({ min: 1800, max: 2100 }).withMessage('Año de fundación inválido'),

  body('anioactual')
    .optional({ nullable: true })
    .isInt({ min: 1800, max: 2100 }).withMessage('Año actual inválido'),

  body('pais')
    .optional()
    .notEmpty().withMessage('El país no puede estar vacío')
    .isLength({ max: 100 }).withMessage('País demasiado largo'),

  body('telefono')
    .optional({ nullable: true })
    .isLength({ max: 30 }).withMessage('Teléfono demasiado largo'),

  body('email')
    .optional({ nullable: true })
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('redes')
    .optional()
    .isArray({ max: 20 }).withMessage('Demasiadas redes sociales'),

  body('redes.*.nombre')
    .notEmpty().withMessage('El nombre de la red es obligatorio')
    .isLength({ max: 50 }).withMessage('Nombre de red demasiado largo'),

  body('redes.*.url')
    .notEmpty().withMessage('La URL de la red es obligatoria')
    .isURL({ require_protocol: true }).withMessage('URL de red inválida'),

  body('redes.*.orden')
    .optional()
    .isInt({ min: 0 }).withMessage('Orden inválido')
];

module.exports = {
  updateSiteValidator
};