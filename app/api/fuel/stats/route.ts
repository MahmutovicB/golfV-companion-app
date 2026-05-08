import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { FuelStats } from "@/types"

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const entries = await prisma.fuelEntry.findMany({
    where: { userId: user.id },
    orderBy: { mileageKm: "asc" },
  })

  const totalCostAllTime = entries.reduce((sum, e) => sum + e.totalEur, 0)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const totalCostLast30Days = entries
    .filter((e) => new Date(e.date) >= thirtyDaysAgo)
    .reduce((sum, e) => sum + e.totalEur, 0)

  // Consumption is only meaningful between consecutive full-tank fill-ups
  const fullTankEntries = entries.filter((e) => e.fullTank)
  const consumptions: number[] = []

  for (let i = 1; i < fullTankEntries.length; i++) {
    const distanceKm = fullTankEntries[i].mileageKm - fullTankEntries[i - 1].mileageKm
    if (distanceKm > 0) {
      // L/100km
      consumptions.push((fullTankEntries[i].liters / distanceKm) * 100)
    }
  }

  const avgConsumption =
    consumptions.length > 0
      ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length
      : null

  const bestConsumption = consumptions.length > 0 ? Math.min(...consumptions) : null
  const worstConsumption = consumptions.length > 0 ? Math.max(...consumptions) : null

  const lastEntry = entries[entries.length - 1]
  const firstEntry = entries[0]
  const totalKm =
    lastEntry && firstEntry ? lastEntry.mileageKm - firstEntry.mileageKm : 0
  const costPerKm = totalKm > 0 ? totalCostAllTime / totalKm : null

  const stats: FuelStats = {
    avgConsumption,
    totalCostAllTime,
    totalCostLast30Days,
    costPerKm,
    bestConsumption,
    worstConsumption,
  }

  return NextResponse.json(stats)
}
