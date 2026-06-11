import type { RangeStatus, ReviewStatus, DeviceStatus } from "./data";
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Clock, Flag, Wrench, Wifi, WifiOff } from "lucide-react";

const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset";

export function StatusBadge({ status, value, unit }: { status: RangeStatus; value?: number | string | null; unit?: string }) {
  const map = {
    in_range:        { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",  label: "In range",        Icon: CheckCircle2 },
    needs_attention: { cls: "bg-amber-50 text-amber-700 ring-amber-200",        label: "Needs attention", Icon: AlertTriangle },
    out_of_range:    { cls: "bg-rose-50 text-rose-700 ring-rose-200",           label: "Out of range",    Icon: XCircle },
    invalid:         { cls: "bg-slate-100 text-slate-600 ring-slate-200",       label: "Invalid",         Icon: MinusCircle },
  }[status];
  const { Icon } = map;
  return (
    <span className={`${base} ${map.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {value !== undefined ? (
        <span>{value === null ? "—" : value}{unit ? ` ${unit}` : ""}</span>
      ) : (
        <span>{map.label}</span>
      )}
    </span>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const map = {
    approved: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Approved",  Icon: CheckCircle2 },
    pending:  { cls: "bg-amber-50 text-amber-700 ring-amber-200",       label: "Pending",   Icon: Clock },
    flagged:  { cls: "bg-rose-50 text-rose-700 ring-rose-200",          label: "Flagged",   Icon: Flag },
    rejected: { cls: "bg-slate-100 text-slate-600 ring-slate-200",      label: "Rejected",  Icon: XCircle },
  }[status];
  const { Icon } = map;
  return <span className={`${base} ${map.cls}`}><Icon className="h-3.5 w-3.5" />{map.label}</span>;
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  const map = {
    online:      { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Online",      Icon: Wifi },
    offline:     { cls: "bg-rose-50 text-rose-700 ring-rose-200",          label: "Offline",     Icon: WifiOff },
    maintenance: { cls: "bg-amber-50 text-amber-700 ring-amber-200",       label: "Maintenance", Icon: Wrench },
  }[status];
  const { Icon } = map;
  return <span className={`${base} ${map.cls}`}><Icon className="h-3.5 w-3.5" />{map.label}</span>;
}

export function ColorSwatch({ color, label }: { color: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-5 w-5 rounded-md ring-1 ring-inset ring-slate-300 shadow-inner"
        style={{ backgroundColor: color }}
        aria-label="Detected color"
      />
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </span>
  );
}

export function HoclPads({ yellow, blue, size = "sm" }: { yellow: string; blue: string; size?: "sm" | "lg" }) {
  const dims = size === "lg" ? "h-9 w-9" : "h-5 w-5";
  return (
    <span className="inline-flex items-center gap-1" aria-label="HOCl detected pad colors">
      <span
        className={`${dims} rounded-md ring-1 ring-inset ring-slate-300 shadow-inner`}
        style={{ backgroundColor: yellow }}
        title="Yellow pad"
      />
      <span
        className={`${dims} rounded-md ring-1 ring-inset ring-slate-300 shadow-inner`}
        style={{ backgroundColor: blue }}
        title="Blue pad"
      />
    </span>
  );
}
