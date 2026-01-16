const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // 1️⃣ Validación (equivale a PHP)
    if (!usuario || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario y contraseña obligatorios'
      });
    }

    // 2️⃣ Buscar usuario
    const user = await User.findOne({ usuario });

    if (!user || !user.activo) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }


    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // 3️⃣ Verificar password (bcrypt reemplaza MD5)
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // 4️⃣ Crear token (reemplaza sesión PHP)
    const accessToken = jwt.sign(
      {
        id: user._id,
        usuario: user.usuario,
        nombre: user.nombre,
        nivel: user.nivel
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // guardar refresh token en DB
    user.refreshToken = refreshToken;
    await user.save();
    // 5️⃣ Respuesta (NO devolvemos password)
    res.json({
      ok: true,
      usuario: user.usuario,
      nombre: user.nombre,
      nivel: user.nivel,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      ok: false,
      message: 'Refresh token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        ok: false,
        message: 'Refresh token inválido'
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        nivel: user.nivel
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      ok: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    res.status(403).json({
      ok: false,
      message: 'Refresh token expirado'
    });
  }
};

exports.logout = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({
    ok: true,
    message: 'Sesión cerrada'
  });
};
