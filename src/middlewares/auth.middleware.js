const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Leer header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: 'Token no proporcionado'
      });
    }

    // 2️⃣ Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        ok: false,
        message: 'Formato de token inválido'
      });
    }

    const token = parts[1];

    // 3️⃣ Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Guardar info del usuario en la request
    req.user = decoded;

    // 5️⃣ Continuar
    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;
