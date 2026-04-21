const express = require('express');
const router = express.Router();

const { 
  getSongs, 
  createSong, 
  updateSong, 
  deleteSong, 
  restoreSong, 
  getNextSongNumber, 
  getSongsByHimnario, 
  updateSongAdmin, 
  getInactiveSongs, 
  searchSongsText, 
  existsSongInHimnario 
} = require('../controllers/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const optionalAuth = require('../middlewares/optionalAuth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const { 
  createSongValidator, 
  updateSongValidator, 
  adminSongUpdateValidator, 
  deleteSongValidator, 
  restoreSongValidator 
} = require('../validators/song.validator');
const validate = require('../middlewares/validate.middleware');

const { 
  getFavorites, 
  addFavorite, 
  removeFavorite 
} = require('../controllers/favorite.controller');


//obtener canciones
router.get('/', getSongs);

//buscar canciones
router.get(
  '/search',
  searchSongsText
);


//obtener canciones favoritas de un himnario
router.get(
  '/:himnario/favorites',
  optionalAuth,
  getFavorites
);

router.post(
  '/:himnario/favorites/:songId',
  authMiddleware,
  addFavorite
);

router.delete(
  '/:himnario/favorites/:songId',
  authMiddleware,
  removeFavorite
);

router.get(
  '/:himnario/:idcancion/exists',
  existsSongInHimnario
);


router.get('/:himnario', optionalAuth, getSongsByHimnario);

//crear canción
router.post(
  '/',
  authMiddleware,
  createSongValidator,
  validate,
  requireRole([1, 2]),
  createSong
);

//actualizar canción
router.put(
  '/:id',
  authMiddleware,
  updateSongValidator,
  validate,
  requireRole([1, 2]),
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

//eliminar canción (solo admin)
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
