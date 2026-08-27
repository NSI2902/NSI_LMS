export default function RoleBadge({ role, size = 'md' }) {
  if (!role) return null;
  const normalized = String(role).toUpperCase().trim();

  const config = {
    ADMIN: {
      label: 'Admin',
      className: 'badge-admin',
    },
    INSTRUCTOR: {
      label: 'Instructor',
      className: 'badge-instructor',
    },
    STUDENT: {
      label: 'Student',
      className: 'badge-student',
    },
  }[normalized] || {
    label: role,
    className: 'badge-default',
  };

  return (
    <span className={`role-badge ${config.className} role-badge-${size}`}>
      {config.label}
    </span>
  );
}

