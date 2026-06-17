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
    </header>
  );
}
