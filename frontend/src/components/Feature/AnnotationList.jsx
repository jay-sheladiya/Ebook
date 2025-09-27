// AnnotationList.jsx
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Bookmark } from 'lucide-react';

const AnnotationList = ({ annotations, setAnnotations }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/features/annotations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAnnotations((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Failed to delete annotation.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">📌 Annotations</h3>

      {annotations.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No annotations yet.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {annotations.map((a) => (
            <div
              key={a._id}
              className="flex items-start justify-between gap-3 bg-gray-50 hover:bg-gray-100 transition-all p-4 rounded-xl shadow-sm"
            >
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Bookmark className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Page {a.page}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{a.text}</p>
                {a.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(a._id)}
                className="p-2 rounded-full hover:bg-red-100 transition-colors group"
              >
                <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnotationList;
