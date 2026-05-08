import { NextResponse } from "next/server"
import { z } from "zod"
import { askBkcQuestion } from "@/lib/ai/gemini"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const schema = z.object({
  question: z.string().min(1).max(1000),
  context: z.string().optional(),
})

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  try {
    const fullQuestion = parsed.data.context
      ? `${parsed.data.context}\n\nQuestion: ${parsed.data.question}`
      : parsed.data.question

    const answer = await askBkcQuestion(fullQuestion)
    return NextResponse.json({ answer })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
