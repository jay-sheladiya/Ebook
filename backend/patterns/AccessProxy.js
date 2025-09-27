class AccessProxy {
  constructor(service) {
    this.service = service;
  }

  // Only admin allowed to create book: checks user.role
  async createBook(user, data) {
    if (!user || user.role !== 'admin') {
      const e = new Error('Only admin can create books');
      e.statusCode = 403;
      throw e;
    }
    return this.service.create(data);
  }

  // Directly forward other service methods for simplicity
  async find(id) { return this.service.find(id); }
  async findAll() { return this.service.findAll(); }
}

module.exports = AccessProxy;
