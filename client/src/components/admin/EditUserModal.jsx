import { useState, useEffect } from 'react';
import { X, User, Mail, UserCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { updateUser } from '../../services/adminUserService';

/**
 * EditUserModal component for updating user profiles
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {object|null} props.user
 * @param {Function} props.onClose
 * @param {Function} props.onSuccess
 */
export default function EditUserModal({ isOpen, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    status: 'ACTIVE',
    profile_photo: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        status: user.status || 'ACTIVE',
        profile_photo: user.profile_photo || '',
      });
      setValidationErrors({});
      setServerError('');
      setSuccessMessage('');
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !user) return null;

  const validate = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.username.trim()) errors.username = 'Username is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateUser(user.id, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        status: formData.status,
        profile_photo: formData.profile_photo.trim() || null,
      });

      setSuccessMessage('User profile updated successfully!');

      setTimeout(() => {
        if (onSuccess) onSuccess(updated);
        onClose();
      }, 500);
    } catch (err) {
      setServerError(err.message || 'Failed to update user profile');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity animate-fade-in sm:p-6">
    <div
      className="relative my-6 flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)] transition-all animate-modal-in sm:max-h-[calc(100vh-48px)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <UserCheck size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Edit User Profile
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Update account information for{" "}
              <span className="font-medium text-indigo-600">
                @{user.username}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 animate-fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={17} className="text-emerald-600" />
            </div>

            <span className="font-medium">
              {successMessage}
            </span>
          </div>
        )}

        {/* Server Error */}
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-800 animate-fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100">
              <AlertCircle size={17} className="text-rose-600" />
            </div>

            <div>
              <span className="block font-semibold">
                Update Error
              </span>

              <span className="mt-0.5 block text-xs text-rose-700">
                {serverError}
              </span>
            </div>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              First Name <span className="ml-1 text-rose-500">*</span>
            </label>

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                validationErrors.first_name
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />

            {validationErrors.first_name && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {validationErrors.first_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Last Name <span className="ml-1 text-rose-500">*</span>
            </label>

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                validationErrors.last_name
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />

            {validationErrors.last_name && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {validationErrors.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="ml-1 text-rose-500">*</span>
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail size={16} />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                validationErrors.email
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {validationErrors.email && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Username <span className="ml-1 text-rose-500">*</span>
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User size={16} />
            </div>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                validationErrors.username
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {validationErrors.username && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Account Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Account Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
            className="min-h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);}
