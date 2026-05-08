"use client"

import { useEffect, useState } from "react"
import { X, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { FaultCodeEntry } from "@/types"

type Props = {
  open: boolean
  onClose: () => void
  onSaved: (entry: FaultCodeEntry) => void
}

export function FaultCodeModal({ open, onClose, onSaved }: Props) {
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")
  const [mileageKm, setMileageKm] = useState("")
  const [loading, setLoading] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCode("")
      setDescription("")
      setSeverity("medium")
      setMileageKm("")
      setError(null)
    }
  }, [open])

  async function lookupCode(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    setLookingUp(true)
    try {
      const res = await fetch(`/api/fault-codes/lookup?code=${encodeURIComponent(trimmed)}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.description) setDescription(data.description)
      if (data.severity) setSeverity(data.severity)
    } catch {
      // silent — user can fill manually
    } finally {
      setLookingUp(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !description.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/fault-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description: description.trim(),
          severity,
          mileageKm: mileageKm ? parseInt(mileageKm) : undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      onSaved(saved)
    } catch {
      setError("Failed to save fault code")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl sm:max-w-md">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">Log fault code</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {/* Code field with auto-lookup */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="fault-code">
              Fault code
            </label>
            <div className="relative">
              <input
                id="fault-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onBlur={(e) => lookupCode(e.target.value)}
                placeholder="P0401 or 18005"
                required
                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 pr-9 font-mono text-sm text-zinc-100 placeholder:font-sans placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {lookingUp && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
              )}
            </div>
            <p className="text-xs text-zinc-500">Description auto-fills from BKC database on blur</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="fault-desc">
              Description
            </label>
            <textarea
              id="fault-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
              placeholder="What does this code indicate?"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Severity */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-300" htmlFor="severity">
                Severity
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "low" | "medium" | "high")}
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Input
              label="Mileage (km)"
              type="number"
              value={mileageKm}
              onChange={(e) => setMileageKm(e.target.value)}
              placeholder="185000"
              min={0}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving…" : "Log code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
