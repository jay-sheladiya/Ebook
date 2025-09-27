const ReadingProgress = require('../models/ReadingProgress');
const Activity = require('../models/Activity');

const updateProgress = async (req, res, next) => {
  try {
    const { bookId, page, percent } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId required' });

    let rp = await ReadingProgress.findOne({ user: req.user._id, book: bookId });
    if (!rp) {
      rp = await ReadingProgress.create({
        user: req.user._id,
        book: bookId,
        page: page || 1,
        percent: percent || 0
      });
      await Activity.create({ user: req.user._id, action: 'progress:create', target: bookId, details: { page, percent }});
      return res.status(201).json(rp);
    }

    rp.page = page || rp.page;
    rp.percent = (percent !== undefined) ? percent : rp.percent;
    rp.updatedAt = new Date();
    await rp.save();
    await Activity.create({ user: req.user._id, action: 'progress:update', target: bookId, details: { page, percent }});
    return res.status(200).json(rp);
  } catch (err) { next(err); }
};

const getProgressForBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const rp = await ReadingProgress.findOne({ user: req.user._id, book: bookId });
    res.status(200).json(rp || null);
  } catch (err) { next(err); }
};

module.exports = { updateProgress, getProgressForBook };
