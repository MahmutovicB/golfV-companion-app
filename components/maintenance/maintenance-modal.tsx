"use client"

import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { MaintenanceLog } from "@/types"

const BKC_TYPES = [
  "Oil change (5W-40 505.01)",
  "Oil filter",
  "Fuel filter",
  "Air filter",
  "Cabin / pollen filter",
  "Timing belt + tensioner + water pump",
  "EGR clean",
  "EGR valve replacement",
  "Swirl flap repair / delete",
  "Turbo inspection",
  "Brake fluid",
  "Coolant flush",
  "Glow plugs",
  "Front brakes",
  "Rear brakes",
  "Tyres",
  "Battery",
  "DSG oil",
  "General inspection (TÜV/MOT)",
  "Suspension",
  "Other",
]

type Props = {
  open: boolean
  entry: MaintenanceLog | null
  onClose: () => void
  onSaved: (entry: MaintenanceLog, isEdit: boolean) => void
}

type FormState = {
  date: string
  mileageKm: string
  type: string
  customType: string
  description: string
  costEur: string
  workshop: string
  nextDueKm: string
  nextDueDate: string
}

const EMPTY: FormState = {
  date: new Date().toISOString().split("T")[0],
  mileageKm: "",
  type: BKC_TYPES[0],
  customType: "",
  description: "",
  costEur: "",
  workshop: "",
  nextDueKm: "",
  nextDueDate: "",
}

export function MaintenanceModal({ open, entry, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!entry

  useEffect(() => {
    if (entry) {
      const isCustom = !BKC_TYPES.includes(entry.type)
      setForm({
        date: new Date(entry.date).toISOString().split("T")[0],
        mileageKm: String(entry.mileageKm),
        type: isCustom ? "Other" : entry.type,
        customType: isCustom ? entry.type : "",
        description: entry.description ?? "",
        costEur: entry.costEur != null ? String(entry.costEur) : "",
        workshop: entry.workshop ?? "",
        nextDueKm: entry.nextDueKm != null ? String(entry.nextDueKm) : "",
        nextDueDate: entry.nextDueDate
          ? new Date(entry.nextDueDate).toISOString().split("T")[0]
          : "",
      })
    } else {
      setForm(EMPTY)
    }
    setError(null)
  }, [entry, open])

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const resolvedType = form.type === "Other" && form.customType.trim()
      ? form.customType.trim()
      : form.type

    const body = {
      date: form.date,
      mileageKm: parseInt(form.mileageKm),
      type: resolvedType,
      description: form.description || undefined,
      costEur: form.costEur ? parseFloat(form.costEur) : undefined,
      workshop: form.workshop || undefined,
      nextDueKm: form.nextDueKm ? parseInt(form.nextDueKm) : undefined,
      nextDueDate: form.nextDueDate || undefined,
    }

    try {
      const url = isEdit ? `/api/maintenance/${entry!.id}` : "/api/maintenance"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.message ?? "Request failed")
      }

      const saved = await res.json()
      onSaved(saved, isEdit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">
            {isEdit ? "Edit entry" : "New maintenance entry"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
            />
            <Input
              label="Mileage (km)"
              type="number"
              value={form.mileageKm}
              onChange={(e) => set("mileageKm", e.target.value)}
              placeholder="185000"
              required
              min={0}
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="type-select">
              Type
            </label>
            <select
              id="type-select"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              {BKC_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {form.type === "Other" && (
            <Input
              label="Custom type"
              value={form.customType}
              onChange={(e) => set("customType", e.target.value)}
              placeholder="e.g. Intercooler pipe replacement"
              required
            />
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="description">
              Description <span className="text-zinc-500">(optional)</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="Any notes about this service..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cost (KM)"
              type="number"
              value={form.costEur}
              onChange={(e) => set("costEur", e.target.value)}
              placeholder="0.00"
              min={0}
              step={0.01}
            />
            <Input
              label="Workshop"
              value={form.workshop}
              onChange={(e) => set("workshop", e.target.value)}
              placeholder="e.g. VW dealer"
            />
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Next service due
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="At mileage (km)"
                type="number"
                value={form.nextDueKm}
                onChange={(e) => set("nextDueKm", e.target.value)}
                placeholder="195000"
                min={0}
              />
              <Input
                label="By date"
                type="date"
                value={form.nextDueDate}
                onChange={(e) => set("nextDueDate", e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save changes" : "Add entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
