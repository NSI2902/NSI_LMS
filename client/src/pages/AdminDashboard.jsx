import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUsers, updateUserStatus } from '../services/adminUserService';
import StatCard from '../components/admin/StatCard';
import UserTable from '../components/admin/UserTable';
import AddUserModal from '../components/admin/AddUserModal';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import EditUserModal from '../components/admin/EditUserModal';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import LoadingState from '../components/admin/LoadingState';
import EmptyState from '../components/admin/EmptyState';
import ErrorState from '../components/admin/ErrorState';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  UserCheck,
  BookOpen,
  CalendarDays,
  UserPlus,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [addModalConfig, setAddModalConfig] = useState({ isOpen: false, roleType: 'student' });
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [confirmDialogData, setConfirmDialogData] = useState({
    isOpen: false,
    user: null,
    targetStatus: null,
    isLoading: false,
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch all users from the backend
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derive real statistics from MySQL backend users
  const stats = useMemo(() => {
    if (!users || users.length === 0) {
      return {
        totalStudents: 0,
        totalInstructors: 0,
        totalAdmins: 0,
        activeUsers: 0,
      };
    }

    const students = users.filter(
      (u) => u.role_id === 3 || u.role?.toUpperCase() === 'STUDENT'
    );
    const instructors = users.filter(
      (u) => u.role_id === 2 || u.role?.toUpperCase() === 'INSTRUCTOR'
    );
    const admins = users.filter(
      (u) => u.role_id === 1 || u.role?.toUpperCase() === 'ADMIN'
    );
    const active = users.filter((u) => u.status === 'ACTIVE');

    return {
      totalStudents: students.length,
      totalInstructors: instructors.length,
      totalAdmins: admins.length,
      activeUsers: active.length,
    };
  }, [users]);

  // Recent users (most recent 5 users)
  const recentUsers = useMemo(() => {
    return users.slice(0, 5);
  }, [users]);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Administrator';

  const handleStatusChangeRequest = (targetUser, newStatus) => {
    setConfirmDialogData({
      isOpen: true,
      user: targetUser,
      targetStatus: newStatus,
      isLoading: false,
    });
  };

  const handleConfirmStatusChange = async () => {
    const { user: targetUser, targetStatus } = confirmDialogData;
    if (!targetUser || !targetStatus) return;

    setConfirmDialogData((prev) => ({ ...prev, isLoading: true }));
    try {
      await updateUserStatus(targetUser.id, targetStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: targetStatus } : u))
      );
      setConfirmDialogData({
        isOpen: false,
        user: null,
        targetStatus: null,
        isLoading: false,
      });
    } catch (err) {
      alert(err.message || 'Failed to update user status');
      setConfirmDialogData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="admin-page admin-dashboard-page">
      {/* Welcome Banner */}
      <div className="admin-dashboard-hero bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="admin-dashboard-hero-art absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Sparkles size={200} />
        </div>

        <div className="admin-dashboard-hero-content relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="admin-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
              <span>NSI IT LMS Administration Hub</span>
            </div>
            <h1 className="admin-dashboard-title text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="admin-dashboard-subtitle text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor and manage the NSI IT LMS platform. Welcome back,{' '}
              <strong className="text-white">{fullName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition disabled:opacity-50"
              title="Refresh Dashboard"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div>
        <div className="admin-section-heading flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Platform Key Metrics
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-time database records</span>
        </div>

        <div className="admin-stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Students */}
          <StatCard
            title="Total Students"
            value={isLoading ? null : stats.totalStudents}
            icon={<GraduationCap size={22} />}
            subtitle="Registered learner accounts in LMS"
            colorScheme="blue"
            isLoading={isLoading}
          />

          {/* Total Instructors */}
          <StatCard
            title="Total Instructors"
            value={isLoading ? null : stats.totalInstructors}
            icon={<Users size={22} />}
            subtitle="Verified teaching faculty members"
            colorScheme="teal"
            isLoading={isLoading}
          />

          {/* Total Admins */}
          <StatCard
            title="Total Admins"
            value={isLoading ? null : stats.totalAdmins}
            icon={<ShieldCheck size={22} />}
            subtitle="System & platform administrators"
            colorScheme="indigo"
            isLoading={isLoading}
          />

          {/* Active Users */}
          <StatCard
            title="Active Users"
            value={isLoading ? null : stats.activeUsers}
            icon={<UserCheck size={22} />}
            subtitle="Users with ACTIVE status"
            colorScheme="emerald"
            isLoading={isLoading}
          />

          {/* Active Courses (Module Pending API) */}
          <StatCard
            title="Active Courses"
            value={null}
            unavailableMessage="No data available"
            icon={<BookOpen size={22} />}
            subtitle="Course module scheduled in Phase 2B"
            colorScheme="purple"
            isLoading={false}
          />

          {/* Upcoming Lectures (Module Pending API) */}
          <StatCard
            title="Upcoming Lectures"
            value={null}
            unavailableMessage="No data available"
            icon={<CalendarDays size={22} />}
            subtitle="Scheduling module scheduled in Phase 3"
            colorScheme="amber"
            isLoading={false}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-panel admin-quick-actions bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          Quick Actions
        </h2>

        <div className="admin-actions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => setAddModalConfig({ isOpen: true, roleType: 'student' })}
            className="admin-action-card admin-action-card-blue flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 text-left transition group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-950">+ Add Student</p>
                <p className="text-[11px] text-blue-700">Create student account</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition" />
          </button>

          <button
            type="button"
            onClick={() => setAddModalConfig({ isOpen: true, roleType: 'instructor' })}
            className="admin-action-card admin-action-card-teal flex items-center justify-between p-4 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-300 text-left transition group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-950">+ Add Instructor</p>
                <p className="text-[11px] text-teal-700">Create instructor account</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-teal-500 group-hover:translate-x-1 transition" />
          </button>

          <Link
            to="/admin/students"
            className="admin-action-card flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-left transition group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">View Students</p>
                <p className="text-[11px] text-slate-500">Manage all students</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/admin/instructors"
            className="admin-action-card flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-left transition group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">View Instructors</p>
                <p className="text-[11px] text-slate-500">Manage faculty members</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="admin-panel admin-recent-users space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Users
            </h2>
            <p className="text-xs text-slate-500">Recently registered platform accounts</p>
          </div>

          <Link
            to="/admin/students"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState rows={5} />
        ) : error ? (
          <ErrorState
            title="Failed to load recent users"
            message={error}
            onRetry={fetchDashboardData}
          />
        ) : recentUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Create your first student or instructor account."
            actionLabel="+ Add Student"
            onAction={() => setAddModalConfig({ isOpen: true, roleType: 'student' })}
          />
        ) : (
          <UserTable
            users={recentUsers}
            showRoleColumn={true}
            onViewDetails={(u) => setSelectedUserForDetails(u)}
            onEditUser={(u) => setSelectedUserForEdit(u)}
            onUpdateStatus={handleStatusChangeRequest}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      <AddUserModal
        isOpen={addModalConfig.isOpen}
        roleType={addModalConfig.roleType}
        onClose={() => setAddModalConfig({ isOpen: false, roleType: 'student' })}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

      <UserDetailsModal
        isOpen={Boolean(selectedUserForDetails)}
        user={selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onEdit={(u) => setSelectedUserForEdit(u)}
      />

      <EditUserModal
        isOpen={Boolean(selectedUserForEdit)}
        user={selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialogData.isOpen}
        title={
          confirmDialogData.targetStatus === 'ACTIVE'
            ? 'Activate User'
            : confirmDialogData.targetStatus === 'SUSPENDED'
            ? 'Suspend User Account'
            : 'Deactivate User'
        }
        message={`Are you sure you want to change the status of ${
          confirmDialogData.user?.first_name || confirmDialogData.user?.username || 'this user'
        } to ${confirmDialogData.targetStatus}?`}
        confirmLabel={
          confirmDialogData.targetStatus === 'ACTIVE'
            ? 'Activate'
            : confirmDialogData.targetStatus === 'SUSPENDED'
            ? 'Suspend'
            : 'Deactivate'
        }
        variant={confirmDialogData.targetStatus === 'SUSPENDED' ? 'danger' : 'warning'}
        isLoading={confirmDialogData.isLoading}
        onConfirm={handleConfirmStatusChange}
        onCancel={() =>
          setConfirmDialogData({
            isOpen: false,
            user: null,
            targetStatus: null,
            isLoading: false,
          })
        }
      />
    </div>
  );
}
