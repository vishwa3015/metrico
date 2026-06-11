import { Search, Bell, HelpCircle, ChevronRight } from "lucide-react";

export function TopBar({ title, crumbs, actions }: { title: string; crumbs?: string[]; actions?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur px-8 py-4">
      <div className="min-w-0">
        {crumbs && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span>{c}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-slate-900 tracking-tight truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search records, devices, users…"
            className="h-9 w-80 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
          />
        </div>
        <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="relative h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        {actions}
      </div>
    </header>
  );
}
