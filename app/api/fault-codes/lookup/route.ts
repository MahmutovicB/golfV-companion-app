import { NextResponse } from "next/server"
import { lookupDtcCode } from "@/lib/bkc/dtc-codes"
import { diagnoseFaultCode } from "@/lib/ai/gemini"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  if (!code) return NextResponse.json({ error: "code parameter required" }, { status: 400 })

  // Check BKC-specific DB first
  const local = lookupDtcCode(code)
  if (local) {
    return NextResponse.json({ source: "bkc-db", ...local })
  }

  // Fall back to Gemini AI
  try {
    const diagnosis = await diagnoseFaultCode(code)
    return NextResponse.json({ source: "ai", code, ...diagnosis })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[Gemini lookup error]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
