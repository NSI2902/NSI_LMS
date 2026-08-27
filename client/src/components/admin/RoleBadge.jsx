/**
 * Admin RoleBadge component using Tailwind CSS
 * @param {object} props
 * @param {'ADMIN'|'INSTRUCTOR'|STUDENT'|string} props.role
 * @param {'sm'|'md'} [props.size]
 */
export default function RoleBadge({ role, size = 'sm' }) {
  const normalized = (role || 'STUDENT').toUpperCase();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-bold tracking-wider',
    md: 'text-xs px-2.5 py-1 font-bold tracking-wider',
  };

  const roleConfigs = {
    ADMIN: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
      label: 'ADMIN',
    },
    INSTRUCTOR: {
      bg: 'bg-teal-50 text-teal-700 border-teal-200 ring-1 ring-teal-500/20',
      label: 'INSTRUCTOR',
    },
    STUDENT: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
      label: 'STUDENT',
    },
  };

  const config = roleConfigs[normalized] || {
    bg: 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-500/20',
    label: normalized,
  };

  return (
    <span
      className={`inline-flex items-center uppercase rounded-full border shadow-2xs font-semibold ${config.bg} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {config.label}
    </span>
  );
}
