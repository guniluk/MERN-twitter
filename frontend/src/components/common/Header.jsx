import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authUser'));
    setAuthUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      localStorage.removeItem('authUser');
      setAuthUser(null);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => {
    if (path === '/profile') return location.pathname.startsWith('/profile');
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClass = "text-sm sm:text-lg md:text-xl font-bold transition-colors uppercase tracking-tight";
    const activeClass = "text-red-600"; // 활성 상태 색상
    const inactiveClass = "text-blue-700 hover:text-blue-900";
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <div className="w-full border-b border-gray-700">
      <div className="relative h-24 w-full overflow-hidden">
        <img src="/cover.jpg" className="h-full w-full object-cover" alt="cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-3 left-6 text-white font-black text-2xl drop-shadow-2xl italic">
          MERN TWITTER
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center p-4 bg-pink-100 gap-2">
        <div className="flex flex-wrap gap-2 sm:gap-8 items-center">
          <Link to="/" className={getLinkClass('/')}>
            Home
          </Link>
          {authUser && (
            <>
              <Link to={`/profile/${authUser.username}`} className={getLinkClass('/profile')}>
                Profile
              </Link>
              <Link to="/notifications" className={getLinkClass('/notifications') + " flex items-center gap-1"}>
                <IoNotificationsOutline className="hidden sm:block" /> Noti
              </Link>
            </>
          )}
          <Link to="/about" className={getLinkClass('/about')}>
            About
          </Link>
        </div>

        <div>
          {authUser ? (
            <button
              onClick={handleLogout}
              className="btn bg-green-800 hover:bg-green-900 border-none rounded-full text-white btn-xs sm:btn-sm px-4 sm:px-8 font-bold"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="btn bg-green-800 hover:bg-green-900 border-none rounded-full text-white btn-xs sm:btn-sm px-4 sm:px-8 font-bold">
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
