// returns a Mongoose User model instance (not persisted automatically)
const UserModel = require('../models/User');

class UserFactory {
  static create({ name, email, password, role = 'reader', university, address }) {
    return new UserModel({ name, email, password, role, university, address });
  }
}

module.exports = UserFactory;
