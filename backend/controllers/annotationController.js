const Annotation = require('../models/Annotation');
const Activity = require('../models/Activity');

const createAnnotation = async (req, res, next) => {
  try {
    const { bookId, page, text } = req.body;
    if (!bookId || !page || !text) return res.status(400).json({ message: 'bookId, page and text required' });
    const ann = await Annotation.create({ user: req.user._id, book: bookId, page, text });
    await Activity.create({ user: req.user._id, action: 'annotation:create', target: bookId, details: { annotationId: ann._id, page }});
    const populated = await Annotation.findById(ann._id).populate('book');
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

const listAnnotationsForBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const anns = await Annotation.find({ book: bookId }).populate('user', 'name');
    res.status(200).json(anns);
  } catch (err) { next(err); }
};

const deleteAnnotation = async (req, res, next) => {
  try {
    const ann = await Annotation.findById(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Annotation not found' });
    if (ann.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await ann.remove();
    await Activity.create({ user: req.user._id, action: 'annotation:delete', target: ann.book.toString(), details: { annotationId: ann._id }});
    res.status(200).json({ message: 'Annotation deleted' });
  } catch (err) { next(err); }
};

module.exports = { createAnnotation, listAnnotationsForBook, deleteAnnotation };
