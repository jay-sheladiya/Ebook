class BookDecorator {
  constructor(book) { this.book = book; }
  withPreview(length = 120) {
    const preview = (this.book.content || '').slice(0, length);
    return { ...this.book.toObject ? this.book.toObject() : this.book, preview };
  }
}

module.exports = BookDecorator;
