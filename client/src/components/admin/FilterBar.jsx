import { Filter } from 'lucide-react';

/**
 * FilterBar component for user management views
 * @param {object} props
 * @param {string} props.statusFilter - Selected status ('ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')
 * @param {Function} props.onStatusChange - Handler for status change
 * @param {string} [props.roleFilter] - Selected role ('ALL' | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN')
 * @param {Function} [props.onRoleChange] - Handler for role change
 * @param {boolean} [props.showRoleFilter] - Whether to show the role filter selector
 */
export default function FilterBar({
  statusFilter = 'ALL',
  onStatusChange,
  roleFilter = 'ALL',
  onRoleChange,
  showRoleFilter = false,
}) {
  const statuses = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SUSPENDED', label: 'Suspended' },
  ];

  const roles = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'STUDENT', label: 'Students' },
    { value: 'INSTRUCTOR', label: 'Instructors' },
    { value: 'ADMIN', label: 'Admins' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Status Filter */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1">
          <Filter size={13} />
          Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Role Filter (if requested) */}
      {showRoleFilter && onRoleChange && (
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-slate-500 hidden sm:inline">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
