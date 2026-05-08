import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { RepairsClient } from "@/components/repairs/repairs-client"
import { BKC_REPAIR_GUIDES } from "@/lib/bkc/repair-guides"

export default async function RepairsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [lastFuel, lastMaintenance] = await Promise.all([
    prisma.fuelEntry
      .findFirst({ where: { userId: user!.id }, orderBy: { date: "desc" } })
      .catch(() => null),
    prisma.maintenanceLog
      .findFirst({ where: { userId: user!.id }, orderBy: { date: "desc" } })
      .catch(() => null),
  ])

  const lastMileage = lastFuel?.mileageKm ?? lastMaintenance?.mileageKm ?? null

  return <RepairsClient guides={BKC_REPAIR_GUIDES} lastMileage={lastMileage} />
}
