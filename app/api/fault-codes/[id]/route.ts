import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const updateSchema = z.object({
  resolvedAt: z.string().nullable().optional(),
  aiDiagnosis: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.faultCodeEntry.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.faultCodeEntry.update({
    where: { id },
    data: {
      ...parsed.data,
      resolvedAt: parsed.data.resolvedAt === null
        ? null
        : parsed.data.resolvedAt
          ? new Date(parsed.data.resolvedAt)
          : undefined,
    },
  })

  return NextResponse.json({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    resolvedAt: updated.resolvedAt?.toISOString() ?? null,
  })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.faultCodeEntry.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.faultCodeEntry.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
