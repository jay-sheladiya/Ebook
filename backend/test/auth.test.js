const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../models/User');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { mockResponse, mockNext } = require('./utils');

describe('Auth Controller', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('registerUser returns 400 if missing fields', async () => {
    const req = { body: { email: 'a@b.com' } };
    const res = mockResponse();
    const next = mockNext();
    await registerUser(req, res, next);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('registerUser creates user', async () => {
    sandbox.stub(User, 'findOne').resolves(null);
    sandbox.stub(User.prototype, 'save').resolvesThis();
    const req = { body: { name: 'N', email: 'e', password: 'p' } };
    const res = mockResponse();
    const next = mockNext();
    await registerUser(req, res, next);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('loginUser invalid credentials', async () => {
    sandbox.stub(User, 'findOne').resolves(null);
    const req = { body: { email: 'x', password: 'p' } };
    const res = mockResponse();
    const next = mockNext();
    await loginUser(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
  });

  it('getProfile returns 404 if not found', async () => {
    sandbox.stub(User, 'findById').returns({
      select: sinon.stub().resolves(null)
    });
    const req = { user: { _id: mongoose.Types.ObjectId() } };
    const res = mockResponse();
    const next = mockNext();
    await getProfile(req, res, next);
    expect(res.status.calledWith(404)).to.be.true;
  });
});
