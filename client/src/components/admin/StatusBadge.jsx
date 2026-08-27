/**
 * StatusBadge component
 * @param {object} props
 * @param {'ACTIVE'|'INACTIVE'|'SUSPENDED'|string} props.status
 * @param {'sm'|'md'|'lg'} [props.size]
 */
export default function StatusBadge({ status, size = 'sm' }) {
  const normalized = (status || 'ACTIVE').toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-semibold',
    md: 'text-xs px-3 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  const statusConfigs = {
    ACTIVE: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
      dot: 'bg-emerald-500',
      label: 'Active',
    },
    INACTIVE: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/20',
      dot: 'bg-slate-400',
      label: 'Inactive',
    },
    SUSPENDED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
      dot: 'bg-rose-500',
      label: 'Suspended',
    },
  };

  const config = statusConfigs[normalized] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200 ring-gray-600/20',
    dot: 'bg-gray-400',
    label: normalized,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${config.bg} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
