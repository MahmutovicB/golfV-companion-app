import type { BkcDtcCode } from "@/types"

// Source: Ross-Tech VCDS documentation + VW BKC workshop manual
export const BKC_DTC_CODES: BkcDtcCode[] = [
  {
    code: "P0401",
    vagCode: "18005",
    description: "Exhaust Gas Recirculation Flow Insufficient Detected",
    bkcNotes:
      "Extremely common on BKC engines due to EGR valve carbon buildup. The BKC is highly prone to EGR clogging from the PD injection system's combustion characteristics.",
    severity: "medium",
    commonCauses: [
      "Carbon-clogged EGR valve (primary cause on BKC)",
      "Blocked EGR cooler passages",
      "Failed EGR position sensor",
      "Blocked intake manifold (swirl flap port area)",
    ],
    suggestedActions: [
      "Remove and clean EGR valve with carb cleaner",
      "Inspect EGR cooler for blockage",
      "Check EGR vacuum hoses for cracks",
      "Consider EGR delete if cleaning fails repeatedly",
    ],
  },
  {
    code: "P0299",
    vagCode: "17691",
    description: "Turbocharger/Supercharger A Underboost Condition",
    bkcNotes:
      "Common on high-mileage BKC. The BKC uses a variable geometry turbo (VNT). N75 solenoid failure is the most common cause before suspecting the turbo itself.",
    severity: "high",
    commonCauses: [
      "Failed or sticky N75 boost pressure solenoid",
      "Worn variable geometry turbo vanes",
      "Intercooler boost leak",
      "Split boost pipe (rubber section near intercooler)",
      "Blocked air filter",
    ],
    suggestedActions: [
      "Test N75 solenoid with VCDS basic settings",
      "Smoke test intercooler pipes for boost leaks",
      "Check air filter and MAF sensor",
      "Inspect VNT actuator rod movement",
      "Check turbo oil feed pipe for blockage",
    ],
  },
  {
    code: "P0087",
    vagCode: "17643",
    description: "Fuel Rail/System Pressure Too Low",
    bkcNotes:
      "Critical on BKC — the PD (pump-injector) system uses extremely high injection pressures. Low rail pressure typically indicates injector wear or the high-pressure fuel pump.",
    severity: "high",
    commonCauses: [
      "Worn PD injectors (very common at 150,000+ km)",
      "High-pressure fuel pump wear",
      "Clogged fuel filter (service at 30,000 km)",
      "Fuel pressure regulator failure",
    ],
    suggestedActions: [
      "Replace fuel filter first (cheap and overdue if unknown service history)",
      "Check fuel pressure with VCDS measuring block",
      "Perform injector return flow test",
      "Consider injector coding with VCDS after replacement",
    ],
  },
  {
    code: "P1666",
    vagCode: "18010",
    description: "Intake Flap for Intake Manifold Positioning Motor Malfunction",
    bkcNotes:
      "Extremely common BKC fault. Swirl flap shaft shears inside the intake manifold, causing the flap to become stuck or break off entirely. Broken flap pieces can enter the engine.",
    severity: "high",
    commonCauses: [
      "Sheared swirl flap shaft (design flaw in BKC intake manifold)",
      "Failed swirl flap motor/actuator",
      "Carbon buildup jamming flap mechanism",
    ],
    suggestedActions: [
      "Inspect swirl flap position through intake with camera",
      "Replace intake manifold with updated design or swirl flap delete kit",
      "Do NOT drive with broken flap — risk of engine ingestion",
      "Check for metal fragments in intake if flap is missing",
    ],
  },
  {
    code: "P0100",
    vagCode: "17508",
    description: "Mass Air Flow Sensor Circuit Malfunction",
    bkcNotes:
      "Common on BKC. The MAF sensor is located in the air filter housing outlet. Often caused by contamination from oily air filter or EGR gases recirculating.",
    severity: "medium",
    commonCauses: [
      "Dirty or oil-contaminated MAF sensor element",
      "Failed MAF sensor",
      "Air leak between MAF and turbo inlet",
      "Wiring fault on MAF connector",
    ],
    suggestedActions: [
      "Clean MAF sensor with MAF cleaner spray (do not touch the wire)",
      "Check air filter condition and housing seal",
      "Inspect MAF wiring harness and connector for corrosion",
      "Replace MAF sensor if cleaning doesn't resolve",
    ],
  },
  {
    code: "P0102",
    description: "Mass Air Flow Sensor Circuit Low Input",
    bkcNotes:
      "Low voltage signal from MAF. Often a wiring issue or completely failed sensor on the BKC.",
    severity: "medium",
    commonCauses: [
      "Open circuit in MAF wiring",
      "Failed MAF sensor",
      "Corroded MAF connector pins",
    ],
    suggestedActions: [
      "Check MAF connector for corrosion or pushed-back pins",
      "Measure voltage at MAF connector (should be 5V reference)",
      "Replace MAF sensor",
    ],
  },
  {
    code: "P0238",
    description: "Turbocharger Boost Sensor A Circuit High Input",
    bkcNotes:
      "MAP/boost pressure sensor reading too high. On BKC, this is often a failed sensor or boost leak causing sensor reference issues.",
    severity: "medium",
    commonCauses: [
      "Failed MAP/boost pressure sensor",
      "Short circuit in sensor wiring",
      "Boost pipe leak causing incorrect pressure reference",
    ],
    suggestedActions: [
      "Check MAP sensor wiring and connector",
      "Replace MAP sensor (inexpensive part)",
      "Inspect boost pipes for leaks",
    ],
  },
  {
    code: "P0190",
    description: "Fuel Rail Pressure Sensor Circuit Malfunction",
    bkcNotes:
      "Fuel rail pressure sensor circuit fault. Important to diagnose alongside P0087 on BKC.",
    severity: "medium",
    commonCauses: [
      "Failed fuel rail pressure sensor",
      "Wiring fault",
      "Actual fuel pressure issue affecting sensor operation",
    ],
    suggestedActions: [
      "Check sensor connector and wiring",
      "Replace fuel rail pressure sensor",
      "Verify actual fuel pressure with VCDS",
    ],
  },
  {
    code: "P0201",
    description: "Injector Circuit Open — Cylinder 1",
    bkcNotes:
      "PD injector wiring fault on cylinder 1. BKC injector wiring harnesses are prone to chafing against the cam cover.",
    severity: "high",
    commonCauses: [
      "Chafed injector wiring harness (common BKC failure point near cam cover)",
      "Failed PD injector solenoid on cylinder 1",
      "Damaged injector connector",
    ],
    suggestedActions: [
      "Inspect injector wiring harness routing over cam cover for chafing",
      "Check injector 1 connector and measure solenoid resistance (should be ~0.5Ω)",
      "Replace injector wiring loom if chafed",
    ],
  },
  {
    code: "P0202",
    description: "Injector Circuit Open — Cylinder 2",
    bkcNotes: "Same as P0201 but cylinder 2. See BKC injector wiring harness note.",
    severity: "high",
    commonCauses: [
      "Chafed injector wiring harness",
      "Failed PD injector solenoid on cylinder 2",
    ],
    suggestedActions: [
      "Inspect injector wiring harness for chafing near cam cover",
      "Check injector 2 connector and solenoid resistance",
    ],
  },
  {
    code: "P0203",
    description: "Injector Circuit Open — Cylinder 3",
    bkcNotes: "Same as P0201 but cylinder 3.",
    severity: "high",
    commonCauses: [
      "Chafed injector wiring harness",
      "Failed PD injector solenoid on cylinder 3",
    ],
    suggestedActions: [
      "Inspect injector wiring harness for chafing near cam cover",
      "Check injector 3 connector and solenoid resistance",
    ],
  },
  {
    code: "P0204",
    description: "Injector Circuit Open — Cylinder 4",
    bkcNotes: "Same as P0201 but cylinder 4.",
    severity: "high",
    commonCauses: [
      "Chafed injector wiring harness",
      "Failed PD injector solenoid on cylinder 4",
    ],
    suggestedActions: [
      "Inspect injector wiring harness for chafing near cam cover",
      "Check injector 4 connector and solenoid resistance",
    ],
  },
  {
    code: "P0340",
    description: "Camshaft Position Sensor A Circuit Malfunction",
    bkcNotes:
      "Hall sensor on the camshaft. On BKC, this can be caused by timing belt wear affecting cam position, or a failed sensor. Check timing belt condition if this appears.",
    severity: "high",
    commonCauses: [
      "Failed camshaft position sensor",
      "Timing belt skip or stretch",
      "Sensor wiring fault",
      "Reluctor wheel damage",
    ],
    suggestedActions: [
      "Check timing belt condition immediately",
      "Replace camshaft position sensor",
      "Check sensor wiring and connector",
    ],
  },
  {
    code: "P0335",
    description: "Crankshaft Position Sensor A Circuit Malfunction",
    bkcNotes:
      "Critical sensor for engine management on BKC. Engine may not start or run rough.",
    severity: "high",
    commonCauses: [
      "Failed crankshaft position sensor",
      "Damaged reluctor ring on flywheel",
      "Sensor wiring fault",
    ],
    suggestedActions: [
      "Replace crankshaft position sensor",
      "Inspect flywheel reluctor ring for damage",
      "Check sensor wiring harness",
    ],
  },
  {
    code: "P0380",
    description: "Glow Plug/Heater Circuit A Malfunction",
    bkcNotes:
      "Common on BKC at higher mileages. Glow plugs are critical for cold starting on a diesel. BKC uses 4.4V glow plugs — do not fit 11V plugs.",
    severity: "medium",
    commonCauses: [
      "Failed glow plug(s) — inspect at 100,000 km",
      "Failed glow plug relay",
      "Wiring fault to glow plug circuit",
    ],
    suggestedActions: [
      "Test individual glow plugs with continuity tester",
      "Replace failed glow plugs (use Beru or Bosch, 4.4V type for BKC)",
      "Check glow plug relay operation",
    ],
  },
  {
    code: "P0500",
    description: "Vehicle Speed Sensor A Malfunction",
    bkcNotes:
      "ABS speed sensor or gearbox output sensor fault. Affects speedo, cruise control, and some fuel delivery calculations.",
    severity: "medium",
    commonCauses: [
      "Failed ABS wheel speed sensor",
      "Damaged tone ring (common after suspension work)",
      "Wiring fault",
    ],
    suggestedActions: [
      "Check ABS sensor readings with VCDS",
      "Inspect ABS sensor wiring and connector",
      "Replace faulty wheel speed sensor",
    ],
  },
  {
    code: "P0545",
    description: "Exhaust Gas Temperature Sensor Circuit Low",
    bkcNotes: "EGT sensor circuit fault. Important for protecting the turbo on BKC.",
    severity: "medium",
    commonCauses: ["Failed EGT sensor", "Wiring fault", "Corroded connector"],
    suggestedActions: [
      "Check EGT sensor connector for corrosion",
      "Measure sensor resistance",
      "Replace EGT sensor",
    ],
  },
  {
    code: "P0546",
    description: "Exhaust Gas Temperature Sensor Circuit High",
    bkcNotes: "EGT sensor reading out of range high. Could mask actual overtemp condition.",
    severity: "medium",
    commonCauses: ["Failed EGT sensor (open circuit)", "Wiring fault"],
    suggestedActions: [
      "Check EGT sensor wiring for open circuit",
      "Replace EGT sensor",
    ],
  },
  {
    code: "P1265",
    description: "Fuel Quantity Actuator Circuit Malfunction",
    bkcNotes:
      "Relates to the fuel quantity control valve on the high pressure pump. Important BKC fuel system fault.",
    severity: "high",
    commonCauses: [
      "Failed fuel quantity actuator on high pressure pump",
      "Wiring fault",
      "High pressure fuel pump failure",
    ],
    suggestedActions: [
      "Check actuator wiring and connector",
      "Test actuator with VCDS output tests",
      "Replace high pressure fuel pump if actuator tests OK",
    ],
  },
  {
    code: "P1248",
    description: "Start of Injection Timing Control Error",
    bkcNotes:
      "Injection timing fault on BKC PD system. Often caused by worn timing belt affecting injection timing.",
    severity: "high",
    commonCauses: [
      "Stretched or worn timing belt affecting injection timing",
      "Failed injection timing sensor",
      "PD injector wear",
    ],
    suggestedActions: [
      "Check timing belt condition — replace if overdue",
      "Verify injection timing with VCDS",
      "Check camshaft and crankshaft sensor correlation",
    ],
  },
  {
    code: "P0172",
    description: "System Too Rich (Bank 1)",
    bkcNotes:
      "Rich running condition. On a diesel like the BKC, this is unusual and warrants investigation of fueling system.",
    severity: "medium",
    commonCauses: [
      "Stuck open fuel injector",
      "Failed MAF sensor causing incorrect fueling",
      "Fuel pressure regulator stuck open",
    ],
    suggestedActions: [
      "Check MAF sensor readings with VCDS",
      "Perform injector return flow test",
      "Check fuel pressure",
    ],
  },
  {
    code: "P0115",
    description: "Engine Coolant Temperature Sensor Circuit Malfunction",
    bkcNotes:
      "ECT sensor fault. Critical for cold start fueling and EGR operation on BKC. A failed sensor can cause black smoke and rough running when cold.",
    severity: "medium",
    commonCauses: [
      "Failed coolant temperature sensor",
      "Corroded sensor connector (common near thermostat housing on BKC)",
      "Wiring fault",
    ],
    suggestedActions: [
      "Inspect sensor connector for corrosion",
      "Replace coolant temperature sensor",
      "Check wiring harness routing near coolant hoses",
    ],
  },
  {
    code: "P0116",
    description: "Engine Coolant Temperature Sensor Circuit Range/Performance",
    bkcNotes:
      "ECT sensor reading out of expected range. Often a slow-reading or stuck sensor on BKC.",
    severity: "low",
    commonCauses: ["Failed ECT sensor", "Air lock in coolant system"],
    suggestedActions: [
      "Replace coolant temperature sensor",
      "Bleed cooling system",
    ],
  },
  {
    code: "P0031",
    description: "O2 Sensor Heater Circuit Low — Bank 1, Sensor 1",
    bkcNotes: "Lambda sensor heater circuit fault. BKC uses a wideband lambda sensor pre-turbo.",
    severity: "low",
    commonCauses: [
      "Failed lambda sensor heater element",
      "Wiring fault to lambda sensor",
    ],
    suggestedActions: [
      "Replace lambda sensor",
      "Check heater circuit wiring",
    ],
  },
  {
    code: "P0130",
    description: "O2 Sensor Circuit Malfunction — Bank 1, Sensor 1",
    bkcNotes: "Lambda sensor signal fault. Affects fuel trim and emissions on BKC.",
    severity: "medium",
    commonCauses: [
      "Failed lambda sensor",
      "Exhaust leak near sensor",
      "Wiring fault",
    ],
    suggestedActions: [
      "Check for exhaust leaks near sensor location",
      "Replace lambda sensor",
      "Check sensor wiring and connector",
    ],
  },
  {
    code: "P0234",
    description: "Turbocharger/Supercharger A Overboost Condition",
    bkcNotes:
      "Overboost on BKC. Often caused by a stuck-open N75 solenoid or stuck VNT mechanism. Can cause engine damage if sustained.",
    severity: "high",
    commonCauses: [
      "N75 boost solenoid stuck open",
      "VNT actuator mechanism stuck",
      "Boost pressure sensor fault causing ECU to not limit boost",
    ],
    suggestedActions: [
      "Test N75 solenoid with VCDS",
      "Check VNT actuator movement",
      "Do not run engine at high load until resolved",
    ],
  },
  {
    code: "P0403",
    description: "Exhaust Gas Recirculation Circuit Malfunction",
    bkcNotes: "EGR electrical circuit fault, distinct from P0401 which is a flow issue.",
    severity: "medium",
    commonCauses: [
      "Failed EGR solenoid/motor",
      "Wiring fault to EGR valve",
      "Failed EGR position sensor",
    ],
    suggestedActions: [
      "Test EGR valve motor operation with VCDS output tests",
      "Check EGR wiring and connector",
      "Replace EGR valve assembly",
    ],
  },
  {
    code: "P0488",
    description: "Exhaust Gas Recirculation Throttle Control Circuit Range/Performance",
    bkcNotes: "EGR throttle valve control issue, related to intake flap system on BKC.",
    severity: "medium",
    commonCauses: [
      "Carbon buildup on EGR throttle",
      "Failed EGR throttle position sensor",
      "Actuator fault",
    ],
    suggestedActions: [
      "Clean EGR throttle valve",
      "Check EGR throttle actuator",
      "Replace if cleaning doesn't resolve",
    ],
  },
  {
    code: "P0606",
    description: "ECM/PCM Processor Fault",
    bkcNotes: "ECU internal fault code. Rare but serious on BKC.",
    severity: "high",
    commonCauses: [
      "Failed ECU",
      "Battery voltage spike causing ECU corruption",
      "Water ingress to ECU (check under windscreen tray)",
    ],
    suggestedActions: [
      "Check for water ingress near ECU location",
      "Verify battery and alternator voltage",
      "ECU may require replacement or repair",
    ],
  },
  {
    code: "U0100",
    description: "Lost Communication with ECM/PCM A",
    bkcNotes: "CAN bus communication fault. Often a wiring or ground issue on BKC.",
    severity: "high",
    commonCauses: [
      "CAN bus wiring fault",
      "Poor chassis ground connection",
      "Failed ECU",
    ],
    suggestedActions: [
      "Check and clean all chassis ground connections",
      "Inspect CAN bus wiring harness",
      "Check battery terminals",
    ],
  },
]

export function lookupDtcCode(code: string): BkcDtcCode | undefined {
  const normalized = code.toUpperCase().trim()
  return BKC_DTC_CODES.find(
    (dtc) =>
      dtc.code === normalized || dtc.vagCode === normalized
  )
}
