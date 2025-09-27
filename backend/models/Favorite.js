const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
