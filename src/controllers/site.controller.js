const SiteConfig = require('../models/siteConfig.model');
const Leader = require('../models/leader.model');
const Meeting = require('../models/meeting.model');
const CarouselImage = require('../models/carouselImage.model');

exports.getConfig = async (req, res) => {
  try {
    const site = await SiteConfig.getSingleton();

    res.json({
      ok: true,
      site
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener la configuración del sitio'
    });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const site = await SiteConfig.getSingleton();

    const { iglesia, logoUrl, direccion, mapaUrl } = req.body;

    if (iglesia !== undefined) site.iglesia = iglesia;
    if (logoUrl !== undefined) site.logoUrl = logoUrl;
    if (direccion !== undefined) site.direccion = direccion;
    if (mapaUrl !== undefined) site.mapaUrl = mapaUrl;

    await site.save();

    res.json({
      ok: true,
      message: 'Configuración actualizada correctamente',
      site
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar la configuración del sitio'
    });
  }
};

exports.getHomeData = async (req, res) => {
  try {
    const [site, leaders, meetings, carousel] = await Promise.all([
      SiteConfig.getSingleton(),
      Leader.find({ activo: true }).sort({ orden: 1, createdAt: 1 }),
      Meeting.find({ activo: true }).sort({ orden: 1, createdAt: 1 }),
      CarouselImage.find({ activo: true }).sort({ orden: 1, createdAt: 1 })
    ]);

    res.json({
      ok: true,
      data: {
        site,
        leaders,
        meetings,
        carousel
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al obtener los datos de la página principal'
    });
  }
};