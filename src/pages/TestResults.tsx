import { useMemo, useState, useEffect, useRef } from "react"
import { type LucideProps } from "lucide-react"
import { Calendar, ChevronDown, Search, Filter, Inbox, Eye, RefreshCw } from "lucide-react"
import { type RangeStatus } from "../components/common/data"
import type { TestResult, TestType, ResultStatus } from "../types/result.types"
import { Card, EmptyState, ExportButton } from "../components/common/primitives"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui"
import { ColorSwatch, HoclPads, StatusBadge } from "../components/common/badges"
import { ResultDetailPanel } from "../components/common/ResultDetailPanel"
import { useResults } from "../hooks/useResults"

type IconComponent = React.ComponentType<LucideProps>

type AnalyteRow = {
  key: string
  parent: TestResult
  type: "HOCl" | "pH"
  displayValue: string
  unit: string
  rangeStatus: RangeStatus
  colorHex: string
  range: string
}

function toRangeStatus(s: ResultStatus | string): RangeStatus {
  switch (s) {
    case "Within Range":      return "in_range"
    case "Below Range":
    case "Above Range":       return "out_of_range"
    case "Invalid Reading":   return "invalid"
    default:                  return "invalid"
  }
}

function expandToRows(rs: TestResult[]): AnalyteRow[] {
  return rs.map(r => {
    const min = parseFloat(r.accepted_min_value)
    const max = parseFloat(r.accepted_max_value)
    return {
      key: r.result_id,
      parent: r,
      type: r.test_type,
      displayValue: r.estimated_value !== null
        ? `Approx. ${r.estimated_value}${r.unit ? ` ${r.unit}` : ""}` : "—",
      unit: r.unit,
      rangeStatus: toRangeStatus(r.result_status),
      colorHex: r.detected_color_hex,
      range: `${min} – ${max}${r.unit ? ` ${r.unit}` : ""}`,
    }
  })
}

function formatTimestamp(iso: string) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

function labelForStatus(s: RangeStatus) {
  return s === "in_range"         ? "Within range"
    : s === "out_of_range"        ? "Out of range"
    : s === "needs_attention"     ? "Needs attention"
    : "Invalid"
}

function todayStr(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const DATE_PRESETS = [
  { label: "Today",        from: todayStr(0),   to: todayStr(0) },
  { label: "Last 7 days",  from: todayStr(-7),  to: todayStr(0) },
  { label: "Last 30 days", from: todayStr(-30), to: todayStr(0) },
  { label: "Last 90 days", from: todayStr(-90), to: todayStr(0) },
  { label: "All dates",    from: "",            to: "" },
]

function DropdownChip({
  Icon, label, value, options, onChange,
}: {
  Icon?: IconComponent
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (id: string, label: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <span className="text-xs text-slate-500">{label}:</span>
        <span className="text-slate-800">{value}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] rounded-lg border border-slate-200 bg-white shadow-lg py-1">
          {options.map(o => (
            <button
              key={o.id}
              onClick={() => { onChange(o.id, o.label); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 ${
                value === o.label ? "text-teal-700 font-medium bg-teal-50/50" : "text-slate-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TestResults({ empty = false, openId }: { empty?: boolean; openId?: string | null }) {
  const {
    results,
    pagination,
    filters,
    isLoading,
    error,
    setTestType,
    setResultStatus,
    setDateRange,
    setUserId,
    setDeviceId,
    setPage,
    clearFilters,
    refresh,
  } = useResults()

  const [searchInput,    setSearchInput]    = useState("")
  const [selectedIds,    setSelectedIds]    = useState<Set<string>>(new Set())
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(
    openId ? results.find(r => r.result_id === openId) ?? null : null
  )
  const [selectedAnalyte, setSelectedAnalyte] = useState<"HOCl" | "pH">("HOCl")

  const [dateLabel,     setDateLabel]     = useState("Last 7 days")
  const [userLabel,     setUserLabel]     = useState("All users")
  const [deviceLabel,   setDeviceLabel]   = useState("All devices")
  const [facilityLabel, setFacilityLabel] = useState("All facilities")
  const [statusFilter,  setStatusFilter]  = useState<"all" | RangeStatus>("all")

  useEffect(() => {
    setDateRange(todayStr(-7), todayStr(0))
  }, [])

  const rows = useMemo(() => {
    if (empty) return []
    const base = expandToRows(results)
    if (!searchInput) return base
    const q = searchInput.toLowerCase()
    return base.filter(r =>
      r.parent.result_id.toLowerCase().includes(q) ||
      r.parent.user_name_snapshot.toLowerCase().includes(q) ||
      r.parent.device_name_snapshot.toLowerCase().includes(q) ||
      r.parent.device_id.toLowerCase().includes(q)
    )
  }, [results, searchInput, empty])

  const allChecked = rows.length > 0 && rows.every(r => selectedIds.has(r.key))
  const toggleAll  = () => setSelectedIds(allChecked ? new Set() : new Set(rows.map(r => r.key)))
  const toggleOne  = (key: string) => setSelectedIds(prev => {
    const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next
  })

  const cycleStatus = () => {
    if (statusFilter === "all") {
      setStatusFilter("out_of_range"); setResultStatus("Above Range" as ResultStatus)
    } else if (statusFilter === "out_of_range") {
      setStatusFilter("in_range"); setResultStatus("Within Range" as ResultStatus)
    } else {
      setStatusFilter("all"); setResultStatus("")
    }
  }

  const userOptions = useMemo(() => {
    const seen = new Map<string, string>()
    seen.set("", "All users")
    for (const r of results) {
      if (r.user_id && !seen.has(r.user_id)) seen.set(r.user_id, r.user_name_snapshot)
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }))
  }, [results])

  const deviceOptions = useMemo(() => {
    const seen = new Map<string, string>()
    seen.set("", "All devices")
    for (const r of results) {
      if (r.device_id && !seen.has(r.device_id))
        seen.set(r.device_id, r.device_name_snapshot || r.device_id)
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }))
  }, [results])

  const facilityOptions = [
    { id: "",   label: "All facilities" },
    { id: "c1000000-0000-0000-0000-000000000001", label: "Main Facility" },
  ]

  const testTypeValue = (filters.test_type ?? "all") as "all" | "HOCl" | "pH"

  const handleClearFilters = () => {
    setSearchInput("")
    setStatusFilter("all")
    setDateLabel("Last 7 days")
    setUserLabel("All users")
    setDeviceLabel("All devices")
    setFacilityLabel("All facilities")
    clearFilters()
    setDateRange(todayStr(-7), todayStr(0))
  }

  return (
    <div className="px-8 py-6 space-y-4">
      {/* Filter bar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by record, operator, device…"
              className="h-9 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            />
          </div>

          <DropdownChip
            Icon={Calendar}
            label="Date range"
            value={dateLabel}
            options={DATE_PRESETS.map(p => ({ id: `${p.from}|${p.to}`, label: p.label }))}
            onChange={(id, label) => {
              const [from, to] = id.split("|")
              setDateRange(from, to)
              setDateLabel(label)
            }}
          />

          <DropdownChip
            label="User"
            value={userLabel}
            options={userOptions}
            onChange={(id, label) => {
              setUserId(id)
              setUserLabel(label)
            }}
          />

          <DropdownChip
            label="Device"
            value={deviceLabel}
            options={deviceOptions}
            onChange={(id, label) => {
              setDeviceId(id)
              setDeviceLabel(label)
            }}
          />

          <SegControl
            label="Test type"
            value={testTypeValue}
            options={[
              { id: "all",  label: "All" },
              { id: "HOCl", label: "HOCl" },
              { id: "pH",   label: "pH" },
            ]}
            onChange={v => setTestType(v === "all" ? "" : v as TestType)}
          />

          <FilterChip
            label="Status"
            value={statusFilter === "all" ? "Any" : labelForStatus(statusFilter)}
            onClick={cycleStatus}
          />

          <DropdownChip
            Icon={Filter}
            label="Facility"
            value={facilityLabel}
            options={facilityOptions}
            onChange={(_id, label) => {
              setFacilityLabel(label)
            }}
          />

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            {selectedIds.size > 0 && (
              <span className="text-xs text-slate-500">{selectedIds.size} selected</span>
            )}
            <ExportButton label={selectedIds.size > 0 ? `Export selected (${selectedIds.size})` : "Export selected"} />
          </div>
        </div>
      </Card>

      {/* Row count */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-3">
          <span><strong className="text-slate-800">{rows.length}</strong> rows</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Estimated values shown with detected color swatch</span>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => setPage((filters.page ?? 1) - 1)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40 hover:bg-slate-50"
            >←</button>
            <span className="text-xs">Page {filters.page ?? 1} of {pagination.total_pages}</span>
            <button
              disabled={(filters.page ?? 1) >= pagination.total_pages}
              onClick={() => setPage((filters.page ?? 1) + 1)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40 hover:bg-slate-50"
            >→</button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}{" "}
          <button onClick={refresh} className="underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && rows.length === 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-slate-100 p-4 last:border-0">
              {[...Array(8)].map((_, j) => (
                <div key={j} className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && rows.length === 0 && !error && (
        <EmptyState
          Icon={Inbox}
          title="No results match your filters"
          description="Try widening the date range or clearing some filters to see synced tests from your devices."
          action={
            <button
              onClick={handleClearFilters}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Clear filters
            </button>
          }
        />
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="w-10 px-4">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-400" />
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
              {rows.map(r => (
                <TableRow key={r.key} className={`hover:bg-slate-50/60 ${isLoading ? "opacity-50" : ""}`}>
                  <TableCell className="px-4">
                    <input type="checkbox" checked={selectedIds.has(r.key)} onChange={() => toggleOne(r.key)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-400" />
                  </TableCell>
                  <TableCell className="tabular-nums">{formatTimestamp(r.parent.tested_at)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${
                      r.type === "HOCl"
                        ? "bg-teal-50 text-teal-700 ring-teal-200"
                        : "bg-sky-50 text-sky-700 ring-sky-200"
                    }`}>{r.type}</span>
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-900">{r.displayValue}</TableCell>
                  <TableCell>
                    {r.type === "HOCl"
                      ? <HoclPads yellow={r.parent.detected_color_hex_yellow ?? r.colorHex} blue={r.parent.detected_color_hex_blue ?? r.colorHex} />
                      : <ColorSwatch color={r.colorHex} />}
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-600">{r.range}</TableCell>
                  <TableCell><StatusBadge status={r.rangeStatus} /></TableCell>
                  <TableCell>{r.parent.user_name_snapshot}</TableCell>
                  <TableCell>{r.parent.device_name_snapshot || r.parent.device_id}</TableCell>
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
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
    >
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