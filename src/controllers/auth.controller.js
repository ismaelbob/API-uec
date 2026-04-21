const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/email.service');

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
      { expiresIn: '5m' }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '15m' }
    );

    // guardar refresh token en DB
    user.refreshToken = refreshToken;
    await user.save();
    // 5️⃣ Respuesta (NO devolvemos password)
    res.json({
      ok: true,
      _id: user._id,
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
      { expiresIn: '5m' }
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

exports.verify = async (req, res) => {
  res.json({
    ok: true,
    message: 'Token válido',
    user: {
      _id: req.user.id,
      usuario: req.user.usuario,
      nombre: req.user.nombre,
      nivel: req.user.nivel
    }
  });
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

exports.register = async (req, res) => {
  try {
    const { usuario, password, nombre, email } = req.body;

    const existingUser = await User.findOne({
      $or: [{ usuario }, { email }]
    });

    if (existingUser) {
      if (existingUser.usuario === usuario) {
        return res.status(400).json({
          ok: false,
          message: 'El usuario ya existe'
        });
      }
      return res.status(400).json({
        ok: false,
        message: 'El email ya está registrado'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      usuario,
      password: hashedPassword,
      nombre,
      email,
      nivel: 3,
      activo: true,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado. Por favor verifica tu email.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: 'Token requerido'
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'Token inválido o expirado'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      ok: true,
      message: 'Email verificado correctamente. Ya puedes iniciar sesión.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        ok: false,
        message: 'El email ya está verificado'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.json({
      ok: true,
      message: 'Email de verificación reenviado'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};
