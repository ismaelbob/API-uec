const User = require('../models/user.model');
const Song = require('../models/song.model');

const HIMNARIOS_VALIDOS = ['jovenes', 'verde', 'poder'];

exports.getFavorites = async (req, res) => {
  try {
    const { himnario } = req.params;

    if (!HIMNARIOS_VALIDOS.includes(himnario)) {
      return res.status(400).json({
        ok: false,
        message: 'Himnario inválido'
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: 'Token no proporcionado'
      });
    }

    const user = await User.findById(userId).select('favoritos');

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const filter = {
      _id: { $in: user.favoritos },
      himnario,
      activo: true
    };

    const favorites = await Song.find(filter)
      .sort({ idcancion: 1 })
      .select('-letra');

    res.json({
      ok: true,
      total: favorites.length,
      songs: favorites
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener favoritos'
    });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { himnario, songId } = req.params;
    const userId = req.user.id;

    if (!HIMNARIOS_VALIDOS.includes(himnario)) {
      return res.status(400).json({
        ok: false,
        message: 'Himnario inválido'
      });
    }

    const song = await Song.findOne({
      _id: songId,
      himnario,
      activo: true
    });

    if (!song) {
      return res.status(404).json({
        ok: false,
        message: 'Canción no encontrada'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const favoritesObjIds = user.favoritos.map(id => id.toString());

    if (favoritesObjIds.includes(songId)) {
      return res.status(400).json({
        ok: false,
        message: 'La canción ya está en favoritos'
      });
    }

    user.favoritos.push(songId);
    await user.save();

    res.json({
      ok: true,
      message: 'Canción agregada a favoritos',
      song: {
        _id: song._id,
        titulo: song.titulo,
        himnario: song.himnario,
        idcancion: song.idcancion
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al agregar favorito'
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { himnario, songId } = req.params;
    const userId = req.user.id;

    if (!HIMNARIOS_VALIDOS.includes(himnario)) {
      return res.status(400).json({
        ok: false,
        message: 'Himnario inválido'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const favoritesObjIds = user.favoritos.map(id => id.toString());

    if (!favoritesObjIds.includes(songId)) {
      return res.status(400).json({
        ok: false,
        message: 'La canción no está en favoritos'
      });
    }

    user.favoritos = user.favoritos.filter(
      id => id.toString() !== songId
    );
    await user.save();

    res.json({
      ok: true,
      message: 'Canción removida de favoritos'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al remover favorito'
    });
  }
};