const sinon = require('sinon');
const { expect } = require('chai');
const Book = require('../models/Book');
const NotificationService = require('../patterns/NotificationService');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { mockNext } = require('./utils');

describe('Book Controller', function() {
  this.timeout(5000);
  let sandbox;

  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('getBooks returns decorated list', async () => {
    const dummy = [{ title: 'T1', author: 'A', category: 'C', content: 'Hello' }];
    sandbox.stub(Book, 'find').resolves(dummy);
    const req = { query: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getBooks(req, res, mockNext());
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('createBook success', async () => {
    const payload = { title: 'T1', author: 'A', category: 'C', content: 'X' };
    sandbox.stub(Book, 'create').resolves({ _id: '1', ...payload });
    const notifySpy = sandbox.spy(NotificationService, 'notify');

    const req = { body: payload };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createBook(req, res, mockNext());
    expect(res.status.calledWith(201)).to.be.true;
    expect(notifySpy.calledOnce).to.be.true;
  });

  it('getBookById returns 404 when not found', async () => {
    sandbox.stub(Book, 'findById').returns({
      populate: sinon.stub().resolves(null)
    });
    const req = { params: { id: 'x' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getBookById(req, res, mockNext());
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('deleteBook deletes and responds', async () => {
    const book = { remove: sinon.stub().resolves() };
    sandbox.stub(Book, 'findById').resolves(book);

    const req = { params: { id: '1' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteBook(req, res, mockNext());
    expect(book.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Book deleted' })).to.be.true;
  });
});
