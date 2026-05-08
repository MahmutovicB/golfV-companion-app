import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { DocumentsClient } from "@/components/documents/documents-client"
import type { Document } from "@/types"

export default async function DocumentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const documents = await prisma.document
    .findMany({ where: { userId: user!.id }, orderBy: { createdAt: "desc" } })
    .catch(() => [])

  const serialized: Document[] = documents.map((d) => ({
    ...d,
    category: d.category as Document["category"],
    createdAt: d.createdAt.toISOString(),
  }))

  return <DocumentsClient initialDocuments={serialized} userId={user!.id} />
}
