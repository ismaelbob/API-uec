const express = require('express');
const router = express.Router();

const {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
  restoreLeader,
  getInactiveLeaders
} = require('../controllers/leader.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createLeaderValidator,
  updateLeaderValidator,
  leaderIdValidator
} = require('../validators/leader.validator');

// READ (público)
router.get('/', getLeaders);
router.get('/admin/inactivos', authMiddleware, requireRole(1), getInactiveLeaders);
router.get('/:id', getLeaderById);

// CREATE (admin)
router.post(
  '/',
  authMiddleware,
  requireRole(1),
  createLeaderValidator,
  validate,
  createLeader
);

// UPDATE (admin)
router.put(
  '/:id',
  authMiddleware,
  requireRole(1),
  updateLeaderValidator,
  validate,
  updateLeader
);

// DELETE (admin) - soft delete
router.delete(
  '/:id',
  authMiddleware,
  requireRole(1),
  leaderIdValidator,
  validate,
  deleteLeader
);

// RESTORE (admin)
router.patch(
  '/:id/restore',
  authMiddleware,
  requireRole(1),
  leaderIdValidator,
  validate,
  restoreLeader
);

module.exports = router;