require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const NotificationService = require('./patterns/NotificationService');
const featureRoutes = require('./routes/featureRoutes');
const cors = require('cors');
const path = require('path');

// connect DB (no-op if MONGO_URI not set)
connectDB();

const app = express();
app.use(express.json());

// Subscribe a sample notification handler (Observer pattern)
NotificationService.subscribe('book:published', (payload) => {
  console.log('[NOTIFY] New book published:', payload.title || payload.book?.title);
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // only if you use cookies
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/features', featureRoutes);

// Error handler as last middleware
app.use(errorHandler);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
