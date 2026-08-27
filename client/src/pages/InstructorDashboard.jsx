import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/common/Navbar';
import RoleBadge from '../components/common/RoleBadge';
import { BookOpen, ArrowLeft, Users, FileText, Video } from 'lucide-react';

export default function InstructorDashboard() {
  const { user, allowedPortals } = useAuth();

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Instructor';

  return (
    <div className="portal-page-layout">
      <Navbar currentPortal="instructor" />

      <main className="dashboard-main-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-banner instructor-banner">
            <div className="dashboard-banner-header">
              <div className="dashboard-icon-title">
                <div className="dashboard-portal-icon instructor-icon-bg">
                  <BookOpen size={32} />
                </div>
                <div>
                  <div className="dashboard-portal-tag">NSI IT LMS &bull; Faculty Space</div>
                  <h1 className="dashboard-portal-name">Instructor Portal</h1>
                </div>
              </div>
              <RoleBadge role={user?.role} size="md" />
            </div>

            <div className="dashboard-welcome-box">
              <p className="welcome-text">
                Welcome back, <strong>{fullName}</strong> (@{user?.username})
              </p>
              <p className="dashboard-subtext">
                Email: {user?.email} | Status: <span className="status-active">{user?.status || 'ACTIVE'}</span>
              </p>
            </div>
          </div>

          {/* Placeholder Content Area */}
          <div className="placeholder-card-grid">
            <div className="placeholder-info-card">
              <div className="placeholder-card-icon instructor-text">
                <Video size={24} />
              </div>
              <h3>Lectures & Course Content</h3>
              <p>Manage curriculum, upload video lectures, and lecture notes in Phase 2.</p>
              <span className="placeholder-status-pill">Phase 2 Module</span>
            </div>

            <div className="placeholder-info-card">
              <div className="placeholder-card-icon instructor-text">
                <Users size={24} />
              </div>
              <h3>Enrolled Students</h3>
              <p>Review student cohorts, attendance records, and engagement analytics.</p>
              <span className="placeholder-status-pill">Phase 2 Module</span>
            </div>

            <div className="placeholder-info-card">
              <div className="placeholder-card-icon instructor-text">
                <FileText size={24} />
              </div>
              <h3>Assignments & Grading</h3>
              <p>Create assignments, grade student submissions, and issue feedback.</p>
              <span className="placeholder-status-pill">Phase 2 Module</span>
            </div>
          </div>

          {/* Navigation Action */}
          <div className="dashboard-actions-footer">
            {allowedPortals.length > 1 && (
              <Link to="/portal-selection" className="btn-secondary-link">
                <ArrowLeft size={16} />
                <span>Switch Portal</span>
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Nityashree Infosystems. All rights reserved. | NSI IT LMS</p>
      </footer>
    </div>
  );
}
