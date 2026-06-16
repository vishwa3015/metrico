import type { RangeStatus } from "./data"
import { StatusBadge } from "./badges"
import { X, Download, Info, RotateCcw, FlaskConical } from "lucide-react"
import { DetailPanelResult } from "@/types/results.types"

type Analyte = "HOCl" | "pH"

const HOCL_RANGE = { min: 50, max: 100, label: "50 – 100 ppm", unit: "ppm" }
const PH_RANGE = { min: 6.0, max: 8.0, label: "6.0 – 8.0", unit: "" }

function deriveHoclPpm(v: number | null): number | null {
  if (v === null) return null
  return Math.round(v * 40)
}

function recomputeHoclStatus(ppm: number | null): RangeStatus {
  if (ppm === null) return "invalid"
  if (ppm < HOCL_RANGE.min || ppm > HOCL_RANGE.max) return "out_of_range"
  if (ppm < HOCL_RANGE.min + 10 || ppm > HOCL_RANGE.max - 10) return "needs_attention"
  return "in_range"
}

export function ResultDetailPanel({
  result, analyte = "HOCl", onClose,
}: {
  result: DetailPanelResult | null
  analyte?: Analyte
  onClose: () => void
}) {
  if (!result) return null

  const isHocl = analyte === "HOCl"
  const value = isHocl ? deriveHoclPpm(result.hocl) : result.ph
  const status = isHocl ? recomputeHoclStatus(deriveHoclPpm(result.hocl)) : result.phStatus
  const range = isHocl ? HOCL_RANGE : PH_RANGE

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-slate-900/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="w-[480px] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Record</div>
            <div className="text-slate-900 tracking-tight">{result.id} · {analyte}</div>
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
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${isHocl ? "bg-teal-50 text-teal-700 ring-teal-200" : "bg-sky-50 text-sky-700 ring-sky-200"
              }`}>
              <FlaskConical className="h-3.5 w-3.5" /> {analyte}
            </span>
            <StatusBadge status={status} />
            <span className="text-xs text-slate-500 ml-1">{result.timestamp}</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Estimated value</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-slate-900 text-3xl tracking-tight">
                {value === null ? "—" : <>Approx. {value}</>}
              </div>
              {range.unit && <div className="text-sm text-slate-500">{range.unit}</div>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Color swatches */}
              <div>
                <div className="text-xs text-slate-500 mb-1.5">
                  {isHocl ? "Detected cartridge pads" : "Detected color"}
                </div>
                {isHocl ? (
                  <div className="flex items-center gap-2">
                    <PadSwatch color={result.hoclYellow} label="Yellow pad" />
                    <PadSwatch color={result.hoclBlue} label="Blue pad" />
                  </div>
                ) : (
                  <span
                    className="h-9 w-14 rounded-md ring-1 ring-inset ring-slate-300 shadow-inner block"
                    style={{ backgroundColor: result.phColor }}
                    aria-label="Detected color"
                  />
                )}
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">Accepted range</div>
                <div className="text-sm text-slate-800 tabular-nums">{range.label}</div>
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
              <Item k="User name" v={result.operator} />
              <Item k="User role" v={result.operatorRole} />
              <Item k="Facility" v={result.site} />
              <Item k="Organization" v={result.organization} />
              <Item k="Device ID" v={result.device} />
              <Item k="Cartridge type" v={result.cartridgeType} />
              <Item k="Date / time" v={result.timestamp} />
            </dl>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Notes</div>
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[64px]">
              {result.notes ?? (
                <span className="text-slate-400">No notes recorded for this test.</span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> View Retest Record
          </button>
          <button className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-teal-700/20 hover:from-teal-500 hover:to-teal-700">
            <Download className="h-4 w-4" /> Export Record
          </button>
        </div>
      </aside>
    </div>
  )
}

function PadSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="h-9 w-9 rounded-md ring-1 ring-inset ring-slate-300 shadow-inner"
        style={{ backgroundColor: color }}
        aria-label={label}
      />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  )
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-800">{v}</dd>
    </>
  );
}
