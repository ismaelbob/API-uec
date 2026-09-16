const express = require('express');
const router = express.Router();

const {
  getCarouselImages,
  getCarouselImageById,
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  restoreCarouselImage,
  getInactiveCarouselImages
} = require('../controllers/carousel.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createCarouselValidator,
  updateCarouselValidator,
  carouselIdValidator
} = require('../validators/carousel.validator');

// READ (público)
router.get('/', getCarouselImages);
router.get('/admin/inactivos', authMiddleware, requireRole(1), getInactiveCarouselImages);
router.get('/:id', getCarouselImageById);

// CREATE (admin)
router.post(
  '/',
  authMiddleware,
  requireRole(1),
  createCarouselValidator,
  validate,
  createCarouselImage
);

// UPDATE (admin)
router.put(
  '/:id',
  authMiddleware,
  requireRole(1),
  updateCarouselValidator,
  validate,
  updateCarouselImage
);

// DELETE (admin) - soft delete
router.delete(
  '/:id',
  authMiddleware,
  requireRole(1),
  carouselIdValidator,
  validate,
  deleteCarouselImage
);

// RESTORE (admin)
router.patch(
  '/:id/restore',
  authMiddleware,
  requireRole(1),
  carouselIdValidator,
  validate,
  restoreCarouselImage
);

module.exports = router;