import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/common/Navbar';
import PortalCard from '../components/portal/PortalCard';
import nsiLogo from '../assets/NSI_LOGO.png';
import RoleBadge from '../components/common/RoleBadge';
import { User } from 'lucide-react';

export default function PortalSelectionPage() {
  const { user, allowedPortals } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (allowedPortals.length === 1) {
      navigate(`/${allowedPortals[0]}`, { replace: true });
    }
  }, [allowedPortals, navigate]);

  if (allowedPortals.length === 1) {
    return null;
  }

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'User';

  return (
    <div className="portal-page-layout">
      <Navbar currentPortal="selection" />

      <main className="portal-selection-main">
        <div className="portal-selection-container">
          {/* Header Banner */}
          <div className="portal-header-section">
            <div className="portal-header-brand">
              <img src={nsiLogo} alt="NSI IT LMS" className="portal-brand-logo" />
              <div className="portal-brand-titles">
                <h1 className="portal-brand-name">NSI IT LMS</h1>
                <p className="portal-company-tagline">A Division Of Nityashree Infosystem Private Limited</p>
              </div>
            </div>

            <div className="portal-user-welcome-card">
              <div className="welcome-avatar-wrapper">
                <User size={24} />
              </div>
              <div className="welcome-info">
                <div className="welcome-name-row">
                  <span className="welcome-greeting">Welcome,</span>
                  <span className="welcome-fullname">{fullName}</span>
                  <RoleBadge role={user?.role} size="md" />
                </div>
                <p className="welcome-subtext">
                  You are authenticated with backend role <strong>{user?.role}</strong>. Please select your desired portal below.
                </p>
              </div>
            </div>

            <div className="portal-action-heading">
              <h2 className="section-title">Choose Your Portal</h2>
              <p className="section-subtitle">
                {allowedPortals.length === 1
                  ? 'Your account has access to the following portal:'
                  : `Your role grants access to ${allowedPortals.length} portals:`}
              </p>
            </div>
          </div>

          {/* Dynamic Role-Based Portal Grid */}
          <div
            className={`portal-cards-grid grid-count-${allowedPortals.length}`}
          >
            {allowedPortals.map((portal) => (
              <PortalCard key={portal} portalType={portal} />
            ))}
          </div>

          {allowedPortals.length === 0 && (
            <div className="portal-no-access-alert">
              <p>No portals are assigned to your role ({user?.role}). Please contact your system administrator.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Nityashree Infosystems. All rights reserved. | NSI IT LMS</p>
      </footer>
    </div>
  );
}
