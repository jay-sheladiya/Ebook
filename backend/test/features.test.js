const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const ReadingProgress = require('../models/ReadingProgress');
const Annotation = require('../models/Annotation');
const Favorite = require('../models/Favorite');
const Activity = require('../models/Activity');
const { updateProgress } = require('../controllers/progressController');
const { createAnnotation } = require('../controllers/annotationController');
const { toggleFavorite } = require('../controllers/favoriteController');
const { mockResponse, mockNext } = require('./utils');

describe('Feature Controllers', () => {
  let sandbox;
  beforeEach(()=> { sandbox = sinon.createSandbox(); });
  afterEach(()=> { sandbox.restore(); });

  it('updateProgress creates new progress when none exists', async () => {
    sandbox.stub(ReadingProgress, 'findOne').resolves(null);
    sandbox.stub(ReadingProgress, 'create').resolves({});
    sandbox.stub(Activity, 'create').resolves({});
    const req = { user: { _id: mongoose.Types.ObjectId() }, body: { bookId: mongoose.Types.ObjectId(), page: 5, percent: 50 } };
    const res = mockResponse();
    const next = mockNext();
    await updateProgress(req, res, next);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('createAnnotation returns 201 with populated annotation', async () => {
    const annId = mongoose.Types.ObjectId();
    sandbox.stub(Annotation, 'create').resolves({ _id: annId });
    sandbox.stub(Annotation, 'findById').returns({
      populate: sinon.stub().resolves({ _id: annId, book: { title: 't' }, text: 'Note' })
    });
    const req = { user: { _id: mongoose.Types.ObjectId() }, body: { bookId: mongoose.Types.ObjectId(), page: 3, text: 'Note' } };
    const res = mockResponse();
    const next = mockNext();
    await createAnnotation(req, res, next);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('toggleFavorite creates favorite when none exists', async () => {
    sandbox.stub(Favorite, 'findOne').resolves(null);
    sandbox.stub(Favorite, 'create').resolves({});
    sandbox.stub(Activity, 'create').resolves({});
    const req = { user: { _id: mongoose.Types.ObjectId() }, body: { bookId: mongoose.Types.ObjectId() } };
    const res = mockResponse();
    const next = mockNext();
    await toggleFavorite(req, res, next);
    expect(res.status.calledWith(201)).to.be.true;
  });
});
