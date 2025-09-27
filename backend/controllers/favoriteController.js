const Favorite = require('../models/Favorite');
const Activity = require('../models/Activity');

const toggleFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId required' });
    const existing = await Favorite.findOne({ user: req.user._id, book: bookId });
    if (existing) {
      await existing.remove();
      await Activity.create({ user: req.user._id, action: 'favorite:remove', target: bookId });
      return res.status(200).json({ removed: true });
    }
    const fav = await Favorite.create({ user: req.user._id, book: bookId });
    await Activity.create({ user: req.user._id, action: 'favorite:add', target: bookId });
    return res.status(201).json(fav);
  } catch (err) { next(err); }
};

const getFavorites = async (req, res, next) => {
  try {
    const favs = await Favorite.find({ user: req.user._id }).populate('book');
    res.status(200).json(favs);
  } catch (err) { next(err); }
};

module.exports = { toggleFavorite, getFavorites };
