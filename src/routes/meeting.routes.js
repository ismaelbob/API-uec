const express = require('express');
const router = express.Router();

const {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  restoreMeeting,
  getInactiveMeetings
} = require('../controllers/meeting.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createMeetingValidator,
  updateMeetingValidator,
  meetingIdValidator
} = require('../validators/meeting.validator');

// READ (público)
router.get('/', getMeetings);
router.get('/admin/inactivos', authMiddleware, requireRole(1), getInactiveMeetings);
router.get('/:id', getMeetingById);

// CREATE (admin)
router.post(
  '/',
  authMiddleware,
  requireRole(1),
  createMeetingValidator,
  validate,
  createMeeting
);

// UPDATE (admin)
router.put(
  '/:id',
  authMiddleware,
  requireRole(1),
  updateMeetingValidator,
  validate,
  updateMeeting
);

// DELETE (admin) - soft delete
router.delete(
  '/:id',
  authMiddleware,
  requireRole(1),
  meetingIdValidator,
  validate,
  deleteMeeting
);

// RESTORE (admin)
router.patch(
  '/:id/restore',
  authMiddleware,
  requireRole(1),
  meetingIdValidator,
  validate,
  restoreMeeting
);

module.exports = router;