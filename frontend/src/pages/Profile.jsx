import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosConfig";
import { User, Mail, University, MapPin } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          university: response.data.university || "",
          address: response.data.address || "",
        });
      } catch {
        alert("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-20">
      <div className="bg-white p-8 shadow-lg rounded-2xl">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {formData.name ? formData.name[0].toUpperCase() : "U"}
          </div>
          <h1 className="text-2xl font-bold mt-3">{formData.name || "User"}</h1>
          <p className="text-gray-500 text-sm">{formData.email}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-gray-700 mb-1 text-sm font-medium">
              <User className="w-4 h-4 mr-2" /> Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-1 text-sm font-medium">
              <Mail className="w-4 h-4 mr-2" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-1 text-sm font-medium">
              <University className="w-4 h-4 mr-2" /> University
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) =>
                setFormData({ ...formData, university: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 mb-1 text-sm font-medium">
              <MapPin className="w-4 h-4 mr-2" /> Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
