const express = require('express');
const router = express.Router();

const { getSongs, createSong, updateSong, deleteSong, restoreSong, getNextSongNumber, getSongsByHimnario, updateSongAdmin, getInactiveSongs, searchSongsText } = require('../controllers/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const { createSongValidator, updateSongValidator, adminSongUpdateValidator, deleteSongValidator, restoreSongValidator } = require('../validators/song.validator');
const validate = require('../middlewares/validate.middleware');


//obtener canciones
router.get('/', getSongs);

//buscar canciones
router.get(
  '/search',
  searchSongsText
);

router.get('/:himnario', getSongsByHimnario);

//crear canción
router.post(
  '/',
  authMiddleware,
  createSongValidator,
  validate,
  requireRole(1),
  createSong
);

//actualizar canción
router.put(
  '/:id',
  authMiddleware,
  updateSongValidator,
  validate,
  requireRole(1),
  updateSong
);

//actualizar canción (admin)
router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(1),
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
  requireRole(1),
  deleteSong
);

//restaurar canción
router.patch(
  '/:id/restore',
  authMiddleware,
  requireRole(1),
  restoreSongValidator,
  validate,
  restoreSong
);

//obtener canciones inactivas (admin)
router.get(
  '/admin/inactivos',
  authMiddleware,
  requireRole(1),
  getInactiveSongs
);

//obtener siguiente número de canción en himnario
router.get(
  '/next-number/:himnario',
  getNextSongNumber
);



module.exports = router;
