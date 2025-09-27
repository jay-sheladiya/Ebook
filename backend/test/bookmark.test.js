const sinon = require('sinon');
const { expect } = require('chai');
const Bookmark = require('../models/Bookmark');
const { createBookmark, updateBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const { mockNext } = require('./utils');

describe('Bookmark Controller', function() {
  this.timeout(5000);
  let sandbox;

  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('createBookmark validates body', async () => {
    const req = { user: { _id: 'u1' }, body: { note: 'x' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createBookmark(req, res, mockNext());
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('createBookmark success', async () => {
    const fakeBookmark = { _id: 'b1', user: 'u1', book: 'bk1', page: 1 };
    sandbox.stub(Bookmark, 'create').resolves(fakeBookmark);
    sandbox.stub(Bookmark, 'findById').returns({
      populate: sinon.stub().resolves(fakeBookmark)
    });

    const req = { user: { _id: 'u1' }, body: { bookId: 'bk1', page: 1 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createBookmark(req, res, mockNext());
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('updateBookmark not found', async () => {
    sandbox.stub(Bookmark, 'findById').resolves(null);
    const req = { user: { _id: 'u1' }, params: { id: 'x' }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateBookmark(req, res, mockNext());
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('deleteBookmark forbidden when not owner', async () => {
    sandbox.stub(Bookmark, 'findById').resolves({ user: 'other' });
    const req = { user: { _id: 'u1' }, params: { id: 'x' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteBookmark(req, res, mockNext());
    expect(res.status.calledWith(403)).to.be.true;
  });
});
