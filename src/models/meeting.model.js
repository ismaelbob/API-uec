const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    dia: {
      type: String,
      required: true,
      trim: true
    },
    hora: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
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
    collection: 'meetings'
  }
);

module.exports = mongoose.model('Meeting', meetingSchema);