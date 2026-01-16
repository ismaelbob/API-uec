const express = require('express');
const router = express.Router();

const { createUser, getUsers, getUserById, updateUser, deleteUser, restoreUser } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');
const { requireAdmin } = require('../middlewares/role.middleware');


// 🔐 TODAS las rutas protegidas
// CREATE
router.post(
  '/',
  authMiddleware,
  createUserValidator,
  validate,
  createUser
);

// READ
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);

// UPDATE
router.put(
  '/:id',
  authMiddleware,
  updateUserValidator,
  validate,
  updateUser
);

// DELETE
router.delete(
  '/:id',
  authMiddleware,
  requireAdmin,
  deleteUser
);

// RESTORE
router.patch(
  '/:id/restore',
  authMiddleware,
  requireAdmin,
  restoreUser
);

module.exports = router;
