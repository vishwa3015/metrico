import { Download, Inbox, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function KpiCard({
  label, value, unit, delta, intent = "neutral", Icon, subtle,
}: {
  label: string; value: string | number; unit?: string;
  delta?: { value: string; direction: "up" | "down" };
  intent?: "good" | "warn" | "bad" | "neutral";
  Icon?: any;
  subtle?: string;
}) {
  const intentRing = {
    good: "ring-emerald-100 bg-emerald-50 text-emerald-600",
    warn: "ring-amber-100 bg-amber-50 text-amber-600",
    bad:  "ring-rose-100 bg-rose-50 text-rose-600",
    neutral: "ring-teal-100 bg-teal-50 text-teal-600",
  }[intent];
  const Arrow = delta?.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const deltaColor = delta
    ? (delta.direction === "up" ? "text-emerald-600" : "text-rose-600")
    : "";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        {Icon && (
          <div className={`h-8 w-8 rounded-lg ring-1 ring-inset flex items-center justify-center ${intentRing}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="text-slate-900 text-2xl tracking-tight">{value}</div>
        {unit && <div className="text-sm text-slate-500">{unit}</div>}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 ${deltaColor}`}>
            <Arrow className="h-3.5 w-3.5" /> {delta.value}
          </span>
        )}
        {subtle && <span className="text-slate-500">{subtle}</span>}
      </div>
    </div>
  );
}

export function ExportButton({ onClick, label = "Export" }: { onClick?: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-teal-700/20 hover:from-teal-500 hover:to-teal-700"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}

export function EmptyState({ title, description, action, Icon = Inbox }: { title: string; description: string; action?: React.ReactNode; Icon?: any }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/60">
      <div className="h-12 w-12 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-slate-800">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-slate-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}
