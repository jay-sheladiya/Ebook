import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import ProgressTracker from '../components/Feature/ProgressTracker';
import AnnotationForm from '../components/Feature/AnnotationForm';
import AnnotationList from '../components/Feature/AnnotationList';
import FavoriteButton from '../components/Feature/FavoriteButton';
import ActivityLog from '../components/Feature/ActivityLog';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    image: ''
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch book.');
      }
    };

    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get('/api/bookmarks', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookmarks(res.data.filter((b) => b.book._id === id));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAnnotations = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/api/features/annotations/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAnnotations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
    fetchBookmarks();
    fetchAnnotations();
  }, [id, user]);

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="mb-2">By {book.author}</p>
      <p className="mb-4">Category: {book.category}</p>

      {book.image && (
        <img
          src={book.image.startsWith('http') ? book.image : `${process.env.REACT_APP_API_URL}/uploads/${book.image}`}
          alt={book.title}
          className="mb-4 w-full max-w-md object-cover rounded shadow"
        />
      )}

      {user && <FavoriteButton bookId={id} />}
      {user && <ProgressTracker bookId={id} />}

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold text-lg mb-2">Book Preview</h2>
        <p>{book.content ? book.content.substring(0, 500) : 'No content available'}...</p>
      </div>

      {user && (
        <>
          <BookmarkForm
            bookId={id}
            currentPage={1}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
          />
          <BookmarkList bookmarks={bookmarks} setBookmarks={setBookmarks} />

          <AnnotationForm bookId={id} setAnnotations={setAnnotations} />
          <AnnotationList annotations={annotations} setAnnotations={setAnnotations} />

          <ActivityLog />
        </>
      )}
    </div>
  );
};

export default BookDetail;
