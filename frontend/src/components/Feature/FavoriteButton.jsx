import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

const FavoriteButton = ({ bookId }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/api/features/favorites', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIsFavorite(res.data.some((f) => f.book._id === bookId));
      } catch {
        // fail silently
      }
    };
    if (user) fetchFavorites();
  }, [bookId, user]);

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(
        '/api/features/favorites',
        { bookId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsFavorite((prev) => !prev);
    } catch {
      alert('Failed to toggle favorite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all 
        ${isFavorite ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'} 
        disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-6 h-6 transition-transform duration-300 
          ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500 hover:text-red-500'}`}
      />
    </button>
  );
};

export default FavoriteButton;
