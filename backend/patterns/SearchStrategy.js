class SearchStrategy {
  search(books = [], query = '') { throw new Error('Not implemented'); }
}

class TitleSearch extends SearchStrategy {
  search(books, query) {
    const q = String(query || '').toLowerCase();
    return books.filter(b => b.title.toLowerCase().includes(q));
  }
}

class AuthorSearch extends SearchStrategy {
  search(books, query) {
    const q = String(query || '').toLowerCase();
    return books.filter(b => b.author.toLowerCase().includes(q));
  }
}

class CategorySearch extends SearchStrategy {
  search(books, query) {
    const q = String(query || '').toLowerCase();
    return books.filter(b => b.category.toLowerCase() === q);
  }
}

module.exports = { TitleSearch, AuthorSearch, CategorySearch };
