import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LandingCard from '../components/auth/LandingCard';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to portal selection or target page
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role?.toUpperCase() === 'STUDENT') {
        navigate('/student', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/portal-selection';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-background-decoration">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>

      <main className="auth-main-container">
        {!showLoginForm ? (
          <LandingCard onStartLogin={() => setShowLoginForm(true)} />
        ) : (
          <LoginForm onBack={() => setShowLoginForm(false)} />
        )}
      </main>

      <footer className="auth-page-footer">
        <p>&copy; {new Date().getFullYear()} Nityashree Infosystems. All rights reserved. | NSI IT LMS Phase 1</p>
      </footer>
    </div>
  );
}
