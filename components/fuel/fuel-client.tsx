"use client"

import { useState } from "react"
import { Plus, Fuel, TrendingDown, TrendingUp, Banknote, Gauge } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { FuelModal } from "./fuel-modal"
import { ConsumptionChart } from "./consumption-chart"
import { formatDate, formatMileage, formatCurrency } from "@/lib/utils"
import type { FuelEntry, FuelStats } from "@/types"

type Props = {
  initialEntries: FuelEntry[]
  initialStats: FuelStats
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "blue",
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  accent?: "blue" | "amber" | "green" | "red"
}) {
  const colors = {
    blue: "text-blue-400 bg-blue-900/20",
    amber: "text-amber-400 bg-amber-900/20",
    green: "text-green-400 bg-green-900/20",
    red: "text-red-400 bg-red-900/20",
  }
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[accent]}`}>
        <Icon className={`h-5 w-5 ${colors[accent].split(" ")[0]}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="font-mono text-lg font-bold text-zinc-100">{value}</p>
        {sub && <p className="text-xs text-zinc-500">{sub}</p>}
      </div>
    </Card>
  )
}

export function FuelClient({ initialEntries, initialStats }: Props) {
  const [entries, setEntries] = useState<FuelEntry[]>(initialEntries)
  const [stats, setStats] = useState<FuelStats>(initialStats)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function refreshStats() {
    try {
      const res = await fetch("/api/fuel/stats")
      if (res.ok) setStats(await res.json())
    } catch {}
  }

  async function handleSaved(entry: FuelEntry) {
    setEntries((prev) => [entry, ...prev].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ))
    await refreshStats()
    setModalOpen(false)
    showToast("Fill-up logged")
  }

  // Build chart data from full-tank entries
  const chartData = entries
    .filter((e) => e.fullTank)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<{ date: string; consumption: number; mileage: number }[]>((acc, entry, i, arr) => {
      if (i === 0) return acc
      const prev = arr[i - 1]
      const dist = entry.mileageKm - prev.mileageKm
      if (dist > 0) {
        acc.push({
          date: formatDate(entry.date),
          consumption: parseFloat(((entry.liters / dist) * 100).toFixed(2)),
          mileage: entry.mileageKm,
        })
      }
      return acc
    }, [])

  // Monthly spend
  const monthlySpend = entries.reduce<Record<string, number>>((acc, e) => {
    const month = new Date(e.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    acc[month] = (acc[month] ?? 0) + e.totalEur
    return acc
  }, {})

  const recentMonths = Object.entries(monthlySpend)
    .slice(-4)
    .reverse()

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 shadow-2xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Fuel Tracker</h1>
          <p className="mt-0.5 text-sm text-zinc-400">{entries.length} fill-ups recorded</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Log fill-up
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Avg consumption"
          value={stats.avgConsumption ? `${stats.avgConsumption.toFixed(2)} L/100` : "—"}
          sub="full tank entries"
          icon={Gauge}
          accent="blue"
        />
        <StatCard
          label="Total spend"
          value={formatCurrency(stats.totalCostAllTime)}
          sub="all time"
          icon={Banknote}
          accent="amber"
        />
        <StatCard
          label="Best consumption"
          value={stats.bestConsumption ? `${stats.bestConsumption.toFixed(2)} L/100` : "—"}
          icon={TrendingDown}
          accent="green"
        />
        <StatCard
          label="Worst consumption"
          value={stats.worstConsumption ? `${stats.worstConsumption.toFixed(2)} L/100` : "—"}
          icon={TrendingUp}
          accent="red"
        />
      </div>

      {/* Chart + monthly */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConsumptionChart data={chartData} />
        </div>

        {/* Monthly summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly spend</CardTitle>
          </CardHeader>
          {recentMonths.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMonths.map(([month, spend]) => {
                const maxSpend = Math.max(...Object.values(monthlySpend))
                const pct = (spend / maxSpend) * 100
                return (
                  <div key={month}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-zinc-400">{month}</span>
                      <span className="font-mono font-semibold text-zinc-100">{formatCurrency(spend)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800">
                      <div
                        className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Fill-up log */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Fill-up log</h2>

        {entries.length === 0 ? (
          <Card className="py-14 text-center">
            <p className="text-zinc-400">No fill-ups logged yet.</p>
            <button onClick={() => setModalOpen(true)} className="mt-2 text-sm text-red-400 hover:text-red-300 cursor-pointer">
              Log your first fill-up →
            </button>
          </Card>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Card key={entry.id} className="flex items-center gap-4 p-4 hover:border-zinc-700 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-900/20">
                  <Fuel className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-zinc-100">{entry.liters.toFixed(2)} L</span>
                    <span className="text-xs text-zinc-500">@ {entry.pricePerLiter.toFixed(3)} KM/L</span>
                    {entry.fullTank && (
                      <span className="rounded-full border border-blue-800 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-400">
                        Full tank
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                    <span>{formatDate(entry.date)}</span>
                    <span className="font-mono">{formatMileage(entry.mileageKm)}</span>
                    {entry.station && <span>{entry.station}</span>}
                  </div>
                </div>
                <span className="shrink-0 font-mono font-bold text-zinc-100">
                  {formatCurrency(entry.totalEur)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FuelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
