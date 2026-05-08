import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { MaintenanceClient } from "@/components/maintenance/maintenance-client"
import type { MaintenanceLog } from "@/types"

export default async function MaintenancePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const logs = await prisma.maintenanceLog
    .findMany({ where: { userId: user!.id }, orderBy: { date: "desc" } })
    .catch(() => [])

  const serialized: MaintenanceLog[] = logs.map((log) => ({
    ...log,
    date: log.date.toISOString(),
    nextDueDate: log.nextDueDate?.toISOString() ?? null,
    createdAt: log.createdAt.toISOString(),
  }))

  return <MaintenanceClient initialEntries={serialized} />
}
