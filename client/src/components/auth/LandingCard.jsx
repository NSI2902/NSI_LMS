import nsiLogo from '../../assets/NSI_LOGO.png';
import { ArrowRight, Lock, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

export default function LandingCard({ onStartLogin }) {
  return (
    <div className="auth-card auth-landing-card">
      <div className="brand-header">
        <div className="brand-logo-wrapper">
          <img src={nsiLogo} alt="NSI Logo" className="brand-logo" />
        </div>
        <h1 className="brand-title">NSI IT LMS</h1>
        <p className="brand-company">A Division Of Nityashree Infosystem Private Limited</p>
      </div>

      <div className="landing-content">
        <p className="landing-statement">
          Learn, teach, manage and track your learning journey in one platform.
        </p>

       

        <button
          type="button"
          className="btn-primary btn-login-cta"
          onClick={onStartLogin}
          autoFocus
        >
          <span>Login</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="auth-card-footer">
        <Lock size={13} className="footer-lock-icon" />
        <span>Authorized Personnel & Enrolled Students Only</span>
      </div>
    </div>
  );
}

