const Book = require('../models/Book');

// GET all books
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// GET single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// CREATE new book
const createBook = async (req, res, next) => {
  try {
    const { title, author, category, description, content } = req.body;

    const image = req.files?.image?.[0]?.filename
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`
      : null;

    const book = await Book.create({
      title,
      author,
      category,
      description,
      content,
      image
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// UPDATE book
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, category, description, content } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.content = content || book.content;

    if (req.files?.image?.[0]?.filename) {
      book.image = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
    }

    const updated = await book.save();
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE book
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.remove();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
