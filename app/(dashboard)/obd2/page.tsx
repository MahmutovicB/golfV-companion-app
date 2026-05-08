import { Card } from "@/components/ui/card"

export default function Obd2Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">OBD2 Live Data</h1>
        <p className="mt-1 text-sm text-zinc-400">Real-time sensor readings via Bluetooth ELM327</p>
      </div>

      <Card className="border-yellow-800 bg-yellow-900/20 text-yellow-300 text-sm">
        <strong>Browser requirement:</strong> Web Bluetooth requires Chrome or Edge on Android or desktop.
        It does not work in Firefox or Safari.
      </Card>

      {/* OBD2 live component will be loaded client-side in Phase 6 */}
      <Card className="py-12 text-center">
        <p className="text-zinc-400">OBD2 live data coming in Phase 6.</p>
        <p className="mt-1 text-sm text-zinc-500">Connect an ELM327 Bluetooth adapter to use this feature.</p>
      </Card>
    </div>
  )
}
