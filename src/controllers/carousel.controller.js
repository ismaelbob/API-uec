const CarouselImage = require('../models/carouselImage.model');
const { toDirectDriveUrl } = require('../utils/googleDrive');

exports.getCarouselImages = async (req, res) => {
  try {
    const carousel = await CarouselImage.find({ activo: true })
      .sort({ orden: 1, createdAt: 1 });

    res.json({
      ok: true,
      total: carousel.length,
      carousel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener imágenes del carrusel'
    });
  }
};

exports.getCarouselImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await CarouselImage.findOne({ _id: id, activo: true });

    if (!image) {
      return res.status(404).json({
        ok: false,
        message: 'Imagen no encontrada'
      });
    }

    res.json({
      ok: true,
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener imagen'
    });
  }
};

exports.createCarouselImage = async (req, res) => {
  try {
    if (req.body.url) {
      req.body.url = toDirectDriveUrl(req.body.url);
    }

    const image = new CarouselImage(req.body);
    await image.save();

    res.status(201).json({
      ok: true,
      message: 'Imagen creada correctamente',
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al crear imagen'
    });
  }
};

exports.updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.url) {
      req.body.url = toDirectDriveUrl(req.body.url);
    }

    const image = await CarouselImage.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        ok: false,
        message: 'Imagen no encontrada'
      });
    }

    res.json({
      ok: true,
      message: 'Imagen actualizada correctamente',
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar imagen'
    });
  }
};

exports.deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await CarouselImage.findById(id);

    if (!image) {
      return res.status(404).json({
        ok: false,
        message: 'Imagen no encontrada'
      });
    }

    if (!image.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La imagen ya está inactiva'
      });
    }

    image.activo = false;
    await image.save();

    res.json({
      ok: true,
      message: 'Imagen eliminada correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar imagen'
    });
  }
};

exports.restoreCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await CarouselImage.findById(id);

    if (!image) {
      return res.status(404).json({
        ok: false,
        message: 'Imagen no encontrada'
      });
    }

    if (image.activo) {
      return res.status(400).json({
        ok: false,
        message: 'La imagen ya está activa'
      });
    }

    image.activo = true;
    await image.save();

    res.json({
      ok: true,
      message: 'Imagen restaurada correctamente',
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al restaurar imagen'
    });
  }
};

exports.getInactiveCarouselImages = async (req, res) => {
  try {
    const carousel = await CarouselImage.find({ activo: false })
      .sort({ updatedAt: -1 });

    res.json({
      ok: true,
      total: carousel.length,
      carousel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener imágenes inactivas del carrusel'
    });
  }
};