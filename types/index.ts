export type MaintenanceLog = {
  id: string
  userId: string
  date: string
  mileageKm: number
  type: string
  description?: string | null
  costEur?: number | null
  workshop?: string | null
  nextDueKm?: number | null
  nextDueDate?: string | null
  createdAt: string
}

export type FaultCodeEntry = {
  id: string
  userId: string
  code: string
  description: string
  severity: 'low' | 'medium' | 'high'
  aiDiagnosis?: string | null
  resolvedAt?: string | null
  mileageKm?: number | null
  createdAt: string
}

export type Document = {
  id: string
  userId: string
  name: string
  category: 'manual' | 'invoice' | 'insurance' | 'mot' | 'other'
  fileUrl: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

export type FuelEntry = {
  id: string
  userId: string
  date: string
  mileageKm: number
  liters: number
  pricePerLiter: number
  totalEur: number
  fullTank: boolean
  station?: string | null
  createdAt: string
}

export type FuelStats = {
  avgConsumption: number | null
  totalCostAllTime: number
  totalCostLast30Days: number
  costPerKm: number | null
  bestConsumption: number | null
  worstConsumption: number | null
}

export type BkcDtcCode = {
  code: string
  vagCode?: string
  description: string
  bkcNotes: string
  severity: 'low' | 'medium' | 'high'
  commonCauses: string[]
  suggestedActions: string[]
}

export type AiDiagnosis = {
  summary: string
  likelyCauses: string[]
  suggestedSteps: string[]
  urgency: 'low' | 'medium' | 'high'
}

export type Obd2Reading = {
  pid: string
  name: string
  value: number
  unit: string
  raw: string
}
