const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    iglesia: {
      type: String,
      trim: true
    },
    lema: {
      type: String,
      trim: true
    },
    logoUrl: {
      type: String,
      trim: true
    },
    direccion: {
      type: String,
      trim: true
    },
    mapaUrl: {
      type: String,
      trim: true
    },
    ciudad: {
      type: String,
      trim: true
    },
    anioFundacion: {
      type: Number
    },
    anioactual: {
      type: Number
    },
    pais: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    redes: [{
      nombre: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      },
      orden: {
        type: Number,
        default: 0
      }
    }]
  },
  {
    timestamps: true,
    collection: 'siteconfig'
  }
);

siteConfigSchema.statics.getSingleton = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('SiteConfig', siteConfigSchema);