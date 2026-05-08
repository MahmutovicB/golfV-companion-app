"use client"

import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { FuelEntry } from "@/types"

type Props = {
  open: boolean
  onClose: () => void
  onSaved: (entry: FuelEntry) => void
}

export function FuelModal({ open, onClose, onSaved }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [mileageKm, setMileageKm] = useState("")
  const [liters, setLiters] = useState("")
  const [pricePerLiter, setPricePerLiter] = useState("")
  const [totalEur, setTotalEur] = useState("")
  const [fullTank, setFullTank] = useState(true)
  const [station, setStation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().split("T")[0])
      setMileageKm("")
      setLiters("")
      setPricePerLiter("")
      setTotalEur("")
      setFullTank(true)
      setStation("")
      setError(null)
    }
  }, [open])

  // Auto-calculate total when liters or price changes
  useEffect(() => {
    const l = parseFloat(liters)
    const p = parseFloat(pricePerLiter)
    if (!isNaN(l) && !isNaN(p) && l > 0 && p > 0) {
      setTotalEur((l * p).toFixed(2))
    }
  }, [liters, pricePerLiter])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/fuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          mileageKm: parseInt(mileageKm),
          liters: parseFloat(liters),
          pricePerLiter: parseFloat(pricePerLiter),
          totalEur: parseFloat(totalEur),
          fullTank,
          station: station || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      onSaved(saved)
    } catch {
      setError("Failed to save fill-up")
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
          <h2 className="text-base font-semibold text-zinc-100">Log fill-up</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Mileage (km)"
              type="number"
              value={mileageKm}
              onChange={(e) => setMileageKm(e.target.value)}
              placeholder="185000"
              required
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Liters"
              type="number"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder="45.00"
              required
              min={0}
              step={0.01}
            />
            <Input
              label="Price per liter (KM)"
              type="number"
              value={pricePerLiter}
              onChange={(e) => setPricePerLiter(e.target.value)}
              placeholder="2.350"
              required
              min={0}
              step={0.001}
            />
          </div>

          <Input
            label="Total (KM)"
            type="number"
            value={totalEur}
            onChange={(e) => setTotalEur(e.target.value)}
            placeholder="Auto-calculated"
            required
            min={0}
            step={0.01}
          />

          <Input
            label="Station (optional)"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            placeholder="e.g. OMV, Petrol"
          />

          {/* Full tank toggle */}
          <button
            type="button"
            onClick={() => setFullTank((v) => !v)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-colors cursor-pointer ${
              fullTank
                ? "border-blue-700 bg-blue-900/20 text-blue-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400"
            }`}
          >
            <div>
              <p className="text-sm font-medium">Full tank</p>
              <p className="text-xs opacity-70">Required for accurate consumption calculation</p>
            </div>
            <div className={`h-5 w-9 rounded-full transition-colors ${fullTank ? "bg-blue-500" : "bg-zinc-600"}`}>
              <div className={`mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${fullTank ? "translate-x-4.5 ml-0.5" : "ml-0.5"}`} />
            </div>
          </button>

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
              {loading ? "Saving…" : "Log fill-up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
