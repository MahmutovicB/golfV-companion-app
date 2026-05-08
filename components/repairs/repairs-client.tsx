"use client"

import { useState, useMemo } from "react"
import { Search, ChevronDown, ChevronUp, Wrench, Clock, AlertTriangle, MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AiRepairChat } from "./ai-repair-chat"
import { BKC_TORQUE_SPECS } from "@/lib/bkc/torque-specs"
import type { RepairGuide } from "@/lib/bkc/repair-guides"

const DIFFICULTY_COLORS = {
  easy: "bg-green-900/40 text-green-400 border-green-800",
  moderate: "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  hard: "bg-orange-900/40 text-orange-400 border-orange-800",
  expert: "bg-red-900/40 text-red-400 border-red-800",
}

const CATEGORIES = ["all", "engine", "brakes", "suspension", "electrical", "fluids"] as const

type Props = {
  guides: RepairGuide[]
  lastMileage: number | null
}

export function RepairsClient({ guides, lastMileage }: Props) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [chatGuide, setChatGuide] = useState<RepairGuide | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return guides.filter((g) => {
      const matchesCategory = activeCategory === "all" || g.category === activeCategory
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.overview.toLowerCase().includes(q) ||
        g.tools.some((t) => t.toLowerCase().includes(q)) ||
        g.steps.some((s) => s.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [guides, query, activeCategory])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Repair Guides</h1>
        <p className="mt-0.5 text-sm text-zinc-400">BKC-specific procedures & torque specs</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides, tools, procedures…"
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-zinc-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {/* Guide list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="py-14 text-center">
            <p className="text-zinc-400">No guides found for &quot;{query}&quot;.</p>
            <button onClick={() => setQuery("")} className="mt-2 text-sm text-red-400 hover:text-red-300 cursor-pointer">
              Clear search
            </button>
          </Card>
        ) : (
          filtered.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              expanded={expandedId === guide.id}
              onToggle={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
              onAskAi={() => setChatGuide(guide)}
            />
          ))
        )}
      </div>

      {/* Torque specs reference */}
      <TorqueSpecsSection />

      {/* AI chat panel */}
      {chatGuide && (
        <AiRepairChat
          guide={chatGuide}
          lastMileage={lastMileage}
          onClose={() => setChatGuide(null)}
        />
      )}
    </div>
  )
}

function GuideCard({
  guide,
  expanded,
  onToggle,
  onAskAi,
}: {
  guide: RepairGuide
  expanded: boolean
  onToggle: () => void
  onAskAi: () => void
}) {
  const torqueRefs = BKC_TORQUE_SPECS.filter((s) =>
    guide.torqueSpecRefs.includes(s.name)
  )

  return (
    <Card className="overflow-hidden transition-colors duration-150 hover:border-zinc-700">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-zinc-100">{guide.title}</span>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_COLORS[guide.difficulty]}`}>
              {guide.difficulty}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
            <span className="flex items-center gap-1 capitalize">
              <Wrench className="h-3 w-3" />{guide.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />{guide.estimatedTime}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-zinc-500" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 space-y-5 border-t border-zinc-800 pt-4">
          {/* Overview */}
          <p className="text-sm text-zinc-300 leading-relaxed">{guide.overview}</p>

          {/* Warnings */}
          {guide.warnings.length > 0 && (
            <div className="space-y-2">
              {guide.warnings.map((w, i) => (
                <div key={i} className="flex gap-2 rounded-lg border border-yellow-900/50 bg-yellow-900/10 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                  <p className="text-xs text-yellow-300">{w}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Tools */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tools needed</p>
              <ul className="space-y-1.5">
                {guide.tools.map((tool, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {/* Torque specs */}
            {torqueRefs.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Torque specs</p>
                <div className="space-y-2">
                  {torqueRefs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                      <span className="text-xs text-zinc-400">{spec.name}</span>
                      <span className="font-mono text-sm font-bold text-blue-400">
                        {typeof spec.nm === "number" ? `${spec.nm} Nm` : spec.nm}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Steps */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Procedure</p>
            <ol className="space-y-3">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-mono text-xs text-zinc-500">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Ask AI button */}
          <button
            onClick={onAskAi}
            className="flex items-center gap-2 rounded-xl border border-yellow-800 bg-yellow-900/10 px-4 py-3 text-sm text-yellow-400 hover:bg-yellow-900/20 transition-colors cursor-pointer w-full"
          >
            <MessageSquare className="h-4 w-4" />
            Ask AI about this repair
          </button>
        </div>
      )}
    </Card>
  )
}

function TorqueSpecsSection() {
  const [expanded, setExpanded] = useState(false)
  const categories = ["engine", "brakes", "suspension", "exhaust", "wheels"]

  return (
    <div className="rounded-xl border border-zinc-800">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 cursor-pointer"
      >
        <div>
          <p className="font-semibold text-zinc-100">Full torque specs reference</p>
          <p className="text-xs text-zinc-500 mt-0.5">All BKC torque values</p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-5 pb-5 pt-4 space-y-5">
          {categories.map((cat) => {
            const specs = BKC_TORQUE_SPECS.filter((s) => s.category === cat)
            if (!specs.length) return null
            return (
              <div key={cat}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 capitalize">{cat}</p>
                <div className="overflow-hidden rounded-xl border border-zinc-800">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map((spec, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30">
                          <td className="px-4 py-3">
                            <p className="font-medium text-zinc-200">{spec.name}</p>
                            {spec.notes && <p className="mt-0.5 text-xs text-zinc-500">{spec.notes}</p>}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-blue-400 whitespace-nowrap">
                            {typeof spec.nm === "number" ? `${spec.nm} Nm` : spec.nm}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
