import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderTree, Plus, RefreshCw } from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import ErrorState from '../../components/admin/ErrorState';
import {
  createCourseCategory,
  getCourseCategories,
  updateCourseCategory,
  updateCourseCategoryStatus,
} from '../../services/courseAdminService';

export default function CourseCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setCategories(await getCourseCategories());
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter((category) =>
      `${category.name || ''} ${category.description || ''}`.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
      };
      if (editing) {
        await updateCourseCategory(editing.id, payload);
      } else {
        await createCourseCategory(payload);
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || '',
      description: category.description || '',
    });
  };

  const toggleStatus = async (category) => {
    const nextStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateCourseCategoryStatus(category.id, nextStatus);
      setCategories((current) =>
        current.map((item) => (item.id === category.id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update category status');
    }
  };

  return (
    <div className="course-admin-page">
      <div className="course-admin-header">
        <div>
          <div className="course-admin-kicker">
            <FolderTree size={20} />
            <span>Courses</span>
          </div>
          <h1 className="course-admin-title">Categories</h1>
          <p className="course-admin-subtitle">Group courses by department, topic, or training stream.</p>
        </div>
        <button
          type="button"
          onClick={loadCategories}
          disabled={isLoading}
          className="course-admin-icon-btn"
        >
          <RefreshCw size={17} className={isLoading ? 'animate-spin text-indigo-600' : ''} />
          Refresh
        </button>
      </div>

      <div className="course-admin-narrow-grid">
        <form onSubmit={handleSubmit} className="course-admin-panel">
          <h2 className="course-admin-panel-title">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <div className="course-admin-form">
            <label className="course-admin-label">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="course-admin-input"
                required
                maxLength={150}
              />
            </label>
            <label className="course-admin-label">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="course-admin-textarea"
              />
            </label>
          </div>
          <div className="course-admin-form-actions">
            <button disabled={isSaving} className="course-admin-primary-btn">
              <Plus size={16} />
              {editing ? 'Save' : 'Create'}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <div className="course-admin-toolbar">
            <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClear={() => setSearchQuery('')} placeholder="Search categories..." />
          </div>

          {isLoading ? (
            <LoadingState rows={5} />
          ) : error ? (
            <ErrorState title="Unable to load categories" message={error} onRetry={loadCategories} />
          ) : filteredCategories.length === 0 ? (
            <EmptyState title="No categories found" description="Create your first category to organize courses." icon={<FolderTree size={32} />} />
          ) : (
            <div className="course-admin-table-wrap">
              <div className="course-admin-table-scroll">
              <table className="course-admin-table">
                <thead>
                  <tr>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="course-admin-table-row">
                      <td>
                        <p className="course-admin-row-title">{category.name}</p>
                        <p className="course-admin-row-meta">{category.description || 'No description'}</p>
                      </td>
                      <td><StatusBadge status={category.status} /></td>
                      <td className="course-admin-actions">
                        <button onClick={() => handleEdit(category)} className="course-admin-text-btn">Edit</button>
                        <button onClick={() => toggleStatus(category)} className="course-admin-neutral-btn">
                          {category.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
