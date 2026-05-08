import { AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import { BKC_SERVICE_SCHEDULE } from "@/lib/bkc/maintenance-schedule"
import { formatMileage } from "@/lib/utils"

type Alert = {
  name: string
  status: "overdue" | "due-soon"
  kmOverdue?: number
  kmRemaining?: number
  critical: boolean
}

type Props = {
  currentMileage: number
  lastServiceMileages: Record<string, number>
}

export function ServiceAlerts({ currentMileage, lastServiceMileages }: Props) {
  const alerts: Alert[] = []

  for (const item of BKC_SERVICE_SCHEDULE) {
    if (item.intervalKm === 0) continue
    const lastDone = lastServiceMileages[item.name] ?? null
    if (lastDone === null) continue

    const nextDue = lastDone + item.intervalKm
    const remaining = nextDue - currentMileage

    if (remaining <= 0) {
      alerts.push({ name: item.name, status: "overdue", kmOverdue: Math.abs(remaining), critical: item.critical })
    } else if (remaining <= 1500) {
      alerts.push({ name: item.name, status: "due-soon", kmRemaining: remaining, critical: item.critical })
    }
  }

  if (alerts.length === 0) return null

  const overdue = alerts.filter((a) => a.status === "overdue")
  const dueSoon = alerts.filter((a) => a.status === "due-soon")

  return (
    <div className="space-y-2">
      {overdue.map((alert) => (
        <Link key={alert.name} href="/maintenance">
          <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors cursor-pointer ${
            alert.critical
              ? "border-red-800 bg-red-900/20 hover:bg-red-900/30"
              : "border-yellow-800 bg-yellow-900/20 hover:bg-yellow-900/30"
          }`}>
            <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${alert.critical ? "text-red-400" : "text-yellow-400"}`} />
            <div className="min-w-0">
              <p className={`text-sm font-medium ${alert.critical ? "text-red-300" : "text-yellow-300"}`}>
                {alert.name} — overdue by {formatMileage(alert.kmOverdue!)}
              </p>
              {alert.critical && (
                <p className="text-xs text-red-400/70 mt-0.5">Critical service — do not delay</p>
              )}
            </div>
          </div>
        </Link>
      ))}
      {dueSoon.map((alert) => (
        <Link key={alert.name} href="/maintenance">
          <div className="flex items-start gap-3 rounded-xl border border-blue-800 bg-blue-900/20 px-4 py-3 hover:bg-blue-900/30 transition-colors cursor-pointer">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-sm text-blue-300">
              <span className="font-medium">{alert.name}</span> — due in {formatMileage(alert.kmRemaining!)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
