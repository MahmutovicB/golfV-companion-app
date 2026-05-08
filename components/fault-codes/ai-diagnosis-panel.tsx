"use client"

import { useState } from "react"
import { Loader2, Zap, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FaultCodeEntry, AiDiagnosis } from "@/types"

type Props = {
  entry: FaultCodeEntry
  onDiagnosisSaved: (diagnosis: string) => void
}

export function AiDiagnosisPanel({ entry, onDiagnosisSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState<AiDiagnosis | null>(
    entry.aiDiagnosis ? tryParse(entry.aiDiagnosis) : null
  )

  async function fetchDiagnosis() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: entry.code,
          mileageKm: entry.mileageKm ?? undefined,
        }),
      })
      if (!res.ok) throw new Error("AI request failed")
      const data: AiDiagnosis = await res.json()
      setDiagnosis(data)

      // Persist to DB
      await fetch(`/api/fault-codes/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiDiagnosis: JSON.stringify(data) }),
      })
      onDiagnosisSaved(JSON.stringify(data))
    } catch {
      setError("AI diagnosis failed. Check your Gemini API key.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 space-y-3">
      {!diagnosis && !loading && (
        <button
          onClick={fetchDiagnosis}
          className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
        >
          <Zap className="h-4 w-4" />
          Get AI diagnosis for {entry.code}
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Asking Gemini about {entry.code}…
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {diagnosis && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-yellow-500/70">AI Diagnosis</p>
            <div className="flex items-center gap-2">
              <Badge variant={diagnosis.urgency}>{diagnosis.urgency} urgency</Badge>
              <button
                onClick={fetchDiagnosis}
                disabled={loading}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh diagnosis"
              >
                Refresh
              </button>
            </div>
          </div>

          <p className="text-sm text-zinc-300">{diagnosis.summary}</p>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Likely causes (BKC-specific)</p>
            <ul className="space-y-1">
              {diagnosis.likelyCauses.map((cause, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-yellow-500" />
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Suggested steps</p>
            <ol className="space-y-1">
              {diagnosis.suggestedSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="mt-0.5 font-mono text-zinc-600">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

function tryParse(raw: string): AiDiagnosis | null {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
