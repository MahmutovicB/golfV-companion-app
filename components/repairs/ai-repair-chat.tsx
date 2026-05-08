"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Loader2, Bot, User } from "lucide-react"
import type { RepairGuide } from "@/lib/bkc/repair-guides"

type Message = {
  role: "user" | "ai"
  content: string
}

type Props = {
  guide: RepairGuide
  lastMileage: number | null
  onClose: () => void
}

export function AiRepairChat({ guide, lastMileage, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const context = `The user is working on: "${guide.title}" on their VW Golf 5 1.9 TDI BKC engine.${
    lastMileage ? ` Current mileage: ${lastMileage.toLocaleString()} km.` : ""
  } Guide difficulty: ${guide.difficulty}. Guide overview: ${guide.overview}`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `Error: ${err instanceof Error ? err.message : "Request failed"}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex flex-col w-full max-h-[85dvh] rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0">
          <div>
            <p className="font-semibold text-zinc-100">AI Mechanic</p>
            <p className="text-xs text-zinc-500 truncate max-w-[280px]">{guide.title}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-900/20 border border-yellow-800">
                <Bot className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Ask anything about this repair</p>
                <p className="mt-1 text-xs text-zinc-500">BKC-specific context is pre-loaded</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "What can go wrong?",
                  "Do I need VCDS?",
                  "Any BKC-specific tips?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-900/20 border border-yellow-800 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-yellow-400" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-200"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 mt-0.5">
                  <User className="h-3.5 w-3.5 text-zinc-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-900/20 border border-yellow-800">
                <Bot className="h-3.5 w-3.5 text-yellow-400" />
              </div>
              <div className="rounded-xl bg-zinc-800 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-800 p-4 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this repair…"
            disabled={loading}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-red-600 px-4 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
