const express = require('express');
const router = express.Router();

const { getSongs, createSong, updateSong, deleteSong, restoreSong, getNextSongNumber, getSongsByHimnario, updateSongAdmin, getInactiveSongs, searchSongs } = require('../controllers/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/role.middleware');

const { createSongValidator, updateSongValidator, adminSongUpdateValidator, deleteSongValidator, restoreSongValidator } = require('../validators/song.validator');
const validate = require('../middlewares/validate.middleware');


//obtener canciones
router.get('/', getSongs);
router.get('/:himnario', getSongsByHimnario);

//crear canción
router.post(
  '/',
  authMiddleware,
  createSongValidator,
  validate,
  requireAdmin,
  createSong
);

//actualizar canción
router.put(
  '/:id',
  authMiddleware,
  updateSongValidator,
  validate,
  requireAdmin,
  updateSong
);

//actualizar canción (admin)
router.put(
  '/admin/:id',
  authMiddleware,
  requireAdmin,
  adminSongUpdateValidator,
  validate,
  updateSongAdmin
);

//eliminar canción
router.delete(
  '/:id',
  authMiddleware,
  deleteSongValidator,
  validate,
  requireAdmin,
  deleteSong
);

//restaurar canción
router.patch(
  '/:id/restore',
  authMiddleware,
  requireAdmin,
  restoreSongValidator,
  validate,
  restoreSong
);

//obtener canciones inactivas (admin)
router.get(
  '/admin/inactivos',
  authMiddleware,
  requireAdmin,
  getInactiveSongs
);

//obtener siguiente número de canción en himnario
router.get(
  '/next-number/:himnario',
  getNextSongNumber
);

//buscar canciones
router.get(
  '/search',
  searchSongs
);

module.exports = router;
