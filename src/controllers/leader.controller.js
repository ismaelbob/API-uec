const Leader = require('../models/leader.model');
const { toDirectDriveUrl } = require('../utils/googleDrive');

exports.getLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find({ activo: true })
      .sort({ orden: 1, createdAt: 1 });

    res.json({
      ok: true,
      total: leaders.length,
      leaders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener líderes'
    });
  }
};

exports.getLeaderById = async (req, res) => {
  try {
    const { id } = req.params;

    const leader = await Leader.findOne({ _id: id, activo: true });

    if (!leader) {
      return res.status(404).json({
        ok: false,
        message: 'Líder no encontrado'
      });
    }

    res.json({
      ok: true,
      leader
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener líder'
    });
  }
};

exports.createLeader = async (req, res) => {
  try {
    if (req.body.fotoUrl) {
      req.body.fotoUrl = toDirectDriveUrl(req.body.fotoUrl);
    }

    const leader = new Leader(req.body);
    await leader.save();

    res.status(201).json({
      ok: true,
      message: 'Líder creado correctamente',
      leader
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al crear líder'
    });
  }
};

exports.updateLeader = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.fotoUrl) {
      req.body.fotoUrl = toDirectDriveUrl(req.body.fotoUrl);
    }

    const leader = await Leader.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!leader) {
      return res.status(404).json({
        ok: false,
        message: 'Líder no encontrado'
      });
    }

    res.json({
      ok: true,
      message: 'Líder actualizado correctamente',
      leader
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar líder'
    });
  }
};

exports.deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;

    const leader = await Leader.findById(id);

    if (!leader) {
      return res.status(404).json({
        ok: false,
        message: 'Líder no encontrado'
      });
    }

    if (!leader.activo) {
      return res.status(400).json({
        ok: false,
        message: 'El líder ya está inactivo'
      });
    }

    leader.activo = false;
    await leader.save();

    res.json({
      ok: true,
      message: 'Líder eliminado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar líder'
    });
  }
};

exports.restoreLeader = async (req, res) => {
  try {
    const { id } = req.params;

    const leader = await Leader.findById(id);

    if (!leader) {
      return res.status(404).json({
        ok: false,
        message: 'Líder no encontrado'
      });
    }

    if (leader.activo) {
      return res.status(400).json({
        ok: false,
        message: 'El líder ya está activo'
      });
    }

    leader.activo = true;
    await leader.save();

    res.json({
      ok: true,
      message: 'Líder restaurado correctamente',
      leader
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al restaurar líder'
    });
  }
};

exports.getInactiveLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find({ activo: false })
      .sort({ updatedAt: -1 });

    res.json({
      ok: true,
      total: leaders.length,
      leaders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener líderes inactivos'
    });
  }
};