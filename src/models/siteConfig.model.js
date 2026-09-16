const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    iglesia: {
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
    }
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