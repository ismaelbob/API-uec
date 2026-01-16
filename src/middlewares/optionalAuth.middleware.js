const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No hay token → seguimos sin usuario
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // solo si es válido
  } catch (error) {
    // Token inválido → lo ignoramos
    req.user = null;
  }

  next();
};

module.exports = optionalAuth;