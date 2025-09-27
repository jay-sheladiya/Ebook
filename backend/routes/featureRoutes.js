const express = require('express');
const { updateProgress, getProgressForBook } = require('../controllers/progressController');
const { createAnnotation, listAnnotationsForBook, deleteAnnotation } = require('../controllers/annotationController');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { listActivities } = require('../controllers/activityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Reading progress
router.post('/progress', protect, updateProgress);           // create/update progress
router.get('/progress/:bookId', protect, getProgressForBook);

// Annotations
router.post('/annotations', protect, createAnnotation);
router.get('/annotations/:bookId', protect, listAnnotationsForBook);
router.delete('/annotations/:id', protect, deleteAnnotation);

// Favorites
router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

// Activities
router.get('/activities', protect, listActivities); // admin can use ?all=true

module.exports = router;
