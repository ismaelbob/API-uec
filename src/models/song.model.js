const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    idcancion: {
      type: Number,
      required: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    autor: {
      type: String,
      trim: true
    },
    nota: {
      type: String,
      trim: true
    },
    letra: {
      type: String,
      required: true
    },
    enlace: {
      type: String,
      trim: true
    },
    himnario: {
      type: String,
      enum: ['jovenes', 'verde', 'poder'],
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'songs'
  }
);

// índice único compuesto
songSchema.index(
  { himnario: 1, idcancion: 1 },
  { unique: true }
);

module.exports = mongoose.model('Song', songSchema);

