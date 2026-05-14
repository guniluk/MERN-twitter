import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authUser'));
    const setAuth = () => {
      setAuthUser(user);
    };
    setAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Logout failed');

      localStorage.removeItem('authUser');
      setAuthUser(null);
      navigate('/login');
      window.location.reload(); // Refresh to update states
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full border-b border-gray-700">
      {/* Cover Image Area - Reduced Height */}
      <div className="relative h-24 w-full overflow-hidden">
        <img
          src="/cover.jpg"
          className="h-full w-full object-cover"
          alt="cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-3 left-6 text-white font-black text-2xl drop-shadow-2xl italic">
          MERN TWITTER
        </div>
      </div>

      {/* Navigation Area - Light Pink Background */}
      <div className="flex justify-between items-center p-4 bg-pink-100">
        <div className="flex gap-8 items-center">
          <Link
            to="/"
            className="text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors uppercase tracking-tight"
          >
            Home
          </Link>
          {authUser && (
            <Link
              to={`/profile/${authUser.username}`}
              className="text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors uppercase tracking-tight"
            >
              Profile
            </Link>
          )}
          <Link
            to="/about"
            className="text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors uppercase tracking-tight"
          >
            About
          </Link>
        </div>

        <div>
          {authUser ? (
            <button
              onClick={handleLogout}
              className="btn bg-green-800 hover:bg-green-900 border-none rounded-full text-white btn-sm px-8 font-bold"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="btn bg-green-800 hover:bg-green-900 border-none rounded-full text-white btn-sm px-8 font-bold">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
