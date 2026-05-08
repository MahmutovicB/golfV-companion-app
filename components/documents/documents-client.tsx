"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Image, Trash2, ExternalLink, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Document } from "@/types"

const CATEGORIES = ["all", "manual", "invoice", "insurance", "mot", "other"] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  manual: "Manuals",
  invoice: "Invoices",
  insurance: "Insurance",
  mot: "MOT / TÜV",
  other: "Other",
}

type Props = {
  initialDocuments: Document[]
  userId: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentsClient({ initialDocuments, userId }: Props) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null)
  const [uploadCategory, setUploadCategory] = useState<Exclude<Category, "all">>("invoice")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showToast(message: string, ok = true) {
    setToast({ message, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function uploadFile(file: File) {
    if (file.size > 20 * 1024 * 1024) {
      showToast("File exceeds 20MB limit", false)
      return
    }

    setUploading(true)
    setUploadProgress(`Uploading ${file.name}…`)

    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()
      const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`

      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(path, file, { cacheControl: "3600", upsert: false })

      if (storageError) throw new Error(storageError.message)

      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(path)

      setUploadProgress("Saving…")

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          category: uploadCategory,
          fileUrl: publicUrl,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      })

      if (!res.ok) throw new Error("Failed to save document")
      const saved: Document = await res.json()
      setDocuments((prev) => [saved, ...prev])
      showToast(`${file.name} uploaded`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", false)
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleDelete(doc: Document) {
    setDeletingId(doc.id)
    try {
      const supabase = createClient()
      // Extract storage path from URL
      const url = new URL(doc.fileUrl)
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/)
      if (pathMatch) {
        await supabase.storage.from("documents").remove([pathMatch[1]])
      }

      const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
      setConfirmDeleteId(null)
      showToast("Document deleted")
    } catch {
      showToast("Failed to delete", false)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = documents.filter((d) =>
    activeCategory === "all" ? true : d.category === activeCategory
  )

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl ${
          toast.ok
            ? "border-green-700 bg-green-900 text-green-100"
            : "border-red-700 bg-red-900 text-red-100"
        }`}>
          {toast.ok && <CheckCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Documents</h1>
        <p className="mt-1 text-sm text-zinc-400">{documents.length} files stored</p>
      </div>

      {/* Upload section */}
      <div className="space-y-4">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
            dragging
              ? "border-red-500 bg-red-900/10"
              : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30"
          } ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
            className="hidden"
            onChange={handleFileInput}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-9 w-9 animate-spin text-red-400" />
              <p className="text-sm text-zinc-400">{uploadProgress}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-9 w-9 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Drop a file here or <span className="text-red-400">browse</span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">PDF, JPG, PNG up to 20MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Category selector for upload */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-zinc-500 shrink-0">Upload to:</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(["invoice", "manual", "insurance", "mot", "other"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setUploadCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  uploadCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Browse section */}
      <div className="space-y-5">
        {/* Category filter tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-zinc-800">
          {CATEGORIES.map((cat) => {
            const count = cat === "all" ? documents.length : documents.filter(d => d.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 border-b-2 px-4 pb-3 pt-1 text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "border-red-500 text-zinc-100"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {CATEGORY_LABELS[cat]}
                {count > 0 && (
                  <span className="ml-1.5 rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Document list */}
        {filtered.length === 0 ? (
          <Card className="py-14 text-center">
            <p className="text-zinc-400">No {activeCategory !== "all" ? CATEGORY_LABELS[activeCategory].toLowerCase() : "documents"} yet.</p>
            <p className="mt-1 text-sm text-zinc-500">Drop a file above to upload.</p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                confirmDeleteId={confirmDeleteId}
                deletingId={deletingId}
                onConfirmDelete={setConfirmDeleteId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentCard({
  doc,
  confirmDeleteId,
  deletingId,
  onConfirmDelete,
  onDelete,
}: {
  doc: Document
  confirmDeleteId: string | null
  deletingId: string | null
  onConfirmDelete: (id: string | null) => void
  onDelete: (doc: Document) => void
}) {
  const isPdf = doc.mimeType.includes("pdf")
  const isImage = doc.mimeType.startsWith("image/")

  return (
    <Card className="group flex items-center gap-4 p-5 hover:border-zinc-600 transition-colors duration-150">
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
        {isPdf
          ? <FileText className="h-6 w-6 text-red-400" />
          : <Image className="h-6 w-6 text-blue-400" />}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">{doc.name}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {formatDate(doc.createdAt)} · {formatBytes(doc.sizeBytes)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {confirmDeleteId === doc.id ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(doc)}
              disabled={deletingId === doc.id}
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {deletingId === doc.id ? "..." : "Yes"}
            </button>
            <button
              onClick={() => onConfirmDelete(null)}
              className="rounded-lg bg-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-600 cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              aria-label="Open file"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => onConfirmDelete(doc.id)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </Card>
  )
}
