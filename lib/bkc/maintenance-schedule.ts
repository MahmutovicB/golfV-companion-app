// Source: VW BKC workshop manual service schedule
export type ServiceItem = {
  name: string
  intervalKm: number
  intervalYears?: number
  notes: string
  critical: boolean
}

export const BKC_SERVICE_SCHEDULE: ServiceItem[] = [
  {
    name: "Engine oil (5W-40 VW 505.01)",
    intervalKm: 10000,
    intervalYears: 1,
    notes: "Must use 505.01 spec — critical for PD injector lubrication. Do not use 507.00 spec on BKC.",
    critical: true,
  },
  {
    name: "Oil filter",
    intervalKm: 10000,
    intervalYears: 1,
    notes: "Replace at every oil change.",
    critical: true,
  },
  {
    name: "Fuel filter",
    intervalKm: 30000,
    notes: "Clogged fuel filter causes P0087. Replace proactively on unknown service history vehicles.",
    critical: false,
  },
  {
    name: "Air filter",
    intervalKm: 30000,
    notes: "Check sooner if driving in dusty conditions. A dirty air filter stresses the MAF sensor.",
    critical: false,
  },
  {
    name: "Timing belt + tensioner + water pump",
    intervalKm: 90000,
    intervalYears: 5,
    notes: "CRITICAL — timing belt failure on BKC causes total engine destruction (interference engine). Replace water pump at same time as it is driven by the belt.",
    critical: true,
  },
  {
    name: "DSG oil (if DSG gearbox fitted)",
    intervalKm: 60000,
    notes: "Only applicable if the car has the DQ250 DSG. Use VW G 052 182 fluid.",
    critical: false,
  },
  {
    name: "Brake fluid",
    intervalKm: 0,
    intervalYears: 2,
    notes: "Replace every 2 years regardless of mileage. Use DOT 4 or VW specification.",
    critical: false,
  },
  {
    name: "Coolant",
    intervalKm: 0,
    intervalYears: 4,
    notes: "Use G12+ or G12++ (pink/red). Do not mix with green coolant. Change hoses if original.",
    critical: false,
  },
  {
    name: "Glow plugs",
    intervalKm: 100000,
    notes: "Inspect and test at 100,000 km. Use 4.4V type only (Beru or Bosch). Do NOT use 11V glow plugs — they will burn out immediately.",
    critical: false,
  },
  {
    name: "Pollen/cabin filter",
    intervalKm: 20000,
    intervalYears: 1,
    notes: "Located behind glove box. Easy DIY replacement.",
    critical: false,
  },
  {
    name: "Spark plugs",
    intervalKm: 0,
    notes: "N/A — BKC is a diesel engine, no spark plugs.",
    critical: false,
  },
]

export function getOverdueItems(currentMileageKm: number, lastServiceMileages: Record<string, number>) {
  return BKC_SERVICE_SCHEDULE.filter((item) => {
    if (item.intervalKm === 0) return false
    const lastDone = lastServiceMileages[item.name] ?? 0
    return currentMileageKm - lastDone >= item.intervalKm
  })
}
