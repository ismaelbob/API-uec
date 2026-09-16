const Meeting = require('../models/meeting.model');

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ activo: true })
      .sort({ orden: 1, createdAt: 1 });

    res.json({
      ok: true,
      total: meetings.length,
      meetings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener reuniones'
    });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findOne({ _id: id, activo: true });

    if (!meeting) {
      return res.status(404).json({
        ok: false,
        message: 'Reunión no encontrada'
      });
    }

    res.json({
      ok: true,
      meeting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener reunión'
    });
  }
};

exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();

    res.status(201).json({
      ok: true,
      message: 'Reunión creada correctamente',
      meeting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al crear reunión'
    });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({
        ok: false,
        message: 'Reunión no encontrada'
      });
    }

    res.json({
      ok: true,
      message: 'Reunión actualizada correctamente',
      meeting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar reunión'
    });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        ok: false,
        message: 'Reunión no encontrada'
      });
    }

    if (!meeting.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La reunión ya está inactiva'
      });
    }

    meeting.activo = false;
    await meeting.save();

    res.json({
      ok: true,
      message: 'Reunión eliminada correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar reunión'
    });
  }
};

exports.restoreMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        ok: false,
        message: 'Reunión no encontrada'
      });
    }

    if (meeting.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La reunión ya está activa'
      });
    }

    meeting.activo = true;
    await meeting.save();

    res.json({
      ok: true,
      message: 'Reunión restaurada correctamente',
      meeting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al restaurar reunión'
    });
  }
};

exports.getInactiveMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ activo: false })
      .sort({ updatedAt: -1 });

    res.json({
      ok: true,
      total: meetings.length,
      meetings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener reuniones inactivas'
    });
  }
};