import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { FaultCodesClient } from "@/components/fault-codes/fault-codes-client"
import type { FaultCodeEntry } from "@/types"

export default async function FaultCodesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const entries = await prisma.faultCodeEntry
    .findMany({ where: { userId: user!.id }, orderBy: { createdAt: "desc" } })
    .catch(() => [])

  const serialized: FaultCodeEntry[] = entries.map((e) => ({
    ...e,
    severity: e.severity as "low" | "medium" | "high",
    createdAt: e.createdAt.toISOString(),
    resolvedAt: e.resolvedAt?.toISOString() ?? null,
  }))

  return <FaultCodesClient initialEntries={serialized} />
}
