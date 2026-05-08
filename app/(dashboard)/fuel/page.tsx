import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { FuelClient } from "@/components/fuel/fuel-client"
import type { FuelEntry, FuelStats } from "@/types"

export default async function FuelPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const entries = await prisma.fuelEntry
    .findMany({ where: { userId: user!.id }, orderBy: { date: "desc" } })
    .catch(() => [])

  const serialized: FuelEntry[] = entries.map((e) => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }))

  // Compute stats server-side
  const fullTankEntries = [...serialized]
    .filter((e) => e.fullTank)
    .sort((a, b) => a.mileageKm - b.mileageKm)

  const consumptions: number[] = []
  for (let i = 1; i < fullTankEntries.length; i++) {
    const dist = fullTankEntries[i].mileageKm - fullTankEntries[i - 1].mileageKm
    if (dist > 0) consumptions.push((fullTankEntries[i].liters / dist) * 100)
  }

  const totalCostAllTime = serialized.reduce((s, e) => s + e.totalEur, 0)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const totalCostLast30Days = serialized
    .filter((e) => new Date(e.date) >= thirtyDaysAgo)
    .reduce((s, e) => s + e.totalEur, 0)

  const last = serialized[0]
  const first = serialized[serialized.length - 1]
  const totalKm = last && first ? last.mileageKm - first.mileageKm : 0

  const stats: FuelStats = {
    avgConsumption: consumptions.length ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length : null,
    totalCostAllTime,
    totalCostLast30Days,
    costPerKm: totalKm > 0 ? totalCostAllTime / totalKm : null,
    bestConsumption: consumptions.length ? Math.min(...consumptions) : null,
    worstConsumption: consumptions.length ? Math.max(...consumptions) : null,
  }

  return <FuelClient initialEntries={serialized} initialStats={stats} />
}
