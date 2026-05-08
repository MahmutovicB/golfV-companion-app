// Source: VW Golf 5 / BKC workshop manual (Elsawin)
export type TorqueSpec = {
  name: string
  category: string
  nm: number | string
  notes?: string
}

export const BKC_TORQUE_SPECS: TorqueSpec[] = [
  // Engine — cylinder head (BKC specific)
  {
    name: "Cylinder head bolts — Stage 1",
    category: "engine",
    nm: 40,
    notes: "Tighten in sequence from center outward. These are torque-to-yield bolts — MUST be replaced after removal.",
  },
  {
    name: "Cylinder head bolts — Stage 2",
    category: "engine",
    nm: "+90°",
    notes: "Additional 90° turn after Stage 1. Replace bolts — do not reuse.",
  },
  {
    name: "Cylinder head bolts — Stage 3",
    category: "engine",
    nm: "+90°",
    notes: "Additional 90° turn after Stage 2. Total: 40Nm + 90° + 90°.",
  },
  // Injector clamp bolts — CRITICAL
  {
    name: "PD injector clamp bolt (M7)",
    category: "engine",
    nm: 20,
    notes: "CRITICAL — Do not overtighten. Overtightening cracks the injector body. Use a calibrated torque wrench. These are also angle-tighten: 20Nm then +90°.",
  },
  {
    name: "PD injector clamp bolt — final angle",
    category: "engine",
    nm: "+90°",
    notes: "After initial 20Nm torque. Total: 20Nm + 90°.",
  },
  // Timing belt
  {
    name: "Timing belt tensioner roller nut",
    category: "engine",
    nm: 20,
    notes: "Set tension with VCDS or dial gauge tool (T10008). Do not overtighten.",
  },
  {
    name: "Timing belt idler roller bolt",
    category: "engine",
    nm: 25,
  },
  {
    name: "Camshaft sprocket bolt",
    category: "engine",
    nm: 45,
  },
  {
    name: "Crankshaft pulley (vibration damper) bolt",
    category: "engine",
    nm: 90,
    notes: "Plus additional angle tighten per workshop manual. Requires holding tool.",
  },
  // Sump and oil system
  {
    name: "Sump drain plug (M14)",
    category: "engine",
    nm: 30,
    notes: "Replace crush washer at every oil change. Do not overtighten — aluminium sump.",
  },
  {
    name: "Oil filter housing cap",
    category: "engine",
    nm: 25,
  },
  // Brakes
  {
    name: "Brake caliper guide pin bolt (front)",
    category: "brakes",
    nm: 30,
  },
  {
    name: "Brake caliper carrier bolt (front)",
    category: "brakes",
    nm: 130,
  },
  {
    name: "Brake caliper guide pin bolt (rear)",
    category: "brakes",
    nm: 35,
  },
  {
    name: "Brake caliper carrier bolt (rear)",
    category: "brakes",
    nm: 65,
  },
  {
    name: "Brake disc retaining screw (front)",
    category: "brakes",
    nm: 5,
    notes: "Torx screw — only to hold disc in place during assembly.",
  },
  {
    name: "Brake master cylinder nuts",
    category: "brakes",
    nm: 25,
  },
  // Wheels
  {
    name: "Wheel bolts",
    category: "wheels",
    nm: 120,
    notes: "Steel wheels: 120Nm. Alloy wheels: 120Nm. Check after first 50km if recently removed.",
  },
  // Suspension
  {
    name: "Front strut top mount nut",
    category: "suspension",
    nm: 60,
  },
  {
    name: "Front lower control arm to subframe bolt",
    category: "suspension",
    nm: 100,
  },
  {
    name: "Front lower ball joint to hub carrier",
    category: "suspension",
    nm: 70,
  },
  {
    name: "Rear axle beam to body mounting bolts",
    category: "suspension",
    nm: 80,
  },
  {
    name: "Front anti-roll bar drop link",
    category: "suspension",
    nm: 40,
  },
  // Exhaust
  {
    name: "Exhaust manifold to cylinder head nuts",
    category: "exhaust",
    nm: 25,
    notes: "Use new self-locking nuts. Tighten when cold.",
  },
  {
    name: "Turbocharger to exhaust manifold",
    category: "exhaust",
    nm: 25,
    notes: "Use new self-locking nuts. Apply copper grease to threads.",
  },
  {
    name: "Turbo oil feed banjo bolt",
    category: "exhaust",
    nm: 20,
  },
  {
    name: "EGR valve to intake manifold",
    category: "exhaust",
    nm: 10,
  },
]
