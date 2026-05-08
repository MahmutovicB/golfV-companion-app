// OBD2 PID definitions relevant for the BKC 1.9 TDI engine
// Source: https://en.wikipedia.org/wiki/OBD-II_PIDs
export type PidDef = {
  pid: string
  name: string
  mode: string
  bytes: number
  unit: string
  formula: (bytes: number[]) => number
}

export const BKC_PIDS: PidDef[] = [
  {
    pid: "0C",
    name: "Engine RPM",
    mode: "01",
    bytes: 2,
    unit: "RPM",
    formula: ([a, b]) => ((a * 256 + b) / 4),
  },
  {
    pid: "0D",
    name: "Vehicle Speed",
    mode: "01",
    bytes: 1,
    unit: "km/h",
    formula: ([a]) => a,
  },
  {
    pid: "05",
    name: "Coolant Temperature",
    mode: "01",
    bytes: 1,
    unit: "°C",
    formula: ([a]) => a - 40,
  },
  {
    pid: "0F",
    name: "Intake Air Temperature",
    mode: "01",
    bytes: 1,
    unit: "°C",
    formula: ([a]) => a - 40,
  },
  {
    pid: "04",
    name: "Engine Load",
    mode: "01",
    bytes: 1,
    unit: "%",
    formula: ([a]) => Math.round((a / 255) * 100),
  },
  {
    pid: "11",
    name: "Throttle Position",
    mode: "01",
    bytes: 1,
    unit: "%",
    formula: ([a]) => Math.round((a / 255) * 100),
  },
  {
    pid: "2F",
    name: "Fuel Level",
    mode: "01",
    bytes: 1,
    unit: "%",
    formula: ([a]) => Math.round((a / 255) * 100),
  },
  {
    pid: "1F",
    name: "Run Time Since Engine Start",
    mode: "01",
    bytes: 2,
    unit: "s",
    formula: ([a, b]) => a * 256 + b,
  },
  {
    pid: "23",
    name: "Fuel Rail Pressure",
    mode: "01",
    bytes: 2,
    unit: "kPa",
    // Critical for BKC injector health monitoring
    formula: ([a, b]) => (a * 256 + b) * 10,
  },
  {
    pid: "0B",
    name: "Intake Manifold Pressure",
    mode: "01",
    bytes: 1,
    unit: "kPa",
    formula: ([a]) => a,
  },
]

export function buildPidCommand(pid: PidDef): string {
  return `${pid.mode}${pid.pid}\r`
}
