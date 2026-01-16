const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const optionalAuth = require('./middlewares/optionalAuth.middleware');//para mostar mensaje de bienvenida si hay token

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Rutas
app.use('/api/users', userRoutes);

// Ruta de bienvenida
app.get('/', optionalAuth, (req, res) => {
  if (req.user) {
    return res.json({
      ok: true,
      message: `Bienvenido ${req.user.nombre}`,
      user: {
        id: req.user.id,
        nivel: req.user.nivel
      }
    });
  }

  res.json({
    ok: true,
    message: 'API funcionando'
  });
});

//Ruta de canciones
app.use('/api/songs', require('./routes/song.routes'));

module.exports = app;
