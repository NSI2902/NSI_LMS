import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Construction } from 'lucide-react';

/**
 * Placeholder page for modules scheduled in subsequent development phases
 * @param {object} props
 * @param {string} props.title - Feature/Module name
 * @param {string} props.phase - Phase identifier (e.g. 'Phase 2B', 'Phase 3')
 * @param {string} [props.description] - Description of planned features
 */
export default function AdminPlaceholderPage({
  title = 'Module In Development',
  phase = 'Phase 2B / Phase 3',
  description = 'This feature is scheduled in the upcoming development phase of NSI IT LMS.',
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
          <Construction size={32} />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-3">
          <Clock size={13} />
          <span>Scheduled for {phase}</span>
        </span>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{title} Module</h3>
        <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
          The backend data models, business logic controllers, and interactive management views for{' '}
          <strong>{title}</strong> will be implemented in subsequent phases as outlined in the
          roadmap.
        </p>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
