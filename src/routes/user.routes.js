const express = require('express');
const router = express.Router();

const { createUser, getUsers, getUserById, updateUser, deleteUser, restoreUser, getInactiveUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');
const { requireRole } = require('../middlewares/role.middleware');


// 🔐 TODAS las rutas protegidas
// CREATE
router.post(
  '/',
  authMiddleware,
  createUserValidator,
  validate,
  createUser
);

// Admin - ver usuarios inactivos
router.get(
  '/admin/inactivos',
  authMiddleware,
  requireRole(1),
  getInactiveUsers
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
  requireRole(1),
  deleteUser
);

// RESTORE
router.patch(
  '/:id/restore',
  authMiddleware,
  requireRole(1),
  restoreUser
);


module.exports = router;
