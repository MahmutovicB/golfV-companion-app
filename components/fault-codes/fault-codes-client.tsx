"use client"

import { useState } from "react"
import { Plus, CheckCircle, RotateCcw, Trash2, ChevronDown, ChevronUp, Zap, AlertTriangle, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaultCodeModal } from "./fault-code-modal"
import { AiDiagnosisPanel } from "./ai-diagnosis-panel"
import { CodeLookup } from "./code-lookup"
import { formatDate, formatMileage } from "@/lib/utils"
import type { FaultCodeEntry } from "@/types"

type Props = {
  initialEntries: FaultCodeEntry[]
}

export function FaultCodesClient({ initialEntries }: Props) {
  const [entries, setEntries] = useState<FaultCodeEntry[]>(initialEntries)
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all")

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleSaved(entry: FaultCodeEntry) {
    setEntries((prev) => [entry, ...prev])
    setModalOpen(false)
    showToast("Fault code logged")
  }

  function handleDiagnosisSaved(id: string, diagnosis: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, aiDiagnosis: diagnosis } : e))
    )
  }

  async function toggleResolve(entry: FaultCodeEntry) {
    setTogglingId(entry.id)
    try {
      const res = await fetch(`/api/fault-codes/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolvedAt: entry.resolvedAt ? null : new Date().toISOString() }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      showToast(entry.resolvedAt ? "Marked as active" : "Marked as resolved")
    } catch {
      showToast("Failed to update")
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/fault-codes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setEntries((prev) => prev.filter((e) => e.id !== id))
      setConfirmDeleteId(null)
      showToast("Entry deleted")
    } catch {
      showToast("Failed to delete")
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = entries.filter((e) => {
    if (filter === "active") return !e.resolvedAt
    if (filter === "resolved") return !!e.resolvedAt
    return true
  })

  const activeCount = entries.filter((e) => !e.resolvedAt).length

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 shadow-2xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Fault Codes</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            {activeCount} active · {entries.length - activeCount} resolved
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Log code
        </button>
      </div>

      {/* Code lookup */}
      <CodeLookup />

      {/* Filter chips */}
      <div className="flex gap-2">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-150 cursor-pointer ${
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
      <div className="pt-2 space-y-2">
        {filtered.length === 0 ? (
          <Card className="py-14 text-center">
            <p className="text-zinc-400">No {filter !== "all" ? filter : ""} fault codes.</p>
            <button onClick={() => setModalOpen(true)} className="mt-2 text-sm text-red-400 hover:text-red-300 cursor-pointer">
              Log your first code →
            </button>
          </Card>
        ) : (
          filtered.map((entry) => (
            <Card
              key={entry.id}
              className={`transition-colors duration-150 ${entry.resolvedAt ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                {/* Severity indicator */}
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  entry.severity === "high" ? "bg-red-500" :
                  entry.severity === "medium" ? "bg-yellow-500" : "bg-green-500"
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold text-zinc-100">{entry.code}</span>
                    <Badge variant={entry.severity as "low" | "medium" | "high"}>{entry.severity}</Badge>
                    {entry.resolvedAt && <Badge variant="success">Resolved</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-300">{entry.description}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                    <span>{formatDate(entry.createdAt)}</span>
                    {entry.mileageKm && <span className="font-mono">{formatMileage(entry.mileageKm)}</span>}
                  </div>

                  {/* AI diagnosis panel */}
                  {expandedId === entry.id && (
                    <AiDiagnosisPanel
                      entry={entry}
                      onDiagnosisSaved={(diag) => handleDiagnosisSaved(entry.id, diag)}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {/* AI toggle */}
                    <button
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-yellow-400 transition-colors cursor-pointer"
                      aria-label="AI diagnosis"
                      title="AI diagnosis"
                    >
                      {expandedId === entry.id
                        ? <ChevronUp className="h-3.5 w-3.5" />
                        : <Zap className="h-3.5 w-3.5" />}
                    </button>

                    {/* Resolve toggle */}
                    <button
                      onClick={() => toggleResolve(entry)}
                      disabled={togglingId === entry.id}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-green-400 transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label={entry.resolvedAt ? "Mark active" : "Mark resolved"}
                      title={entry.resolvedAt ? "Mark active" : "Mark resolved"}
                    >
                      {entry.resolvedAt
                        ? <RotateCcw className="h-3.5 w-3.5" />
                        : <CheckCircle className="h-3.5 w-3.5" />}
                    </button>

                    {/* Delete */}
                    {confirmDeleteId === entry.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === entry.id ? "..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-lg bg-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-600 cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(entry.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <FaultCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
