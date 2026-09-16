const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    cargo: {
      type: String,
      required: true,
      trim: true
    },
    telefono: {
      type: String,
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
    collection: 'leaders'
  }
);

module.exports = mongoose.model('Leader', leaderSchema);