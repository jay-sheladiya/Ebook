import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { Bookmark, Trash2 } from "lucide-react";

const BookmarkList = ({ bookmarks, setBookmarks }) => {
  const { user } = useAuth();

  const handleDelete = async (bookmarkId) => {
    try {
      await axiosInstance.delete(`/api/bookmarks/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId));
    } catch (error) {
      console.error("Failed to delete bookmark:", error.response || error);
      alert("Failed to delete bookmark.");
    }
  };

  if (!bookmarks.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        <Bookmark className="mx-auto w-8 h-8 mb-2 text-gray-400" />
        <p>No bookmarks added yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-blue-600" />
        Your Bookmarks
      </h2>

      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-start hover:shadow-md transition-all"
          >
            <div>
              {/* Page badge */}
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                Page {bookmark.page}
              </span>

              {/* Note */}
              {bookmark.note && (
                <p className="text-sm text-gray-700 mb-1">{bookmark.note}</p>
              )}

              {/* Book title */}
              <p className="text-xs text-gray-500">
                Book:{" "}
                <span className="font-medium text-gray-700">
                  {bookmark.book?.title || "Unknown"}
                </span>
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(bookmark._id)}
              className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
              title="Delete Bookmark"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
