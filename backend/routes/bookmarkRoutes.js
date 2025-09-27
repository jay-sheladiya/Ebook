const express = require('express');
const { getBookmarks, createBookmark, updateBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, getBookmarks);
router.post('/', protect, createBookmark);
router.put('/:id', protect, updateBookmark);
router.delete('/:id', protect, deleteBookmark);

module.exports = router;
