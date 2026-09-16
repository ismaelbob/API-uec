const express = require('express');
const router = express.Router();

const {
  getConfig,
  updateConfig,
  getHomeData
} = require('../controllers/site.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const { updateSiteValidator } = require('../validators/site.validator');

router.get('/home', getHomeData);

router.get('/', getConfig);

router.put(
  '/',
  authMiddleware,
  requireRole(1),
  updateSiteValidator,
  validate,
  updateConfig
);

module.exports = router;