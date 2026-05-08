import { NextResponse } from "next/server"
import { z } from "zod"
import { diagnoseFaultCode } from "@/lib/ai/gemini"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const schema = z.object({
  code: z.string().min(1),
  mileageKm: z.number().int().optional(),
  additionalCodes: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const diagnosis = await diagnoseFaultCode(
      parsed.data.code,
      parsed.data.mileageKm,
      parsed.data.additionalCodes
    )
    return NextResponse.json(diagnosis)
  } catch (err) {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 })
  }
}
