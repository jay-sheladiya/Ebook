import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition">
        E-Book Reader
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/books"
              className="hover:bg-blue-500 px-3 py-2 rounded transition"
            >
              Books
            </Link>
            <Link
              to="/profile"
              className="hover:bg-blue-500 px-3 py-2 rounded transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:bg-blue-500 px-3 py-2 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
