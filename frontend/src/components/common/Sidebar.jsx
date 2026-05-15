import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoNotificationsOutline, IoHomeOutline, IoPersonOutline, IoInformationCircleOutline, IoLogOutOutline } from 'react-icons/io5';
import XSvg from '../svgs/X';

const Sidebar = () => {
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
    if (path === '/profile' && authUser) return location.pathname === `/profile/${authUser.username}`;
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-5 p-3 rounded-full hover:bg-gray-800 transition-all duration-300 font-bold text-2xl w-fit pr-8";
    const activeClass = "text-white";
    const inactiveClass = "text-slate-300";
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 sticky top-0 h-screen w-full border-r border-gray-700">
      {/* MASSIVE WHITE X LOGO */}
      <div className="mb-6 px-2">
        <Link to="/" className="flex justify-start">
           <XSvg className="w-20 h-20 fill-white hover:bg-gray-800 rounded-full p-3 transition-all duration-300" />
        </Link>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        <Link to="/" className={getLinkClass('/')}>
          <IoHomeOutline size={35} />
          <span>Home</span>
        </Link>

        {authUser && (
          <>
            <Link to={`/profile/${authUser.username}`} className={getLinkClass('/profile')}>
              <IoPersonOutline size={35} />
              <span>Profile</span>
            </Link>
            <Link to="/notifications" className={getLinkClass('/notifications')}>
              <IoNotificationsOutline size={35} />
              <span>Notification</span>
            </Link>
          </>
        )}

        <Link to="/about" className={getLinkClass('/about')}>
          <IoInformationCircleOutline size={35} />
          <span>About</span>
        </Link>
      </nav>

      {/* USER PROFILE CARD / DOOR EXIT LOGO */}
      {authUser && (
        <div 
          onClick={handleLogout}
          className="mt-auto mb-10 flex items-center justify-between gap-3 p-4 rounded-full hover:bg-gray-800 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-600"
        >
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full border-2 border-white">
                <img src={authUser.profileImg || "/avatar-placeholder.png"} alt="profile" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-base truncate max-w-[120px]">{authUser.fullname}</span>
              <span className="text-slate-500 text-sm font-bold">@{authUser.username}</span>
            </div>
          </div>
          <div className="flex items-center text-white">
            <IoLogOutOutline size={32} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
