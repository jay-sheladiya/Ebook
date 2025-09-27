const sinon = require('sinon');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

function mockNext() {
  return (err) => { if (err) throw err; };
}

module.exports = { mockResponse, mockNext };
