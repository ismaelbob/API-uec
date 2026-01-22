const requireRole = (allowedLevels) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado'
      });
    }

    // Normalizamos a array
    const roles = Array.isArray(allowedLevels)
      ? allowedLevels
      : [allowedLevels];

    if (!roles.includes(req.user.nivel)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para esta acción'
      });
    }

    next();
  };
};

module.exports = {
  requireRole
};
