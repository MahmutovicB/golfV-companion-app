import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const createSchema = z.object({
  date: z.string(),
  mileageKm: z.number().int().positive(),
  liters: z.number().positive(),
  pricePerLiter: z.number().positive(),
  totalEur: z.number().positive(),
  fullTank: z.boolean().default(true),
  station: z.string().optional(),
})

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const entries = await prisma.fuelEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(entries)
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

  const entry = await prisma.fuelEntry.create({
    data: { ...parsed.data, userId: user.id, date: new Date(parsed.data.date) },
  })

  return NextResponse.json(entry, { status: 201 })
}
