import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Shield, ArrowRight } from 'lucide-react';

const PORTAL_CONFIG = {
  student: {
    title: 'Student Portal',
    description: 'Access courses, lectures, assignments and track your learning progress.',
    route: '/student',
    icon: GraduationCap,
    accentClass: 'portal-accent-student',
    badgeText: 'Learning Portal',
    buttonText: 'Enter Student Portal',
  },
  instructor: {
    title: 'Instructor Portal',
    description: 'Teach courses, manage lectures, assignments and students.',
    route: '/instructor',
    icon: BookOpen,
    accentClass: 'portal-accent-instructor',
    badgeText: 'Teaching Portal',
    buttonText: 'Enter Instructor Portal',
  },
  admin: {
    title: 'Admin Portal',
    description: 'Manage students, instructors, courses, scheduling and the LMS platform.',
    route: '/admin',
    icon: Shield,
    accentClass: 'portal-accent-admin',
    badgeText: 'Management Portal',
    buttonText: 'Enter Admin Portal',
  },
};

export default function PortalCard({ portalType }) {
  const navigate = useNavigate();
  const config = PORTAL_CONFIG[portalType];

  if (!config) return null;

  const IconComponent = config.icon;

  const handleCardClick = () => {
    navigate(config.route);
  };

  return (
    <div
      className={`portal-card ${config.accentClass}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Access ${config.title}`}
    >
      <div className="portal-card-top">
        <div className="portal-icon-container">
          <IconComponent size={28} className="portal-icon" />
        </div>
        <span className="portal-type-badge">{config.badgeText}</span>
      </div>

      <div className="portal-card-body">
        <h3 className="portal-title">{config.title}</h3>
        <p className="portal-description">{config.description}</p>
      </div>

      <div className="portal-card-footer">
        <span className="portal-action-label">{config.buttonText}</span>
        <div className="portal-action-arrow">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
}

