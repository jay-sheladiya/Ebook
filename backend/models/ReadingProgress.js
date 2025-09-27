const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  page: { type: Number, default: 1 },
  percent: { type: Number, min: 0, max: 100, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
