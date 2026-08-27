/**
 * Loading state skeleton for user tables and cards
 * @param {object} props
 * @param {number} [props.rows] - Number of skeleton rows to render
 */
export default function LoadingState({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between animate-pulse bg-slate-50/50">
        <div className="h-4 w-32 bg-slate-200 rounded-md" />
        <div className="h-4 w-20 bg-slate-200 rounded-md" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <div className="h-4 w-36 bg-slate-200 rounded-md" />
                <div className="h-3 w-48 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="hidden sm:block h-5 w-20 bg-slate-100 rounded-full" />
            <div className="hidden md:block h-4 w-24 bg-slate-100 rounded-md" />
            <div className="h-8 w-16 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
