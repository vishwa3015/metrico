import { useMemo, useState } from "react"
import { type LucideProps } from "lucide-react"
import { Calendar, ChevronDown, Search, Filter, Inbox, Eye } from "lucide-react"
import { RangeStatus, results, TestResult } from "../components/common/data"
import { Card, EmptyState, ExportButton } from "../components/common/primitives"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui"
import { ColorSwatch, HoclPads, StatusBadge } from "../components/common/badges"
import { ResultDetailPanel } from "../components/common/ResultDetailPanel"


type IconComponent = React.ComponentType<LucideProps>

type AnalyteRow = {
  key: string
  parent: TestResult
  type: "HOCl" | "pH"
  value: number | null
  unit: string
  status: RangeStatus
  color: string
  range: string
}

const HOCL_RANGE = { min: 50, max: 100, label: "50 – 100 ppm" }
const PH_RANGE   = { min: 6.0, max: 8.0, label: "6.0 – 8.0" }

function deriveHoclPpm(v: number | null): number | null {
  if (v === null) return null
  return Math.round(v * 40)
}

function recomputeHocl(ppm: number | null): RangeStatus {
  if (ppm === null) return "invalid"
  if (ppm < HOCL_RANGE.min || ppm > HOCL_RANGE.max) return "out_of_range"
  if (ppm < HOCL_RANGE.min + 10 || ppm > HOCL_RANGE.max - 10) return "needs_attention"
  return "in_range"
}

function expandToRows(rs: TestResult[]): AnalyteRow[] {
  const out: AnalyteRow[] = []
  for (const r of rs) {
    const ppm = deriveHoclPpm(r.hocl)
    out.push({
      key: `${r.id}-HOCl`, parent: r, type: "HOCl",
      value: ppm, unit: "ppm", status: recomputeHocl(ppm),
      color: r.hoclColor, range: HOCL_RANGE.label,
    })
    out.push({
      key: `${r.id}-pH`, parent: r, type: "pH",
      value: r.ph, unit: "", status: r.phStatus,
      color: r.phColor, range: PH_RANGE.label,
    })
  }
  return out
}

export function TestResults({ empty = false, openId }: { empty?: boolean; openId?: string | null }) {
  const all = useMemo(() => expandToRows(results), [])
  const [query, setQuery] = useState("")
  const [testType, setTestType] = useState<"all" | "HOCl" | "pH">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | RangeStatus>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(
    openId ? results.find(r => r.id === openId) ?? null : null
  )
  const [selectedAnalyte, setSelectedAnalyte] = useState<"HOCl" | "pH">("HOCl")

  const rows = useMemo(() => {
    if (empty) return []
    return all.filter(r => {
      if (testType !== "all" && r.type !== testType) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          r.parent.id.toLowerCase().includes(q) ||
          r.parent.operator.toLowerCase().includes(q) ||
          r.parent.site.toLowerCase().includes(q) ||
          r.parent.device.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [all, query, testType, statusFilter, empty])

  const allChecked = rows.length > 0 && rows.every(r => selectedIds.has(r.key))
  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set())
    else setSelectedIds(new Set(rows.map(r => r.key)))
  }
  const toggleOne = (key: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="px-8 py-6 space-y-4">
      {/* Filter bar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by record, operator, device…"
              className="h-9 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            />
          </div>
          <FilterChip Icon={Calendar} label="Date range" value="Last 7 days" />
          <FilterChip label="User" value="All users" />
          <FilterChip label="Device" value="All devices" />
          <SegControl
            label="Test type"
            value={testType}
            options={[
              { id: "all", label: "All" },
              { id: "HOCl", label: "HOCl" },
              { id: "pH", label: "pH" },
            ]}
            onChange={(v) => setTestType(v as "all" | "HOCl" | "pH")}
          />
          <FilterChip
            label="Status"
            value={statusFilter === "all" ? "Any" : labelForStatus(statusFilter)}
            onClick={() => setStatusFilter(s => s === "all" ? "out_of_range" : s === "out_of_range" ? "in_range" : "all")}
          />
          <FilterChip Icon={Filter} label="Facility" value="All facilities" />
          <div className="ml-auto flex items-center gap-2">
            {selectedIds.size > 0 && (
              <span className="text-xs text-slate-500">{selectedIds.size} selected</span>
            )}
            <ExportButton label={selectedIds.size > 0 ? `Export selected (${selectedIds.size})` : "Export selected"} />
          </div>
        </div>
      </Card>

      {/* Row count */}
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span><strong className="text-slate-800">{rows.length}</strong> rows</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>Estimated values shown with detected color swatch</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          Icon={Inbox}
          title="No results match your filters"
          description="Try widening the date range or clearing some filters to see synced tests from your devices."
          action={
            <button
              onClick={() => { setQuery(""); setTestType("all"); setStatusFilter("all") }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="w-10 px-4">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                  />
                </TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Estimated Value</TableHead>
                <TableHead>Detected Color</TableHead>
                <TableHead>Accepted Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key} className="hover:bg-slate-50/60">
                  <TableCell className="px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.key)}
                      onChange={() => toggleOne(r.key)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                    />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.parent.timestamp}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${
                      r.type === "HOCl"
                        ? "bg-teal-50 text-teal-700 ring-teal-200"
                        : "bg-sky-50 text-sky-700 ring-sky-200"
                    }`}>
                      {r.type}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-900">
                    {r.value === null ? "—" : <>Approx. {r.value}{r.unit ? ` ${r.unit}` : ""}</>}
                  </TableCell>
                  <TableCell>
                    {r.type === "HOCl"
                      ? <HoclPads yellow={r.parent.hoclYellow} blue={r.parent.hoclBlue} />
                      : <ColorSwatch color={r.color} />}
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-600">{r.range}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>{r.parent.operator}</TableCell>
                  <TableCell>{r.parent.device}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => { setSelectedResult(r.parent); setSelectedAnalyte(r.type) }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ResultDetailPanel
        result={selectedResult}
        analyte={selectedAnalyte}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  )
}

function FilterChip({ Icon, label, value, onClick }: {
  Icon?: IconComponent
  label: string
  value: string
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      <span className="text-xs text-slate-500">{label}:</span>
      <span className="text-slate-800">{value}</span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  )
}

function SegControl({ label, value, options, onChange }: {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white pl-3 pr-1 py-1">
      <span className="text-xs text-slate-500">{label}:</span>
      <div className="flex rounded-md bg-slate-50 p-0.5">
        {options.map(o => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-2.5 py-1 text-xs rounded transition ${
              value === o.id
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function labelForStatus(s: RangeStatus) {
  return s === "in_range" ? "Within range"
    : s === "out_of_range" ? "Out of range"
    : s === "needs_attention" ? "Needs attention"
    : "Invalid"
}