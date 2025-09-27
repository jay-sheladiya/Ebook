const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin routes with image upload
router.post('/', protect, adminOnly, upload.single('image'), createBook);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
