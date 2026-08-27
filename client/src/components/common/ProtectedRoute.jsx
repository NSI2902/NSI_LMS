import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/**
 * Route protection wrapper that enforces login status and role permissions.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.requiredPortal] - Portal identifier ('student', 'instructor', 'admin')
 */
export default function ProtectedRoute({ children, requiredPortal }) {
  const { isAuthenticated, hasPortalAccess } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPortal && !hasPortalAccess(requiredPortal)) {
    return <Navigate to="/unauthorized" state={{ attemptedPortal: requiredPortal }} replace />;
  }

  return children;
}
