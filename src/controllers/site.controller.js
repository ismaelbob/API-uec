const SiteConfig = require('../models/siteConfig.model');
const Leader = require('../models/leader.model');
const Meeting = require('../models/meeting.model');
const CarouselImage = require('../models/carouselImage.model');
const { toDirectDriveUrl } = require('../utils/googleDrive');

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

    const {
      iglesia,
      lema,
      logoUrl,
      direccion,
      mapaUrl,
      ciudad,
      anioFundacion,
      anioactual,
      pais,
      telefono,
      email,
      redes
    } = req.body;

    if (iglesia !== undefined) site.iglesia = iglesia;
    if (lema !== undefined) site.lema = lema;
    if (logoUrl !== undefined) site.logoUrl = toDirectDriveUrl(logoUrl);
    if (direccion !== undefined) site.direccion = direccion;
    if (mapaUrl !== undefined) site.mapaUrl = mapaUrl;
    if (ciudad !== undefined) site.ciudad = ciudad;
    if (anioFundacion !== undefined) site.anioFundacion = anioFundacion;
    if (anioactual !== undefined) site.anioactual = anioactual;
    if (pais !== undefined) site.pais = pais;
    if (telefono !== undefined) site.telefono = telefono;
    if (email !== undefined) site.email = email;
    if (redes !== undefined) site.redes = redes;

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