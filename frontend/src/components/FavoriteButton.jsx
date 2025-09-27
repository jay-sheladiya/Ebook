import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const FavoriteButton = ({ bookId }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/api/features/favorites', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIsFavorite(res.data.some((f) => f.book._id === bookId));
      } catch {}
    };
    if (user) fetchFavorites();
  }, [bookId, user]);

  const toggleFavorite = async () => {
    try {
      const res = await axiosInstance.post(
        '/api/features/favorites',
        { bookId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsFavorite(!isFavorite);
    } catch {
      alert('Failed to toggle favorite.');
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-green-500'} text-white`}
    >
      {isFavorite ? 'Unfavorite' : 'Favorite'}
    </button>
  );
};

export default FavoriteButton;
