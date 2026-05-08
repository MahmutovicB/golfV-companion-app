import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const createSchema = z.object({
  date: z.string(),
  mileageKm: z.number().int().positive(),
  type: z.string().min(1),
  description: z.string().optional(),
  costEur: z.number().optional(),
  workshop: z.string().optional(),
  nextDueKm: z.number().int().optional(),
  nextDueDate: z.string().optional(),
})

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const logs = await prisma.maintenanceLog.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const log = await prisma.maintenanceLog.create({
    data: {
      ...parsed.data,
      userId: user.id,
      date: new Date(parsed.data.date),
      nextDueDate: parsed.data.nextDueDate ? new Date(parsed.data.nextDueDate) : undefined,
    },
  })

  return NextResponse.json(log, { status: 201 })
}
