import { BKC_PIDS, type PidDef } from "./commands"
import type { Obd2Reading } from "@/types"

export function parseElm327Response(raw: string, pid: PidDef): Obd2Reading | null {
  const cleaned = raw
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/>/g, "")
    .trim()
    .toUpperCase()

  if (
    cleaned.includes("NO DATA") ||
    cleaned.includes("ERROR") ||
    cleaned.includes("?") ||
    cleaned.length === 0
  ) {
    return null
  }

  const hexParts = cleaned.split(" ").filter((p) => /^[0-9A-F]{2}$/.test(p))

  // ELM327 response includes mode byte + PID byte + data bytes
  // e.g. "41 0C 1A F8" → mode 41 (01 response), PID 0C, data [1A, F8]
  const dataStart = hexParts.findIndex(
    (p) => parseInt(p, 16) === parseInt(pid.pid, 16)
  )

  if (dataStart === -1 || dataStart + pid.bytes > hexParts.length - 1) {
    return null
  }

  const dataBytes = hexParts
    .slice(dataStart + 1, dataStart + 1 + pid.bytes)
    .map((b) => parseInt(b, 16))

  const value = pid.formula(dataBytes)

  return {
    pid: pid.pid,
    name: pid.name,
    value,
    unit: pid.unit,
    raw: cleaned,
  }
}

export function parsePidById(pidId: string, raw: string): Obd2Reading | null {
  const pid = BKC_PIDS.find((p) => p.pid === pidId.toUpperCase())
  if (!pid) return null
  return parseElm327Response(raw, pid)
}
