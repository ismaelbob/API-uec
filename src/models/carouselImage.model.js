const mongoose = require('mongoose');

const carouselImageSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      trim: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    orden: {
      type: Number,
      default: 0
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'carouselimages'
  }
);

module.exports = mongoose.model('CarouselImage', carouselImageSchema);