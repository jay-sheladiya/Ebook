import { useState, useEffect } from 'react';
import BookFormModal from '../components/BookForm';
import BookList from '../components/BookList';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [category, setCategory] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get('/api/books');
      const mappedBooks = res.data.map(b => ({
        ...b,
        image: b.image ? `${process.env.REACT_APP_API_URL}/uploads/${b.image}` : null,
      }));
      setBooks(mappedBooks);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = category ? books.filter(b => b.category === category) : books;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Library</h1>

      <div className="mb-6 flex justify-center items-center gap-4">
        <label className="font-medium">Filter by Category:</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>

        {user?.role === 'admin' && (
          <button
            onClick={() => setAddBookOpen(true)}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
          >
            + Add Book
          </button>
        )}
      </div>

      <BookList books={filteredBooks} setBooks={setBooks} setEditingBook={setEditingBook} fetchBooks={fetchBooks} />

      {user?.role === 'admin' && (
        <BookFormModal
          isOpen={!!editingBook || addBookOpen}
          onClose={() => { setEditingBook(null); setAddBookOpen(false); fetchBooks(); }}
          books={books}
          setBooks={setBooks}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
        />
      )}
    </div>
  );
};

export default Books;
