"use client"

import { useEffect, useState } from "react"
import { X, Share, PlusSquare } from "lucide-react"

export function IosInstallPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const dismissed = sessionStorage.getItem("ios-prompt-dismissed")

    if (isIos && !isStandalone && !dismissed) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem("ios-prompt-dismissed", "1")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/icons/apple-touch-icon.png" alt="App icon" className="h-12 w-12 rounded-xl" />
          <div>
            <p className="font-semibold text-zinc-100 text-sm">Install Golf BKC</p>
            <p className="text-xs text-zinc-400 mt-0.5">Add to your Home Screen for the best experience</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300 cursor-pointer mt-0.5" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800">
            <Share className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <span>Tap the <span className="text-zinc-200 font-medium">Share</span> button in Safari</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800">
            <PlusSquare className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <span>Tap <span className="text-zinc-200 font-medium">"Add to Home Screen"</span></span>
        </div>
      </div>
    </div>
  )
}
