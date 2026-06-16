import { useMemo, useState, useEffect } from "react"
import { type LucideProps } from "lucide-react"
import { Calendar, ChevronDown, Search, Filter, Inbox, Eye, X } from "lucide-react"
import type { RangeStatus } from "../components/common/data"
import { Card, EmptyState, ExportButton } from "../components/common/primitives"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui"
import { ColorSwatch, HoclPads, StatusBadge } from "../components/common/badges"
import { ResultDetailPanel } from "../components/common/ResultDetailPanel"
import { useResults } from "../hooks/useResults"
import { ApiTestResult, DetailPanelResult } from "@/types/results.types"
import { resultsService } from "@/services/results.service"
import { ResultsPagination } from "@/components/common/ResultsPagination"

type IconComponent = React.ComponentType<LucideProps>

type DateRangeOption = "7d" | "30d" | "90d" | "all"

type MetaUser = { user_id: string; first_name: string; last_name: string }
type MetaDevice = { device_id: string; device_name: string }
type MetaFacility = { facility_id: string; facility_name: string }

type AnalyteRow = {
  key: string
  resultId: string
  testedAt: string
  type: "HOCl" | "pH"
  value: number | null
  unit: string
  status: RangeStatus
  colorHex: string
  hoclYellow: string
  hoclBlue: string
  range: string
  userName: string
  deviceName: string
  raw: ApiTestResult
}

function mapStatus(s: ApiTestResult["result_status"]): RangeStatus {
  switch (s) {
    case "Within Range": return "in_range"
    case "Above Range":
    case "Below Range": return "out_of_range"
    case "Needs Attention": return "needs_attention"
    case "Invalid Reading": return "invalid"
    default: return "in_range"
  }
}

function toAnalyteRow(r: ApiTestResult): AnalyteRow {
  const isHocl = r.test_type === "HOCl"
  const userName = r.user ? `${r.user.first_name} ${r.user.last_name}` : (r.user_name_snapshot ?? "—")
  const deviceName = r.device ? r.device.device_name : (r.device_name_snapshot ?? "—")

  return {
    key: r.result_id,
    resultId: r.result_id,
    testedAt: new Date(r.tested_at).toLocaleString("en-GB", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).replace(",", ""),
    type: r.test_type,
    value: r.estimated_value !== null ? parseFloat(r.estimated_value) : null,
    unit: r.unit,
    status: mapStatus(r.result_status),
    colorHex: r.detected_color_hex ?? "#e6e6e6",
    hoclYellow: r.detected_color_hex ?? "#e6e6e6",
    hoclBlue: r.detected_color_hex_2 ?? '#e6e6e6',
    range: isHocl
      ? `${parseFloat(r.accepted_min_value ?? "50")} – ${parseFloat(r.accepted_max_value ?? "100")} ppm`
      : `${parseFloat(r.accepted_min_value ?? "6.0")} – ${parseFloat(r.accepted_max_value ?? "8.0")}`,
    userName,
    deviceName,
    raw: r,
  }
}

function uiStatusToApi(s: RangeStatus): string {
  switch (s) {
    case "in_range": return "Within Range"
    case "out_of_range": return "Above Range"
    case "needs_attention": return "Needs Attention"
    case "invalid": return "Invalid Reading"
  }
}

function labelForStatus(s: RangeStatus) {
  return s === "in_range" ? "Within range"
    : s === "out_of_range" ? "Out of range"
      : s === "needs_attention" ? "Needs attention"
        : "Invalid"
}

function dateRangeToIso(range: DateRangeOption): string | undefined {
  if (range === "all") return undefined
  const d = new Date()
  d.setDate(d.getDate() - (range === "7d" ? 7 : range === "30d" ? 30 : 90))
  return d.toISOString()
}

const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "all": "All",
}

function useFilterMeta() {
  const [users, setUsers] = useState<MetaUser[]>([])
  const [devices, setDevices] = useState<MetaDevice[]>([])
  const [facilities, setFacilities] = useState<MetaFacility[]>([])

  useEffect(() => {
    resultsService.getResults({ limit: 200 })
      .then(res => {
        const uMap = new Map<string, MetaUser>()
        const dMap = new Map<string, MetaDevice>()
        const fMap = new Map<string, MetaFacility>()

        for (const r of res.results) {
          if (r.user) {
            uMap.set(r.user.user_id, {
              user_id: r.user.user_id,
              first_name: r.user.first_name,
              last_name: r.user.last_name,
            })
          }
          if (r.device) {
            dMap.set(r.device.device_id, {
              device_id: r.device.device_id,
              device_name: r.device.device_name,
            })
          }
          if (r.facility) {
            fMap.set(r.facility.facility_id, {
              facility_id: r.facility.facility_id,
              facility_name: r.facility.facility_name ?? r.facility.facility_id,
            })
          }
        }

        setUsers([...uMap.values()])
        setDevices([...dMap.values()])
        setFacilities([...fMap.values()])
      })
      .catch(err => console.error("[useFilterMeta]", err))
  }, [])

  return { users, devices, facilities }
}
export function TestResults({ empty = false }: { empty?: boolean }) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [testType, setTestType] = useState<"all" | "HOCl" | "pH">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | RangeStatus>("all")
  const [dateRange, setDateRange] = useState<DateRangeOption>("7d")
  const [userId, setUserId] = useState("all")
  const [deviceId, setDeviceId] = useState("all")
  const [facilityId, setFacilityId] = useState("all")

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedRow, setSelectedRow] = useState<AnalyteRow | null>(null)
  const { users, devices, facilities } = useFilterMeta()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => clearTimeout(t)
  }, [query])

  const [pageSize, setPageSize] = useState<25 | 50 | 100>(50)

  const apiParams = useMemo(() => ({
    limit: pageSize,
    ...(testType !== "all" && { test_type: testType }),
    ...(statusFilter !== "all" && { result_status: uiStatusToApi(statusFilter) }),
    ...(debouncedQuery && { search: debouncedQuery }),
    ...(dateRange !== "all" && { date_from: dateRangeToIso(dateRange) }),
    ...(userId !== "all" && { user_id: userId }),
    ...(deviceId !== "all" && { device_id: deviceId }),
    ...(facilityId !== "all" && { facility_id: facilityId }),
  }), [testType, statusFilter, debouncedQuery, dateRange, userId, deviceId, facilityId, pageSize])

  const { data, loading, error, pagination, goToPage, changePageSize } = useResults(empty ? {} : apiParams)

  const rows = useMemo<AnalyteRow[]>(() => {
    if (empty || !data) return []
    return data.results.map(toAnalyteRow)
  }, [data, empty])

  const activeFilterCount = [
    testType !== "all",
    statusFilter !== "all",
    dateRange !== "7d",
    userId !== "all",
    deviceId !== "all",
    facilityId !== "all",
    debouncedQuery !== "",
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setQuery("")
    setTestType("all")
    setStatusFilter("all")
    setDateRange("7d")
    setUserId("all")
    setDeviceId("all")
    setFacilityId("all")
  }

  const allChecked = rows.length > 0 && rows.every(r => selectedIds.has(r.key))
  const toggleAll = () => allChecked
    ? setSelectedIds(new Set())
    : setSelectedIds(new Set(rows.map(r => r.key)))
  const toggleOne = (key: string) => setSelectedIds(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  return (
    <div className="px-8 py-6 space-y-4">

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by record, operator, device…"
              className="h-9 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <SelectChip
            Icon={Calendar}
            label="Date range"
            value={dateRange}
            displayValue={DATE_RANGE_LABELS[dateRange]}
            onChange={v => setDateRange(v as DateRangeOption)}
            options={[
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
              { value: "90d", label: "Last 90 days" },
              { value: "all", label: "All" },
            ]}
          />

          <SelectChip
            label="User"
            value={userId}
            displayValue={
              userId === "all"
                ? "All users"
                : users.find(u => u.user_id === userId)
                  ? `${users.find(u => u.user_id === userId)!.first_name} ${users.find(u => u.user_id === userId)!.last_name}`
                  : "All users"
            }
            onChange={setUserId}
            options={[
              { value: "all", label: "All users" },
              ...users.map(u => ({ value: u.user_id, label: `${u.first_name} ${u.last_name}` })),
            ]}
          />

          <SelectChip
            label="Device"
            value={deviceId}
            displayValue={
              deviceId === "all"
                ? "All devices"
                : devices.find(d => d.device_id === deviceId)?.device_name ?? "All devices"
            }
            onChange={setDeviceId}
            options={[
              { value: "all", label: "All devices" },
              ...devices.map(d => ({ value: d.device_id, label: d.device_name })),
            ]}
          />
          <SegControl
            label="Test type"
            value={testType}
            options={[
              { id: "all", label: "All" },
              { id: "HOCl", label: "HOCl" },
              { id: "pH", label: "pH" },
            ]}
            onChange={v => setTestType(v as "all" | "HOCl" | "pH")}
          />

          <SelectChip
            label="Status"
            value={statusFilter}
            displayValue={statusFilter === "all" ? "Any" : labelForStatus(statusFilter)}
            onChange={v => setStatusFilter(v as "all" | RangeStatus)}
            options={[
              { value: "all", label: "Any" },
              { value: "in_range", label: "Within range" },
              { value: "out_of_range", label: "Out of range" },
              { value: "needs_attention", label: "Needs attention" },
              { value: "invalid", label: "Invalid" },
            ]}
          />

          <SelectChip
            Icon={Filter}
            label="Facility"
            value={facilityId}
            displayValue={
              facilityId === "all"
                ? "All facilities"
                : facilities.find(f => f.facility_id === facilityId)?.facility_name ?? "All facilities"
            }
            onChange={setFacilityId}
            options={[
              { value: "all", label: "All facilities" },
              ...facilities.map(f => ({ value: f.facility_id, label: f.facility_name })),
            ]}
          />

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-3 w-3" />
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {selectedIds.size > 0 && (
              <span className="text-xs text-slate-500">{selectedIds.size} selected</span>
            )}
            <ExportButton
              label={selectedIds.size > 0 ? `Export selected (${selectedIds.size})` : "Export selected"}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>
          <strong className="text-slate-800">{loading ? "…" : rows.length}</strong> rows
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>Estimated values shown with detected color swatch</span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
              <div className="h-4 w-4 rounded bg-slate-200" />
              <div className="h-3 w-32 rounded bg-slate-200" />
              <div className="h-5 w-12 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-200 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {!loading && rows.length === 0 && (
        <EmptyState
          Icon={Inbox}
          title="No results match your filters"
          description="Try widening the date range or clearing some filters to see synced tests from your devices."
          action={
            <button
              onClick={clearAllFilters}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Clear filters
            </button>
          }
        />
      )}

      {!loading && rows.length > 0 && (
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
              {rows.map(r => (
                <TableRow key={r.key} className="hover:bg-slate-50/60">
                  <TableCell className="px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.key)}
                      onChange={() => toggleOne(r.key)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                    />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.testedAt}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${r.type === "HOCl"
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
                      ? <HoclPads yellow={r.hoclYellow} blue={r.hoclBlue} />
                      : <ColorSwatch color={r.colorHex} />}
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-600">{r.range}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>{r.userName}</TableCell>
                  <TableCell>{r.deviceName}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setSelectedRow(r)}
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

      {!loading && pagination.total > 0 && (
        <ResultsPagination
          pagination={pagination}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPageSizeChange={(size) => { setPageSize(size); changePageSize(size) }}
          loading={loading}
        />
      )}
      <ResultDetailPanel
        result={selectedRow ? toDetailPanelProps(selectedRow) : null}
        analyte={selectedRow?.type ?? "HOCl"}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  )
}

function toDetailPanelProps(r: AnalyteRow): DetailPanelResult {
  const raw = r.raw
  const facilityName = raw.facility?.facility_name ?? raw.facility?.facility_id ?? "—"
  return {
    id: raw.result_id,
    timestamp: r.testedAt,
    operator: r.userName,
    operatorRole: raw.user?.role ?? raw.user_role_snapshot ?? "—",
    site: facilityName,
    organization: "Metrico Diagnostics",
    device: r.deviceName,
    cartridgeType: r.type === "HOCl"
      ? "Metrico HOCl Cartridge (C-HOCl-22)"
      : "Metrico pH Cartridge (C-pH-22)",
    hocl: raw.test_type === "HOCl" && raw.estimated_value
      ? parseFloat(raw.estimated_value) / 40
      : null,
    hoclYellow: raw.detected_color_hex ?? "#e6e6e6",
    hoclBlue: raw.detected_color_hex_2 ?? "#e6e6e6",
    ph: raw.test_type === "pH" && raw.estimated_value
      ? parseFloat(raw.estimated_value)
      : null,
    phColor: raw.detected_color_hex ?? "#e6e6e6",
    phStatus: r.status,
    notes: raw.notes_from_mobile ?? null,
  }
}

function SelectChip({
  Icon, label, value, displayValue, onChange, options,
}: {
  Icon?: IconComponent
  label: string
  value: string
  displayValue: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const active = options.length > 0 && value !== options[0].value
  return (
    <div className={`relative inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50 ${active ? "border-teal-300 ring-1 ring-teal-200" : "border-slate-200"
      }`}>
      {Icon && <Icon className="h-4 w-4 text-slate-400 pointer-events-none" />}
      <span className="text-xs text-slate-500 pointer-events-none">{label}:</span>
      <span className={`pointer-events-none ${active ? "text-teal-700 font-medium" : "text-slate-800"}`}>
        {displayValue}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        aria-label={label}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
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
            className={`px-2.5 py-1 text-xs rounded transition ${value === o.id
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