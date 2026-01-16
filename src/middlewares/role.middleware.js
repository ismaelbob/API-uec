const requireAdmin = (req, res, next) => {
  // req.user viene del authMiddleware
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: 'No autenticado'
    });
  }

  if (req.user.nivel !== 1) {
    return res.status(403).json({
      ok: false,
      message: 'No tienes permisos para esta acción'
    });
  }

  next();
};

module.exports = {
  requireAdmin
};
