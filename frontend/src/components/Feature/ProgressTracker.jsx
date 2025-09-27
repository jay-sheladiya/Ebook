import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ArrowRight } from 'lucide-react';

const ProgressTracker = ({ bookId }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ page: 1, percent: 0 });
  const TOTAL_PAGES = 100; // You can fetch dynamically if available

  // Fetch progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/api/features/progress/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProgress(res.data || { page: 1, percent: 0 });
      } catch {
        setProgress({ page: 1, percent: 0 });
      }
    };

    fetchProgress();
  }, [bookId, user]);

  // Update progress on backend
  const updateProgress = async (page) => {
    const newPage = Math.min(page, TOTAL_PAGES);
    const newPercent = Math.round((newPage / TOTAL_PAGES) * 100);

    try {
      const res = await axiosInstance.post(
        '/api/features/progress',
        { bookId, page: newPage, percent: newPercent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProgress(res.data || { page: newPage, percent: newPercent });
    } catch {
      alert('Failed to update progress.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6 transition-all hover:shadow-xl">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
        <BookOpen className="w-5 h-5 text-blue-600" /> Reading Progress
      </h2>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress?.percent ?? 0}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex justify-between items-center text-sm text-gray-700 mb-3">
        <span>
          Page <b>{progress?.page ?? 1}</b> of {TOTAL_PAGES}
        </span>
        <span>{progress?.percent ?? 0}% complete</span>
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => updateProgress((progress?.page ?? 1) + 1)}
        disabled={(progress?.page ?? 1) >= TOTAL_PAGES}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-lg font-medium shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Page <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProgressTracker;
