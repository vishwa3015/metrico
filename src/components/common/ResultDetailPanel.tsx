import type { TestResult, TestResultDetail } from "../../types/result.types";
import ResultService from "../../services/result.service";
import { useEffect, useState } from "react";
import { StatusBadge } from "./badges";
import { X, Download, Info, RotateCcw, FlaskConical, Loader2 } from "lucide-react";

type Analyte = "HOCl" | "pH";

function toRangeStatusBadge(status: string) {
  switch (status) {
    case "Within Range": return "in_range" as const;
    case "Below Range":
    case "Above Range": return "out_of_range" as const;
    case "Invalid Reading": return "invalid" as const;
    default: return "invalid" as const;
  }
}

function formatTimestamp(iso: string) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

export function ResultDetailPanel({
  result,
  analyte = "HOCl",
  onClose,
}: {
  result: TestResult | null;
  analyte?: Analyte;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<TestResultDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result) { setDetail(null); return; }
    setLoading(true);
    setError(null);
    ResultService.getResultById(result.result_id)
      .then(setDetail)
      .catch(() => setError("Failed to load record details."))
      .finally(() => setLoading(false));
  }, [result?.result_id]);

  if (!result) return null;

  const isHocl = analyte === "HOCl";
  const displayData = detail ?? result;
  const rangeLabel = `${displayData.accepted_min_value} – ${displayData.accepted_max_value}${displayData.unit ? ` ${displayData.unit}` : ""}`;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-slate-900/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="w-[480px] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Record</div>
            <div className="text-slate-900 tracking-tight">
              {displayData.result_id.slice(0, 8)}… · {analyte}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${isHocl
                ? "bg-teal-50 text-teal-700 ring-teal-200"
                : "bg-sky-50 text-sky-700 ring-sky-200"
              }`}>
              <FlaskConical className="h-3.5 w-3.5" /> {analyte}
            </span>
            <StatusBadge status={toRangeStatusBadge(displayData.result_status)} />
            <span className="text-xs text-slate-500 ml-1">
              {formatTimestamp(displayData.tested_at)}
            </span>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 ml-auto" />}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Estimated value</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-slate-900 text-3xl tracking-tight">
                {displayData.estimated_value === null
                  ? "—"
                  : <>Approx. {displayData.estimated_value}</>}
              </div>
              {displayData.unit && (
                <div className="text-sm text-slate-500">{displayData.unit}</div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Detected color</div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-9 w-14 rounded-md ring-1 ring-inset ring-slate-300 shadow-inner"
                    style={{ backgroundColor: displayData.detected_color_hex }}
                    aria-label={displayData.detected_color_label ?? "Detected color"}
                  />
                  {displayData.detected_color_label && (
                    <span className="text-xs text-slate-500">{displayData.detected_color_label}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">Accepted range</div>
                <div className="text-sm text-slate-800 tabular-nums">{rangeLabel}</div>
                <div className="mt-2 relative h-2 rounded-full bg-slate-200/70">
                  <div className="absolute top-0 bottom-0 left-[15%] right-[15%] rounded-full bg-emerald-300/80" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 text-amber-800 text-xs px-3 py-2 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Result is an estimate based on calibrated cartridge color reading.</span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Test context</div>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <Item k="User" v={displayData.user_name_snapshot} />
              <Item k="User role" v={detail?.user_role_snapshot ?? "—"} />
              <Item k="Device" v={displayData.device_name_snapshot} />
              <Item k="Device ID" v={displayData.device_id} />
              <Item k="Device serial" v={detail?.device_serial_snapshot ?? "—"} />
              <Item k="Test type" v={displayData.test_type} />
              <Item k="Cartridge" v={detail?.cartridge_type ?? displayData.test_type} />
              <Item k="Sync status" v={displayData.sync_status} />
              <Item k="Tested at" v={formatTimestamp(displayData.tested_at)} />
              {detail?.synced_at && (
                <Item k="Synced at" v={formatTimestamp(detail.synced_at)} />
              )}
            </dl>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Notes</div>
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[64px]">
              {detail?.notes_from_mobile
                ? detail.notes_from_mobile
                : <span className="text-slate-400">No notes recorded for this test.</span>}
            </div>
          </div>

          {/* Retest link */}
          {displayData.retest_of_result_id && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Retest of record{" "}
              <span className="font-mono text-slate-800">
                {displayData.retest_of_result_id.slice(0, 8)}…
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4 flex items-center gap-2">
          {displayData.retest_of_result_id && (
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" /> View Original Record
            </button>
          )}
          <button className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-teal-700/20 hover:from-teal-500 hover:to-teal-700">
            <Download className="h-4 w-4" /> Export Record
          </button>
        </div>
      </aside>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-800">{v}</dd>
    </>
  );
}
