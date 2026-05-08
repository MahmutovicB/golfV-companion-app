import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceAlerts } from "@/components/maintenance/service-alerts"
import { formatDate, formatMileage, formatCurrency } from "@/lib/utils"
import { Wrench, AlertTriangle, Fuel, FileText, Radio, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [recentMaintenance, unresolvedFaults, recentFuel] = await Promise.all([
    prisma.maintenanceLog
      .findMany({ where: { userId: user!.id }, orderBy: { date: "desc" }, take: 3 })
      .catch(() => []),
    prisma.faultCodeEntry
      .findMany({ where: { userId: user!.id, resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 3 })
      .catch(() => []),
    prisma.fuelEntry
      .findMany({ where: { userId: user!.id }, orderBy: { date: "desc" }, take: 1 })
      .catch(() => []),
  ])

  const lastMileage = recentFuel[0]?.mileageKm ?? recentMaintenance[0]?.mileageKm ?? null

  // Build last-service mileage map for service alerts
  const lastServiceMileages: Record<string, number> = {}
  for (const log of recentMaintenance) {
    if (!lastServiceMileages[log.type]) {
      lastServiceMileages[log.type] = log.mileageKm
    }
  }

  const NAV_ITEMS = [
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/fault-codes", label: "Fault Codes", icon: AlertTriangle },
    { href: "/fuel", label: "Fuel", icon: Fuel },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/obd2", label: "OBD2 Live", icon: Radio },
    { href: "/repairs", label: "Repairs", icon: BookOpen },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-0.5 text-sm text-zinc-400">VW Golf 5 · 1.9 TDI BKC</p>
      </div>

      {/* Service alerts */}
      {lastMileage && (
        <ServiceAlerts
          currentMileage={lastMileage}
          lastServiceMileages={lastServiceMileages}
        />
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="text-center">
          <div className="font-mono text-xl font-bold text-red-400">
            {lastMileage ? formatMileage(lastMileage) : "—"}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Last mileage</div>
        </Card>
        <Card className="text-center">
          <div className="text-xl font-bold text-zinc-100">{unresolvedFaults.length}</div>
          <div className="mt-1 text-xs text-zinc-500">Active faults</div>
        </Card>
        <Card className="text-center">
          <div className="text-xl font-bold text-zinc-100">
            {recentMaintenance[0] ? formatDate(recentMaintenance[0].date) : "—"}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Last service</div>
        </Card>
        <Card className="text-center">
          <div className="text-xl font-bold text-zinc-100">
            {recentFuel[0] ? `${recentFuel[0].pricePerLiter.toFixed(3)} KM/L` : "—"}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Last fuel price</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active faults */}
        <Card>
          <CardHeader>
            <CardTitle>Active Fault Codes</CardTitle>
            <Link href="/fault-codes" className="text-xs text-red-400 hover:text-red-300 transition-colors">
              View all
            </Link>
          </CardHeader>
          {unresolvedFaults.length === 0 ? (
            <p className="text-sm text-zinc-500">No active fault codes.</p>
          ) : (
            <div className="space-y-2">
              {unresolvedFaults.map((fault) => (
                <div key={fault.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                  <div>
                    <span className="font-mono text-sm font-semibold text-zinc-100">{fault.code}</span>
                    <p className="text-xs text-zinc-400 truncate max-w-[180px]">{fault.description}</p>
                  </div>
                  <Badge variant={fault.severity as "low" | "medium" | "high"}>{fault.severity}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance</CardTitle>
            <Link href="/maintenance" className="text-xs text-red-400 hover:text-red-300 transition-colors">
              View all
            </Link>
          </CardHeader>
          {recentMaintenance.length === 0 ? (
            <p className="text-sm text-zinc-500">No maintenance logs yet.</p>
          ) : (
            <div className="space-y-2">
              {recentMaintenance.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{log.type}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(log.date)} · <span className="font-mono">{formatMileage(log.mileageKm)}</span>
                    </p>
                  </div>
                  {log.costEur != null && (
                    <span className="font-mono text-sm text-zinc-300">{formatCurrency(log.costEur)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="flex flex-col items-center gap-2.5 py-5 text-center hover:border-zinc-600 hover:bg-zinc-800/80 transition-colors cursor-pointer">
              <Icon className="h-5 w-5 text-red-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-zinc-300">{label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
