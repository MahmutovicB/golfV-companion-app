"use client"

import { useState, useRef } from "react"
import { Search, Loader2, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type LookupResult = {
  source: "bkc-db" | "ai"
  code: string
  description: string
  severity?: "low" | "medium" | "high"
  bkcNotes?: string
  commonCauses?: string[]
  suggestedActions?: string[]
  summary?: string
  likelyCauses?: string[]
  suggestedSteps?: string[]
  urgency?: "low" | "medium" | "high"
}

export function CodeLookup() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const code = query.trim()
    if (!code) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch(`/api/fault-codes/lookup?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(`Error ${res.status}: ${JSON.stringify(data)}`)
        return
      }
      setResult(data)
    } catch (err) {
      setError(`Request failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const severity = result?.severity ?? result?.urgency

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Quick lookup</p>

      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="P0401, 18005, MAF…"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-3 font-mono text-sm text-zinc-100 placeholder:font-sans placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {result && (
        <div className="space-y-3 border-t border-zinc-800 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-zinc-100">{result.code}</span>
                {severity && <Badge variant={severity}>{severity}</Badge>}
                {result.source === "bkc-db" && (
                  <span className="rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-400 border border-blue-800">
                    BKC database
                  </span>
                )}
                {result.source === "ai" && (
                  <span className="rounded-full bg-yellow-900/50 px-2 py-0.5 text-xs text-yellow-400 border border-yellow-800">
                    AI result
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-300">
                {result.description ?? result.summary}
              </p>
            </div>
          </div>

          {result.bkcNotes && (
            <div className="flex gap-2 rounded-lg border border-blue-900/50 bg-blue-900/10 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <p className="text-xs text-blue-300">{result.bkcNotes}</p>
            </div>
          )}

          {(result.commonCauses ?? result.likelyCauses) && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">Likely causes</p>
              <ul className="space-y-1">
                {(result.commonCauses ?? result.likelyCauses)!.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(result.suggestedActions ?? result.suggestedSteps) && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">Suggested actions</p>
              <ul className="space-y-1">
                {(result.suggestedActions ?? result.suggestedSteps)!.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="mt-0.5 font-mono text-zinc-600">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
