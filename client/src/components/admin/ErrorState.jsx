import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Reusable ErrorState component
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {Function} [props.onRetry]
 */
export default function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching data from the server.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-rose-50/50 rounded-xl border border-rose-200 shadow-2xs">
      <div className="h-12 w-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle size={26} />
      </div>
      <h3 className="text-base font-bold text-rose-900">{title}</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-rose-700 border border-rose-300 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
