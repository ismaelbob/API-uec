const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  nivel: {
    type: Number,
    default: 1
  },
  activo: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
