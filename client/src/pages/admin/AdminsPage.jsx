import { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, ShieldCheck, Shield } from 'lucide-react';
import { getUsers } from '../../services/adminUserService';
import UserTable from '../../components/admin/UserTable';
import SearchBar from '../../components/admin/SearchBar';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import EditUserModal from '../../components/admin/EditUserModal';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import ErrorState from '../../components/admin/ErrorState';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch users with role_id=1 (ADMIN)
      const data = await getUsers({ role_id: 1 });
      setAdmins(data);
    } catch (err) {
      setError(err.message || 'Failed to load administrators list');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${admin.first_name || ''} ${admin.last_name || ''}`.toLowerCase();
      return (
        !q ||
        fullName.includes(q) ||
        (admin.username && admin.username.toLowerCase().includes(q)) ||
        (admin.email && admin.email.toLowerCase().includes(q))
      );
    });
  }, [admins, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <ShieldCheck size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">System Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage system administrators with full platform control.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdmins}
          disabled={isLoading}
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-xl shadow-2xs transition self-start sm:self-auto disabled:opacity-50"
          title="Refresh list"
          aria-label="Refresh administrator list"
        >
          <RefreshCw size={17} className={isLoading ? 'animate-spin text-indigo-600' : ''} />
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search administrators by name, username, or email..."
        />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState rows={4} />
      ) : error ? (
        <ErrorState
          title="Unable to load administrators"
          message={error}
          onRetry={fetchAdmins}
        />
      ) : filteredAdmins.length === 0 ? (
        <EmptyState
          title="No administrators found"
          description="Try modifying your search query."
          icon={<Shield size={32} />}
        />
      ) : (
        <UserTable
          users={filteredAdmins}
          showRoleColumn={false}
          onViewDetails={(user) => setSelectedUserForDetails(user)}
          onEditUser={(user) => setSelectedUserForEdit(user)}
          onUpdateStatus={() => {
            alert('Admin status updates are restricted to root system processes.');
          }}
        />
      )}

      <UserDetailsModal
        isOpen={Boolean(selectedUserForDetails)}
        user={selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onEdit={(user) => setSelectedUserForEdit(user)}
      />

      <EditUserModal
        isOpen={Boolean(selectedUserForEdit)}
        user={selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        onSuccess={() => {
          fetchAdmins();
        }}
      />
    </div>
  );
}
