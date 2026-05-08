"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ChevronDown, AlertTriangle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MaintenanceModal } from "./maintenance-modal"
import { formatDate, formatMileage, formatCurrency } from "@/lib/utils"
import type { MaintenanceLog } from "@/types"

const TYPE_FILTERS = ["All", "Oil change", "Filters", "Timing belt", "Brakes", "Fluids", "Other"]

type Props = {
  initialEntries: MaintenanceLog[]
}

export function MaintenanceClient({ initialEntries }: Props) {
  const [entries, setEntries] = useState<MaintenanceLog[]>(initialEntries)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<MaintenanceLog | null>(null)
  const [filter, setFilter] = useState("All")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openAdd() {
    setEditingEntry(null)
    setModalOpen(true)
  }

  function openEdit(entry: MaintenanceLog) {
    setEditingEntry(entry)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/maintenance/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setEntries((prev) => prev.filter((e) => e.id !== id))
      setConfirmDeleteId(null)
      showToast("Entry deleted", "success")
    } catch {
      showToast("Failed to delete entry", "error")
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved(entry: MaintenanceLog, isEdit: boolean) {
    if (isEdit) {
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))
      showToast("Entry updated", "success")
    } else {
      setEntries((prev) => [entry, ...prev])
      showToast("Entry added", "success")
    }
    setModalOpen(false)
  }

  const filtered = entries.filter((e) => {
    if (filter === "All") return true
    if (filter === "Oil change") return e.type.toLowerCase().includes("oil")
    if (filter === "Filters") return e.type.toLowerCase().includes("filter")
    if (filter === "Timing belt") return e.type.toLowerCase().includes("timing")
    if (filter === "Brakes") return e.type.toLowerCase().includes("brake")
    if (filter === "Fluids") return ["brake fluid", "coolant", "dsg"].some(k => e.type.toLowerCase().includes(k))
    return true
  })

  const totalSpend = entries.reduce((sum, e) => sum + (e.costEur ?? 0), 0)

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl transition-all ${
          toast.type === "success"
            ? "bg-green-900 border border-green-700 text-green-100"
            : "bg-red-900 border border-red-700 text-red-100"
        }`}>
          {toast.type === "success"
            ? <CheckCircle className="h-4 w-4" />
            : <AlertTriangle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Maintenance Log</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            {entries.length} entries · {formatCurrency(totalSpend)} total
          </p>
        </div>
        <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700 gap-2">
          <Plus className="h-4 w-4" />
          Add entry
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
              filter === f
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="pt-2">
      {filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <p className="text-zinc-400">No entries{filter !== "All" ? ` for "${filter}"` : ""}.</p>
          <button onClick={openAdd} className="mt-2 text-sm text-red-400 hover:text-red-300 cursor-pointer">
            Add your first entry →
          </button>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <Card key={entry.id} className="group transition-colors duration-150 hover:border-zinc-700">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-100">{entry.type}</span>
                    {entry.nextDueKm && (
                      <Badge variant="default" className="text-xs">
                        Next: {formatMileage(entry.nextDueKm)}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                    <span>{formatDate(entry.date)}</span>
                    <span className="font-mono">{formatMileage(entry.mileageKm)}</span>
                    {entry.workshop && <span>{entry.workshop}</span>}
                  </div>
                  {entry.description && (
                    <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2">{entry.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {entry.costEur != null && (
                    <span className="font-mono text-sm font-semibold text-zinc-100">
                      {formatCurrency(entry.costEur)}
                    </span>
                  )}

                  {confirmDeleteId === entry.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === entry.id ? "..." : "Yes"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg bg-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-600 cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(entry)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
                        aria-label="Edit entry"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(entry.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>

      <MaintenanceModal
        open={modalOpen}
        entry={editingEntry}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
