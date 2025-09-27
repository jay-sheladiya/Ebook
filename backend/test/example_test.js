const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Book = require('../models/Book');
const Bookmark = require('../models/Bookmark');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { getBookmarks, createBookmark, updateBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const { expect } = chai;

chai.use(chaiHttp);

describe('Book and Bookmark Controller Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('CreateBook Function Test', () => {
    it('should create a new book successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { title: 'Test Book', author: 'John Doe', category: 'Fiction', content: 'Sample content' }
      };
      const createdBook = { _id: new mongoose.Types.ObjectId(), ...req.body };
      sandbox.stub(Book, 'create').resolves(createdBook);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createBook(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdBook)).to.be.true;
    });

    it('should return 400 if required fields are missing', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { title: 'Test Book' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createBook(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'All fields are required' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sandbox.stub(Book, 'create').throws(new Error('DB Error'));
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { title: 'Test Book', author: 'John Doe', category: 'Fiction', content: 'Sample content' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('UpdateBook Function Test', () => {
    it('should update book successfully', async () => {
      const bookId = new mongoose.Types.ObjectId();
      const existingBook = {
        _id: bookId,
        title: 'Old Book',
        author: 'Old Author',
        category: 'Fiction',
        content: 'Old content',
        save: sinon.stub().resolvesThis()
      };
      sandbox.stub(Book, 'findById').resolves(existingBook);
      const req = {
        params: { id: bookId },
        body: { title: 'New Book', author: 'New Author' }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateBook(req, res);

      expect(existingBook.title).to.equal('New Book');
      expect(existingBook.author).to.equal('New Author');
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if book is not found', async () => {
      sandbox.stub(Book, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Book not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sandbox.stub(Book, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('GetBooks Function Test', () => {
    it('should return books for the given category', async () => {
      const books = [
        { _id: new mongoose.Types.ObjectId(), title: 'Book 1', author: 'Author 1', category: 'Fiction', content: 'Content 1' },
        { _id: new mongoose.Types.ObjectId(), title: 'Book 2', author: 'Author 2', category: 'Fiction', content: 'Content 2' }
      ];
      sandbox.stub(Book, 'find').resolves(books);
      const req = { query: { category: 'Fiction' } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getBooks(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(books)).to.be.true;
    });

    it('should return all books if no category is provided', async () => {
      const books = [
        { _id: new mongoose.Types.ObjectId(), title: 'Book 1', author: 'Author 1', category: 'Fiction', content: 'Content 1' },
        { _id: new mongoose.Types.ObjectId(), title: 'Book 2', author: 'Author 2', category: 'Non-Fiction', content: 'Content 2' }
      ];
      sandbox.stub(Book, 'find').resolves(books);
      const req = { query: {} };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getBooks(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(books)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sandbox.stub(Book, 'find').throws(new Error('DB Error'));
      const req = { query: {} };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('GetBookById Function Test', () => {
    it('should return a book by ID', async () => {
      const bookId = new mongoose.Types.ObjectId();
      const book = { _id: bookId, title: 'Test Book', author: 'John Doe', category: 'Fiction', content: 'Sample content' };
      sandbox.stub(Book, 'findById').resolves(book);
      const req = { params: { id: bookId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getBookById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(book)).to.be.true;
    });

    it('should return 404 if book is not found', async () => {
      sandbox.stub(Book, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getBookById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Book not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sandbox.stub(Book, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getBookById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('DeleteBook Function Test', () => {
    it('should delete a book successfully', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const book = { remove: sinon.stub().resolves() };
      sandbox.stub(Book, 'findById').resolves(book);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBook(req, res);

      expect(book.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Book deleted' })).to.be.true;
    });

    it('should return 404 if book is not found', async () => {
      sandbox.stub(Book, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Book not found' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sandbox.stub(Book, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('CreateBookmark Function Test', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { note: 'Test note' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createBookmark(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Book ID and page are required' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sandbox.stub(Bookmark, 'create').throws(new Error('DB Error'));
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { bookId: new mongoose.Types.ObjectId(), page: 10, note: 'Test note' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createBookmark(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('UpdateBookmark Function Test', () => {
    it('should return 404 if bookmark is not found', async () => {
      sandbox.stub(Bookmark, 'findById').resolves(null);
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateBookmark(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bookmark not found' })).to.be.true;
    });

    it('should return 403 if user is not authorized', async () => {
      const bookmarkId = new mongoose.Types.ObjectId();
      const existingBookmark = {
        _id: bookmarkId,
        user: new mongoose.Types.ObjectId(),
        book: new mongoose.Types.ObjectId(),
        page: 10,
        note: 'Test note'
      };
      sandbox.stub(Bookmark, 'findById').resolves(existingBookmark);
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: bookmarkId },
        body: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateBookmark(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Not authorized' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sandbox.stub(Bookmark, 'findById').throws(new Error('DB Error'));
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateBookmark(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('GetBookmarks Function Test', () => {
    it('should return 500 on error', async () => {
      sandbox.stub(Bookmark, 'find').throws(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getBookmarks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });

  describe('DeleteBookmark Function Test', () => {
    it('should return 404 if bookmark is not found', async () => {
      sandbox.stub(Bookmark, 'findById').resolves(null);
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBookmark(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bookmark not found' })).to.be.true;
    });

    it('should return 403 if user is not authorized', async () => {
      const bookmarkId = new mongoose.Types.ObjectId();
      const bookmark = {
        _id: bookmarkId,
        user: new mongoose.Types.ObjectId(),
        book: new mongoose.Types.ObjectId(),
        page: 10,
        note: 'Test note'
      };
      sandbox.stub(Bookmark, 'findById').resolves(bookmark);
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: bookmarkId }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBookmark(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Not authorized' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sandbox.stub(Bookmark, 'findById').throws(new Error('DB Error'));
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteBookmark(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
  });
});