const Song = require('../models/song.model');

exports.getSongs = async (req, res) => {
  try {
    const { himnario } = req.query;

    const filter = { activo: true };

    if (himnario) {
      filter.himnario = himnario;
    }

    const songs = await Song.find(filter).sort({ titulo: 1 });

    res.json({
      ok: true,
      total: songs.length,
      songs
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener canciones'
    });
  }
};

exports.createSong = async (req, res) => {
  try {
    const { himnario, idcancion } = req.body;

    const exists = await Song.findOne({ himnario, idcancion });
    if (exists) {
      return res.status(400).json({
        ok: false,
        message: 'Ese número ya existe en este himnario'
      });
    }

    const song = new Song(req.body);
    await song.save();

    res.status(201).json({
      ok: true,
      song
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear canción'
    });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const { id } = req.params;

    // Evitar que cambien identidad
    delete req.body.himnario;
    delete req.body.idcancion;

    const song = await Song.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!song) {
      return res.status(404).json({
        ok: false,
        message: 'Canción no encontrada'
      });
    }

    res.json({
      ok: true,
      song
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar canción'
    });
  }
};

exports.updateSongAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { himnario, idcancion } = req.body;

    // Verificar que exista la canción
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        ok: false,
        message: 'Canción no encontrada'
      });
    }

    // Verificar conflicto de numeración
    const exists = await Song.findOne({
      _id: { $ne: id },
      himnario,
      idcancion
    });

    if (exists) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe una canción con ese número en ese himnario'
      });
    }

    song.himnario = himnario;
    song.idcancion = idcancion;

    await song.save();

    res.json({
      ok: true,
      message: 'Canción actualizada por administrador',
      song
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar canción (admin)'
    });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        ok: false,
        message: 'Canción no encontrada'
      });
    }

    if (!song.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La canción ya está inactiva'
      });
    }

    song.activo = false;
    await song.save();

    res.json({
      ok: true,
      message: 'Canción eliminada correctamente'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar canción'
    });
  }
};

exports.restoreSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        ok: false,
        message: 'Canción no encontrada'
      });
    }

    if (song.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La canción ya está activa'
      });
    }

    // Verificar conflicto de numeración
    const conflict = await Song.findOne({
      _id: { $ne: id },
      himnario: song.himnario,
      idcancion: song.idcancion,
      activo: true
    });

    if (conflict) {
      return res.status(400).json({
        ok: false,
        message: 'No se puede restaurar: conflicto de numeración'
      });
    }

    song.activo = true;
    await song.save();

    res.json({
      ok: true,
      message: 'Canción restaurada correctamente',
      song
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al restaurar canción'
    });
  }
};

exports.getInactiveSongs = async (req, res) => {
  try {
    const { himnario } = req.query;

    const filter = { activo: false };

    if (himnario) {
      filter.himnario = himnario;
    }

    const songs = await Song.find(filter)
      .sort({ himnario: 1, idcancion: 1 })
      .select('_id himnario idcancion titulo');

    res.json({
      ok: true,
      total: songs.length,
      songs
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener canciones inactivas'
    });
  }
};

exports.getNextSongNumber = async (req, res) => {
  try {
    const { himnario } = req.params;

    const lastSong = await Song.findOne({ himnario })
      .sort({ idcancion: -1 })
      .select('idcancion');

    const nextId = lastSong ? lastSong.idcancion + 1 : 1;

    res.json({
      ok: true,
      himnario,
      nextId
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el siguiente número'
    });
  }
};

exports.getSongsByHimnario = async (req, res) => {
  try {
    const { himnario } = req.params;

    const songs = await Song.find({
      himnario,
      activo: true
    })
      .sort({ idcancion: 1 });

    res.json({
      ok: true,
      total: songs.length,
      songs
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener canciones'
    });
  }
};

exports.searchSongsText = async (req, res) => {
  try {
    const { q, himnario } = req.query;

    if (!q) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar un término de búsqueda'
      });
    }

    const filter = {
      $text: { $search: q },
      activo: true
    };

    if (himnario) {
      filter.himnario = himnario;
    }

    const songs = await Song.find(filter, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' } })
      .select('_id himnario idcancion titulo letra');

    res.json({
      ok: true,
      total: songs.length,
      songs
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error en la búsqueda'
    });
  }
};
