const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * CREATE USER
 * POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { usuario, password, nombre, nivel } = req.body;

    const exists = await User.findOne({ usuario });
    if (exists) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario ya existe'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      usuario,
      password: hashedPassword,
      nombre,
      nivel
    });

    await user.save();

    res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente'
    });
      } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};
/**
 * READ USERS
 * GET /api/users
 */
const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const { search, nivel, activo } = req.query;

    const isAdmin = req.user.nivel === 1;

    // 🔐 Filtro base
    const filter = {};

    // 👤 Usuario normal → solo activos
    if (!isAdmin) {
      filter.activo = true;
    }

    // 👑 Admin
    if (isAdmin) {
      if (activo === 'true') {
        filter.activo = true;
      }

    if (activo === 'false') {
        filter.activo = false;
      }
    }

    // 🔍 búsqueda
    if (search) {
      filter.$or = [
        { usuario: { $regex: search, $options: 'i' } },
        { nombre: { $regex: search, $options: 'i' } }
      ];
    }

    // 🎭 filtro por rol
    if (nivel) {
      filter.nivel = Number(nivel);
    }

    const [users, total] = await Promise.all([
      User.find(filter, '-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      User.countDocuments(filter)
    ]);

    res.json({
      ok: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

/**
 * READ USER BY ID
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne(
      { _id: id, activo: true },   // 👈 doble filtro
      '-password'
    );

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      ok: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

/**
 * UPDATE USER
 * PUT /api/users/:id
 */

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, password, nombre, nivel } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const requesterLevel = req.user.nivel;
    const targetLevel = user.nivel;

    // Regla base: no tocar superiores
    if (requesterLevel > targetLevel) {
      return res.status(403).json({
        ok: false,
        message: 'No puedes modificar a un usuario de nivel superior'
      });
    }

    // Campos normales
    if (usuario) user.usuario = usuario;
    if (nombre) user.nombre = nombre;

    // NIVEL
    if (nivel !== undefined) {
      if (requesterLevel !== 1) {
        return res.status(403).json({
          ok: false,
          message: 'Solo un admin puede cambiar el nivel'
        });
      }
      user.nivel = nivel;
    }

    // PASSWORD
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ ok: true, message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};
/**
 * DELETE USER (soft delete)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    user.activo = false;
    await user.save();

    res.json({
      ok: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

/**
 * RESTORE USER
 * PATCH /api/users/:id/restore
 */
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.activo === true) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario ya está activo'
      });
    }

    user.activo = true;
    await user.save();

    res.json({
      ok: true,
      message: 'Usuario restaurado correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error del servidor'
    });
  }
};

const getInactiveUsers = async (req, res) => {
  try {
    const users = await User.find(
      { activo: false },
      { password: 0 } // excluimos password
    ).sort({ createdAt: -1 });

    res.json({
      ok: true,
      total: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener usuarios inactivos'
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  getInactiveUsers
};

