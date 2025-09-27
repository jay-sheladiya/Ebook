import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosConfig";
import { Bookmark, Plus } from "lucide-react";

const BookmarkForm = ({ bookId, currentPage, bookmarks, setBookmarks }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ page: currentPage, note: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.page) return alert("Page number is required");

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/bookmarks",
        {
          bookId,
          page: Number(formData.page),
          note: formData.note,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBookmarks([...bookmarks, res.data]);
      setFormData({ page: currentPage, note: "" });
    } catch (error) {
      console.error("Failed to add bookmark:", error.response || error);
      alert("Failed to add bookmark. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl"
    >
      <h1 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Bookmark className="w-5 h-5 text-blue-600" /> Add Bookmark
      </h1>

      {/* Page Number */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Page Number
      </label>
      <input
        type="number"
        value={formData.page}
        onChange={(e) => setFormData({ ...formData, page: e.target.value })}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
        min="1"
      />

      {/* Note */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Note (optional)
      </label>
      <textarea
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full mb-2 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none"
        rows="3"
        maxLength={300}
        placeholder="Add a short note..."
      />
      <div className="text-xs text-gray-500 mb-4 text-right">
        {formData.note.length}/300
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-lg font-medium shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </form>
  );
};

export default BookmarkForm;
