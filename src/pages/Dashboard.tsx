import React from 'react'
import { type LucideProps } from 'lucide-react'

import {
  CheckCircle2, AlertTriangle, FlaskConical, ArrowRight,
  Calendar, Building2, ChevronDown
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ReferenceArea } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart'
import { activityFeed, hoclTrend, phTrend, results } from '../components/common/data'
import { Card, KpiCard, SectionHeader } from '../components/common/primitives'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui'
import { ColorSwatch, HoclPads, StatusBadge } from '../components/common/badges'

type IconComponent = React.ComponentType<LucideProps>

const hoclChartConfig = {
  v: { label: "HOCl", color: "#0d9488" },
} satisfies ChartConfig

const phChartConfig = {
  v: { label: "pH", color: "#0284c7" },
} satisfies ChartConfig

export function Dashboard({ onOpenResults }: { onOpenResults: () => void }) {
  const outOfRange = results.filter(
    r => r.hoclStatus === "out_of_range" || r.phStatus === "out_of_range"
  )

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Selector Icon={Calendar} label="Today" sub="Jun 09, 2026" />
        <Selector Icon={Building2} label="All facilities" sub="3 sites · 6 devices" />
        <div className="ml-auto text-xs text-slate-500">Updated 2 min ago</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Tests today" value="42" subtle="vs. 38 yesterday" delta={{ value: "+10.5%", direction: "up" }} intent="neutral" Icon={FlaskConical} />
        <KpiCard label="Within range" value="36" subtle="85.7% of today's tests" delta={{ value: "+2", direction: "up" }} intent="good" Icon={CheckCircle2} />
        <KpiCard label="Out of range" value="4" subtle="needs review" delta={{ value: "+1", direction: "up" }} intent="bad" Icon={AlertTriangle} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionHeader
            title="HOCl readings"
            description="Free chlorine over time (ppm)"
            action={<LegendDot color="#0d9488" label="HOCl" />}
          />
          <TrendChart data={hoclTrend} config={hoclChartConfig} min={1.0} max={3.0} unit="ppm" />
        </Card>
        <Card className="p-5">
          <SectionHeader
            title="pH readings"
            description="pH level over time"
            action={<LegendDot color="#0284c7" label="pH" />}
          />
          <TrendChart data={phTrend} config={phChartConfig} min={6.5} max={7.8} unit="" />
        </Card>
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <SectionHeader
            title="Recent out-of-range results"
            description="Tests outside compliance thresholds today"
            action={
              <button onClick={onOpenResults} className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5">
                View all results <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Site / Device</TableHead>
                <TableHead>HOCl</TableHead>
                <TableHead>pH</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outOfRange.map(r => (
                <TableRow
                  key={r.id}
                  onClick={onOpenResults}
                  className="cursor-pointer"
                >
                  <TableCell className="text-slate-800">{r.id}</TableCell>
                  <TableCell className="text-slate-600">{r.timestamp.split(" ")[1]}</TableCell>
                  <TableCell>
                    <div className="text-slate-800">{r.site}</div>
                    <div className="text-xs text-slate-500">{r.device}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HoclPads yellow={r.hoclYellow} blue={r.hoclBlue} />
                      <StatusBadge status={r.hoclStatus} value={r.hocl ?? "—"} unit="ppm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ColorSwatch color={r.phColor} />
                      <StatusBadge status={r.phStatus} value={r.ph ?? "—"} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Recent activity" description="Across this workspace" />
          <ol className="relative border-l border-slate-200 ml-2 space-y-4">
            {activityFeed.map((e, i) => (
              <li key={i} className="ml-4">
                <span className="absolute -left-1.5 mt-1.5 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-teal-50" />
                <div className="text-sm text-slate-800">
                  <span className="text-slate-900">{e.actor}</span> {e.action}{" "}
                  <span className="text-teal-700">{e.target}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {e.ts}{e.note ? ` · ${e.note}` : ""}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}

function Selector({ Icon, label, sub }: { Icon: IconComponent; label: string; sub?: string }) {
  return (
    <button className="inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
      <Icon className="h-4 w-4 text-slate-400" />
      <span className="text-slate-800">{label}</span>
      {sub && <span className="text-xs text-slate-500">· {sub}</span>}
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}

type TrendChartProps = {
  data: { t: string; v: number }[]
  config: ChartConfig
  min: number
  max: number
  unit: string
}

function TrendChart({ data, config, min, max, unit }: TrendChartProps) {
  const color = (Object.values(config)[0] as { color: string }).color

  return (
    <ChartContainer config={config} className="h-56 w-full">
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="t" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} domain={["auto", "auto"]} width={36} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v) => [`${v}${unit ? ` ${unit}` : ""}`, "Reading"]}
            />
          }
        />
        <ReferenceArea y1={min} y2={max} fill="#10b981" fillOpacity={0.06} />
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2.25} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
      </LineChart>
    </ChartContainer>
  )
}