import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import RoleBadge from './RoleBadge';
import nsiLogo from '../../assets/NSI_LOGO.png';
import { LogOut, LayoutGrid, User, Shield, BookOpen, GraduationCap } from 'lucide-react';

export default function Navbar({ currentPortal }) {
  const { user, allowedPortals, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const portalIcons = {
    student: <GraduationCap size={16} />,
    instructor: <BookOpen size={16} />,
    admin: <Shield size={16} />,
  };

  const portalLabels = {
    student: 'Student Portal',
    instructor: 'Instructor Portal',
    admin: 'Admin Portal',
  };

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'User';

  const showPortalLinks = allowedPortals.length > 1;
  const brandHomeLink = user?.role?.toUpperCase() === 'STUDENT' ? '/student' : '/portal-selection';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to={brandHomeLink} className="navbar-brand">
          <img src={nsiLogo} alt="NSI IT LMS" className="navbar-logo" />
          <div className="navbar-brand-text">
            <span className="navbar-title">NSI IT LMS</span>
            <span className="navbar-subtitle">Nityashree Infosystems</span>
          </div>
        </Link>

        {/* Portal navigation links if multiple available */}
        {showPortalLinks && (
          <nav className="navbar-portals">
            <Link
              to="/portal-selection"
              className={`portal-nav-link ${location.pathname === '/portal-selection' ? 'active' : ''}`}
            >
              <LayoutGrid size={16} />
              <span>All Portals</span>
            </Link>
            {allowedPortals.map((portal) => (
              <Link
                key={portal}
                to={`/${portal}`}
                className={`portal-nav-link ${currentPortal === portal ? 'active' : ''}`}
              >
                {portalIcons[portal]}
                <span>{portalLabels[portal]}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* User Info & Logout */}
        <div className="navbar-user-section">
          <div className="user-profile-summary">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-details">
              <span className="user-name">{fullName}</span>
              <div className="user-meta">
                <span className="user-username">@{user?.username}</span>
                <RoleBadge role={user?.role} size="sm" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-logout"
            title="Log out of NSI IT LMS"
          >
            <LogOut size={16} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
