class LibraryFacade {
  constructor(bookModel, bookmarkModel, notifier) {
    this.bookModel = bookModel;
    this.bookmarkModel = bookmarkModel;
    this.notifier = notifier;
  }

  async publishBook(user, data) {
    if (!user || user.role !== 'admin') {
      const e = new Error('Not allowed');
      e.statusCode = 403;
      throw e;
    }
    const book = await this.bookModel.create(data);
    this.notifier.notify('book:published', { book });
    return book;
  }

  async listBooks(filter = {}) {
    return this.bookModel.find(filter);
  }

  async createBookmark(payload) {
    return this.bookmarkModel.create(payload);
  }
}

module.exports = LibraryFacade;
