import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import AboutPage from './pages/home/AboutPage.jsx';
import NotificationPage from './pages/notification/NotificationPage.jsx';
import Header from './components/common/Header.jsx';

function App() {
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const location = useLocation();
  const hideHeader =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col max-w-6xl mx-auto min-h-screen">
      {!hideHeader && <Header />}
      <div className="flex-1">
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
    </div>
  );
}

export default App;
