import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/common/Navbar';
import RoleBadge from '../components/common/RoleBadge';
import { GraduationCap, ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user, allowedPortals } = useAuth();

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Student';

  return (
    <div className="portal-page-layout">
      <Navbar currentPortal="student" />

      <main className="dashboard-main-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-banner student-banner">
            <div className="dashboard-banner-header">
              <div className="dashboard-icon-title">
                <div className="dashboard-portal-icon student-icon-bg">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <div className="dashboard-portal-tag">NSI IT LMS &bull; Learner Space</div>
                  <h1 className="dashboard-portal-name">Student Portal</h1>
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
              <div className="placeholder-card-icon student-text">
                <BookOpen size={24} />
              </div>
              <h3>Enrolled Courses</h3>
              <p>Course materials, lectures, and syllabus will be available in Phase 2.</p>
              <span className="placeholder-status-pill">Phase 2 Module</span>
            </div>

            <div className="placeholder-info-card">
              <div className="placeholder-card-icon student-text">
                <Clock size={24} />
              </div>
              <h3>Live Schedules</h3>
              <p>Class schedules and interactive live doubt sessions will sync here.</p>
              <span className="placeholder-status-pill">Phase 2 Module</span>
            </div>

            <div className="placeholder-info-card">
              <div className="placeholder-card-icon student-text">
                <CheckCircle size={24} />
              </div>
              <h3>Assignments & Progress</h3>
              <p>Submission portals and automated evaluation metrics will be active soon.</p>
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
