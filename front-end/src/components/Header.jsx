import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Header({ onLoginClick }) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <header>
      <div className="container">
        <nav>
          <a href="/" className="logo">Tech Recruiter<span>;</span></a>

          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="user-menu">
                <span className="welcome-text">
                  Olá, {user?.name || 'Usuário'}!
                </span>
                <button className="dashboard-btn" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={onLoginClick}>
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;