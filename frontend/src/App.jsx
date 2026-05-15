import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import AboutPage from './pages/home/AboutPage.jsx';
import NotificationPage from './pages/notification/NotificationPage.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import SuggestedUsers from './components/common/SuggestedUsers.jsx';

function App() {
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      {!isAuthPage && (
        <div className="flex-[1_1_0] max-w-[300px]">
          <Sidebar />
        </div>
      )}
      
      <div className="flex-[4_4_0] border-r border-gray-700">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      {!isAuthPage && (
        <div className="flex-[2_2_0] hidden lg:block max-w-[400px]">
          <SuggestedUsers />
        </div>
      )}
    </div>
  );
}

export default App;
