// AnnotationForm.jsx
import { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { StickyNote, FileText, Send } from 'lucide-react';

const AnnotationForm = ({ bookId, setAnnotations }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ page: 1, text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return alert("Annotation text can't be empty!");

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        '/api/features/annotations',
        { bookId, page: formData.page, text: formData.text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAnnotations((prev) => [...prev, res.data]);
      setFormData({ page: 1, text: '' });
    } catch {
      alert('Failed to add annotation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 mb-6 transition-all hover:shadow-xl"
    >
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
        <StickyNote className="w-5 h-5 text-blue-600" /> Add Annotation
      </h3>

      {/* Page Input */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Page Number
      </label>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-500" />
        <input
          type="number"
          min="1"
          value={formData.page}
          onChange={(e) =>
            setFormData({ ...formData, page: parseInt(e.target.value) || 1 })
          }
          className="flex-1 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 text-sm outline-none transition-all"
        />
      </div>

      {/* Annotation Textarea */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Annotation
      </label>
      <textarea
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        rows="3"
        placeholder="Write your thoughts here..."
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 text-sm outline-none transition-all mb-2 resize-none"
      />
      <div className="text-xs text-gray-500 mb-4 text-right">
        {formData.text.length}/300
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-lg font-medium shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Saving...' : 'Save Annotation'}
      </button>
    </form>
  );
};

export default AnnotationForm;
