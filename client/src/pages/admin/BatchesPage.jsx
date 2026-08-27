import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Plus, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import ErrorState from '../../components/admin/ErrorState';
import {
  createCourseBatch,
  getCourseBatches,
  getCourses,
  updateCourseBatch,
  updateCourseBatchStatus,
} from '../../services/courseAdminService';

const emptyBatch = { batch_code: '', name: '', description: '', start_date: '', end_date: '' };
const batchStatuses = ['DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED'];

export default function BatchesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyBatch);
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = useCallback(async () => {
    setError('');
    try {
      const courseRows = await getCourses();
      setCourses(courseRows);
      setSelectedCourseId((current) => current || courseRows[0]?.id || '');
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setIsLoading(false);
    }
  }, []);

  const loadBatches = useCallback(async () => {
    if (!selectedCourseId) {
      setBatches([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setBatches(await getCourseBatches(selectedCourseId));
    } catch (err) {
      setError(err.message || 'Failed to load batches');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyBatch);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCourseId) return;
    setIsSaving(true);
    try {
      const payload = {
        batch_code: form.batch_code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      if (editing) {
        await updateCourseBatch(editing.id, payload);
      } else {
        await createCourseBatch(selectedCourseId, payload);
      }
      resetForm();
      await loadBatches();
    } catch (err) {
      alert(err.message || 'Failed to save batch');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (batch) => {
    setEditing(batch);
    setForm({
      batch_code: batch.batch_code || '',
      name: batch.name || '',
      description: batch.description || '',
      start_date: batch.start_date || '',
      end_date: batch.end_date || '',
    });
  };

  const setStatus = async (batch, status) => {
    try {
      await updateCourseBatchStatus(batch.id, status);
      setBatches((current) => current.map((item) => (item.id === batch.id ? { ...item, status } : item)));
    } catch (err) {
      alert(err.message || 'Failed to update batch status');
    }
  };

  return (
    <div className="course-admin-page">
      <div className="course-admin-header">
        <div>
          <div className="course-admin-kicker">
            <CalendarDays size={20} />
            <span>Courses</span>
          </div>
          <h1 className="course-admin-title">Batches</h1>
          <p className="course-admin-subtitle">Create course batches and move them through draft, upcoming, active, and completion states.</p>
        </div>
        <button onClick={loadBatches} disabled={isLoading || !selectedCourseId} className="course-admin-icon-btn">
          <RefreshCw size={17} className={isLoading ? 'animate-spin text-indigo-600' : ''} />
          Refresh
        </button>
      </div>

      <div className="course-admin-toolbar">
        <label className="course-admin-label">Course
          <select value={selectedCourseId} onChange={(e) => { setSelectedCourseId(e.target.value); resetForm(); }} className="course-admin-select">
            <option value="">Select a course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.course_code} - {course.name}</option>)}
          </select>
        </label>
      </div>

      <div className="course-admin-grid">
        <form onSubmit={handleSubmit} className="course-admin-panel">
          <h2 className="course-admin-panel-title">{editing ? 'Edit Batch' : 'Add Batch'}</h2>
          <div className="course-admin-form">
            <label className="course-admin-label">Batch Code
              <input value={form.batch_code} onChange={(e) => setForm((p) => ({ ...p, batch_code: e.target.value }))} required maxLength={50} className="course-admin-input" />
            </label>
            <label className="course-admin-label">Name
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required maxLength={150} className="course-admin-input" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="course-admin-label">Start
                <input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} className="course-admin-input" />
              </label>
              <label className="course-admin-label">End
                <input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} className="course-admin-input" />
              </label>
            </div>
            <label className="course-admin-label">Description
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="course-admin-textarea" />
            </label>
          </div>
          <div className="course-admin-form-actions">
            <button disabled={isSaving || !selectedCourseId} className="course-admin-primary-btn">
              <Plus size={16} />
              {editing ? 'Save' : 'Create'}
            </button>
            {editing && <button type="button" onClick={resetForm} className="course-admin-secondary-btn">Cancel</button>}
          </div>
        </form>

        {isLoading ? <LoadingState rows={6} /> : error ? <ErrorState title="Unable to load batches" message={error} onRetry={loadBatches} /> : batches.length === 0 ? (
          <EmptyState title="No batches found" description="Select a course and create the first batch." icon={<CalendarDays size={32} />} />
        ) : (
          <div className="course-admin-table-wrap">
            <div className="course-admin-table-scroll">
            <table className="course-admin-table">
              <thead>
                <tr><th className="px-5 py-3">Batch</th><th className="px-5 py-3">Dates</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="course-admin-table-row">
                    <td><p className="course-admin-row-title">{batch.name}</p><p className="course-admin-row-meta">{batch.batch_code}</p></td>
                    <td className="course-admin-muted">{batch.start_date || 'No start'} to {batch.end_date || 'No end'}</td>
                    <td><StatusBadge status={batch.status} /></td>
                    <td className="course-admin-actions">
                      <button onClick={() => handleEdit(batch)} className="course-admin-text-btn">Edit</button>
                      <select value={batch.status} onChange={(e) => setStatus(batch, e.target.value)} className="course-admin-inline-select">
                        {batchStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
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
  );
}
