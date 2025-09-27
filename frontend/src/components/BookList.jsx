import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

const BookList = ({ books, setBooks, setEditingBook }) => {
  const { user } = useAuth();

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBooks(books.filter(b => b && b._id !== bookId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete book.');
    }
  };

  // Filter out any undefined books and handle empty state
  const validBooks = books ? books.filter(book => book && book._id) : [];

  if (!books || validBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No books found</div>
        <div className="text-gray-400 mt-2">Add some books to get started</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {validBooks.map(book => (
        <div key={book._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="relative">
            {book.image ? (
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-500 text-4xl">📚</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {book.category}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{book.description}</p>
            
            <div className="flex justify-between items-center">
              <Link 
                to={`/books/${book._id}`} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Read More
              </Link>

              {user?.role === 'admin' && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditingBook(book)} 
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                    title="Edit Book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(book._id)} 
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                    title="Delete Book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default BookList;
