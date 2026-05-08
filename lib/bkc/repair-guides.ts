// Source: VW Golf 5 BKC workshop manual (Elsawin), Ross-Tech wiki, BKC owner community guides
export type RepairGuide = {
  id: string
  title: string
  category: "engine" | "brakes" | "suspension" | "electrical" | "fluids"
  difficulty: "easy" | "moderate" | "hard" | "expert"
  estimatedTime: string
  overview: string
  tools: string[]
  warnings: string[]
  steps: string[]
  torqueSpecRefs: string[] // Names matching BKC_TORQUE_SPECS entries
}

export const BKC_REPAIR_GUIDES: RepairGuide[] = [
  {
    id: "oil-change",
    title: "Engine oil & filter change",
    category: "engine",
    difficulty: "easy",
    estimatedTime: "30–45 min",
    overview:
      "The BKC requires 5W-40 oil meeting VW 505.01 specification due to the pump-injector (PD) system. Using incorrect oil spec will damage the PD injectors over time. Change interval: 10,000 km or 1 year. Source: VW Workshop Manual Golf 2004, Rep. gr. 17.",
    tools: [
      "17mm socket (sump plug)",
      "Oil filter wrench or strap wrench",
      "Drain pan (5L+)",
      "Funnel",
      "Torque wrench (V.A.G 1331 or equivalent)",
      "Jack and axle stands (if no ramp)",
    ],
    warnings: [
      "ONLY use VW 505.01 spec oil (e.g. Castrol Edge 5W-40, Liqui-Moly 5W-40 PD). 507.00 spec will damage PD injectors.",
      "BKC capacity: 3.8 L with filter, 3.3 L without filter. Do NOT overfill — danger of catalytic converter damage.",
      "Replace the sump plug washer (renew at every change — specified in VW workshop manual). Reusing causes leaks.",
      "Do not fill above MAX mark on dipstick.",
    ],
    steps: [
      "Warm engine to operating temperature, then switch off and wait 10 minutes.",
      "Jack up car or drive onto ramps. Remove engine undertray if fitted.",
      "Place drain pan under sump plug. Remove 17mm sump plug and allow oil to drain fully.",
      "Remove oil filter using filter wrench. Expect some additional oil spillage.",
      "Fit new filter — hand tighten then 1/2 turn with wrench. Do not overtighten.",
      "Refit sump plug with NEW washer. Torque to 30 Nm.",
      "Fill with 3.8 L of 5W-40 505.01 oil (BKC with filter change). Do not overfill.",
      "Start engine, check for leaks around filter and sump plug.",
      "Stop engine, wait 5 minutes, check oil level on dipstick. Level must be within hatched field — do not exceed MAX.",
    ],
    torqueSpecRefs: ["Sump drain plug (M14)", "Oil filter housing cap"],
  },
  {
    id: "timing-belt",
    title: "Timing belt, tensioner & water pump",
    category: "engine",
    difficulty: "expert",
    estimatedTime: "5–8 hours",
    overview:
      "The most critical service on the BKC. The toothed belt drives the camshaft, injection pump, and water pump. Failure causes total engine destruction (interference engine). Replace at 90,000 km or 5 years — whichever comes first. Always replace water pump, tensioner, and idler roller at the same time. Source: VW Workshop Manual Golf 2004, Rep. gr. 15.",
    tools: [
      "Locking pin -3359- (camshaft/hub lock)",
      "Pin wrench -T10020- or hexagon wrench (tensioner)",
      "Locking pin -T10115- (tensioner lock)",
      "Crankshaft stop -T10050- (round pulley) or -T10100- (oval pulley)",
      "Counterhold -T10172- with pins -T10172/4- (camshaft pulley)",
      "Torque wrench V.A.G 1331 (5–50 Nm)",
      "Torque wrench V.A.G 1332 (40–200 Nm)",
      "Socket set, coolant drain pan",
    ],
    warnings: [
      "NEVER rotate engine backwards (anti-clockwise) — workshop manual specifies engine direction of rotation only.",
      "Always use official locking tools — the timing procedure requires all three locking pins simultaneously.",
      "Replace water pump at same time — belt-driven, same labour cost, catastrophic if it fails after belt change.",
      "Adjustment work on toothed belts must be performed ONLY on cold engines — tension indicator position changes with temperature.",
      "This job requires the VW workshop manual procedure. Do not attempt without proper reference.",
    ],
    steps: [
      "Determine which engine support type is fitted — close to engine (remove support required) or further away (newer type, support removal not necessary).",
      "Remove engine cover (pull abruptly upwards at front, then pull forwards). Disconnect battery negative.",
      "Remove poly V-belt, upper toothed belt guard (release retaining clips), and front right wheel.",
      "Rotate crankshaft in engine direction of rotation until TDC No. 1 cylinder. Marking on crankshaft pulley and tooth segment of camshaft pulley must be on top.",
      "Lock camshaft hub with locking pin -3359- (slide through elongated hole on left into hole in cylinder head).",
      "Lock crankshaft toothed belt pulley with crankshaft stop -T10050- or -T10100- (push into teeth from face side).",
      "Lock tensioner roller with locking pin -T10115- and secure to right stop.",
      "Turn pin wrench -T10020- clockwise to stop and tighten securing nut hand tight. Remove belt from coolant pump first, then remaining pulleys.",
      "Replace water pump and idler roller. Fit new tensioner — do not fully tighten yet.",
      "Fit new toothed belt in direction of rotation. Route per workshop manual diagram.",
      "Fit counterhold -T10172- with pins. Press counterhold in direction of arrow, keeping camshaft pulley under tension. Tighten camshaft pulley securing bolts to 25 Nm.",
      "Remove locking pin -3359- and crankshaft stop. Turn crankshaft two full rotations in engine direction of rotation until just before TDC No. 1.",
      "Relock hub with -3359- and recheck crankshaft stop alignment. If not aligned, readjust camshaft pulley position.",
      "Remove all locking tools. Refit toothed belt guards, poly V-belt, wheel. Reconnect battery, bleed coolant system.",
      "Check cylinder head cover bolt torque (10 Nm in sequence 1–13 for BKC).",
    ],
    torqueSpecRefs: [
      "Timing belt tensioner roller nut",
      "Timing belt idler roller bolt",
      "Camshaft sprocket bolt",
      "Crankshaft pulley (vibration damper) bolt",
    ],
  },
  {
    id: "swirl-flap-delete",
    title: "Swirl flap delete / repair",
    category: "engine",
    difficulty: "moderate",
    estimatedTime: "2–3 hours",
    overview:
      "The BKC intake manifold swirl flap shaft is a known design flaw — the plastic shaft shears and the flap can enter the engine. P1666 fault code. The permanent fix is a swirl flap delete kit (blanking plugs) or an uprated manifold. Do not ignore this fault.",
    tools: [
      "10mm socket and extension",
      "T25 Torx bit",
      "Swirl flap delete kit (blanking plugs for BKC — 4 plugs required)",
      "Inspection camera (recommended)",
      "Intake manifold gasket",
    ],
    warnings: [
      "CRITICAL: If a swirl flap has already broken, inspect for fragments in intake before starting engine.",
      "Use a camera to check all 4 ports for loose material before reassembly.",
      "Only use BKC-specific delete blanks — incorrect size will not seal properly.",
      "After delete, a P1666 code will remain stored but is harmless — no functionality is lost.",
    ],
    steps: [
      "Remove engine cover and air filter housing to access intake manifold.",
      "Disconnect all vacuum hoses, breather pipes, and electrical connectors from manifold.",
      "Remove manifold bolts (22 Nm — VW workshop manual spec for BKC intake manifold). Manifold is large — have assistance.",
      "With manifold removed, inspect all 4 swirl flap ports with camera for broken pieces.",
      "If flaps are broken, retrieve all fragments before proceeding.",
      "Remove old swirl flap assembly from manifold ports.",
      "Press or tap in delete blanking plugs — ensure fully seated and sealed.",
      "Refit manifold with new gasket. Torque bolts to 22 Nm evenly.",
      "Reconnect all hoses and connectors.",
      "Clear fault codes after reassembly.",
    ],
    torqueSpecRefs: [],
  },
  {
    id: "fuel-filter",
    title: "Fuel filter replacement",
    category: "engine",
    difficulty: "easy",
    estimatedTime: "20–30 min",
    overview:
      "The BKC fuel filter should be replaced every 30,000 km. A clogged filter restricts fuel flow to the high-pressure pump, causing P0087 (low fuel rail pressure) and rough running. On the Golf 5, the filter is under the car near the fuel tank.",
    tools: [
      "Fuel line quick-release clips (filter-specific)",
      "Pliers",
      "Drain pan",
      "Gloves — diesel will spill",
    ],
    warnings: [
      "Depressurise fuel system: remove fuel pump fuse and crank engine until it stalls before disconnecting lines.",
      "Diesel is flammable — no naked flames, do not smoke.",
      "Note fuel flow direction arrow on new filter — fit in correct direction.",
    ],
    steps: [
      "Remove fuel pump fuse (check fuse box diagram). Crank engine until it stalls to depressurise.",
      "Raise rear of car safely on axle stands.",
      "Locate filter under car near nearside rear wheel.",
      "Place drain pan beneath filter.",
      "Release quick-connect clips on both fuel lines and disconnect.",
      "Unscrew filter from bracket.",
      "Fit new filter — note direction of flow arrow on housing.",
      "Reconnect fuel lines — click until they lock.",
      "Refit fuel pump fuse. Prime system by cycling ignition on/off 3 times without cranking.",
      "Start engine and check for leaks.",
    ],
    torqueSpecRefs: [],
  },
  {
    id: "glow-plugs",
    title: "Glow plug replacement",
    category: "engine",
    difficulty: "moderate",
    estimatedTime: "1–2 hours",
    overview:
      "The BKC uses 4.4V glow plugs (NOT 11V). Using the wrong voltage will destroy the plugs instantly. Inspect and test at 100,000 km. Symptoms of failure: hard cold starting, white smoke on cold start, P0380 fault code.",
    tools: [
      "10mm glow plug socket (long reach)",
      "Torque wrench",
      "WD-40 or penetrating fluid",
      "Multimeter (to test plugs)",
    ],
    warnings: [
      "CRITICAL: Only fit correct voltage glow plugs for BKC. BKC may have metal OR ceramic plugs depending on build date — check visually before ordering. Ceramic plugs have a support tube, are not colour-coded.",
      "Ceramic glow plugs are extremely fragile — if dropped from even 2 cm, discard and use a new one. Even undamaged-looking ceramic plugs must be replaced if dropped.",
      "Do NOT oil or grease threads of ceramic glow plugs or cylinder head bore.",
      "Soak with penetrating fluid the night before if plugs haven't been removed before.",
      "If a ceramic glow plug breaks, remove ALL fragments before starting engine — fragments cause engine damage.",
    ],
    steps: [
      "Allow engine to cool completely (test prerequisite: engine cold for ceramic plugs).",
      "Disconnect battery negative. Pull off central connector for unit injectors.",
      "Remove engine cover. Pull connectors off glow plugs.",
      "Spray penetrating fluid around each plug base. Wait 15–30 minutes.",
      "Remove plugs using U/J extension and socket -3220- (10mm). Apply steady pressure — do not cant ceramic plugs.",
      "Before installing: thoroughly clean drilling in cylinder head and threads of all deposits.",
      "Do not oil or grease threads. Screw new glow plugs in by hand using -3220-.",
      "Tighten glow plugs to 15 Nm (official VW specified torque, Rep. gr. 28).",
      "For ceramic plugs: after installing, perform resistance test on all plugs when cold. Specification: max 1 Ω. Replace any exceeding spec.",
      "Reconnect glow plug connectors and central injector connector. Read and clear fault memory.",
      "Refit engine cover.",
    ],
    torqueSpecRefs: [],
  },
  {
    id: "front-brakes",
    title: "Front brake pads & discs",
    category: "brakes",
    difficulty: "easy",
    estimatedTime: "1–1.5 hours per side",
    overview:
      "Standard brake service on the Golf 5. Front brakes take most of the braking force. Replace pads when worn to 3mm or less. Replace discs if below minimum thickness or heavily scored.",
    tools: [
      "19mm socket (wheel bolts)",
      "13mm socket (caliper guide pins)",
      "Brake piston wind-back tool or G-clamp",
      "Torque wrench",
      "Brake cleaner spray",
      "Copper grease (for pad backs only — not on disc or friction surface)",
    ],
    warnings: [
      "Never get grease or brake fluid on disc or pad friction surfaces.",
      "Pump brake pedal several times before moving car after reassembly.",
      "Bed in new pads with 10x progressive stops from 50 km/h — avoid hard braking for first 200 km.",
    ],
    steps: [
      "Loosen wheel bolts slightly before jacking. Jack car and support on axle stand.",
      "Remove wheel. Inspect disc and pad thickness before proceeding.",
      "Remove caliper guide pin bolts (13mm). Slide caliper off disc — hang from suspension spring with wire, do not let it hang by brake hose.",
      "Remove old brake pads from caliper carrier.",
      "Wind caliper piston back in fully using wind-back tool (front is straight push-back, not wind).",
      "Clean caliper carrier with brake cleaner. Apply thin copper grease to pad contact shims only.",
      "Fit new pads into carrier.",
      "Refit caliper and torque guide pin bolts.",
      "Refit carrier bolts and torque to spec.",
      "Refit wheel and torque bolts to 120 Nm.",
      "Pump brake pedal until firm before moving car.",
    ],
    torqueSpecRefs: [
      "Brake caliper guide pin bolt (front)",
      "Brake caliper carrier bolt (front)",
      "Wheel bolts",
    ],
  },
  {
    id: "rear-brakes",
    title: "Rear brake pads & discs",
    category: "brakes",
    difficulty: "moderate",
    estimatedTime: "1–2 hours per side",
    overview:
      "The Golf 5 rear calipers have a wind-back piston (not push-back like the front). The piston must be rotated clockwise while pushing in — a standard G-clamp will not work. A wind-back tool is required.",
    tools: [
      "19mm socket (wheel bolts)",
      "Brake caliper wind-back tool (rotating type)",
      "7mm Allen key (rear caliper guide pins)",
      "Torque wrench",
      "Brake cleaner",
    ],
    warnings: [
      "Rear pistons MUST be wound back clockwise — do not push straight in, it will damage the piston.",
      "Apply the handbrake before starting. Release it to retract rear calipers.",
      "On cars with electronic parking brake: put into service mode via VCDS before compressing piston.",
    ],
    steps: [
      "Release handbrake fully. Loosen wheel bolts, jack car and support.",
      "Remove wheel. Remove rear caliper guide pin bolts (7mm Allen).",
      "Slide caliper off disc. Hang from suspension — do not hang by hose.",
      "Remove old pads. Note orientation of wear indicators.",
      "Using wind-back tool, rotate piston clockwise while applying inward pressure until fully retracted.",
      "Clean caliper carrier. Apply copper grease to shims only.",
      "Fit new pads. Ensure pad with wear indicator is on inner position.",
      "Refit caliper and torque guide pin bolts.",
      "Refit wheel and torque bolts to 120 Nm.",
      "Pump brake pedal to firm before moving.",
    ],
    torqueSpecRefs: [
      "Brake caliper guide pin bolt (rear)",
      "Brake caliper carrier bolt (rear)",
      "Wheel bolts",
    ],
  },
  {
    id: "coolant-flush",
    title: "Coolant flush & refill",
    category: "fluids",
    difficulty: "easy",
    estimatedTime: "1 hour + cooling time",
    overview:
      "The BKC uses G12+ or G12++ coolant (pink/red). Never mix with green coolant — it causes a chemical reaction that damages the cooling system. Change interval: every 4 years regardless of mileage.",
    tools: [
      "Drain pan (10L+)",
      "Funnel",
      "G12+ or G12++ coolant concentrate",
      "Distilled water",
    ],
    warnings: [
      "Only use G12+ or G12++ (pink/red). NEVER mix with green/blue conventional coolant.",
      "Mix 50/50 with distilled water — not tap water, which causes scale deposits.",
      "Bleed cooling system carefully — air locks cause overheating.",
      "Coolant is toxic to animals — dispose of properly, do not pour down drain.",
    ],
    steps: [
      "Allow engine to cool completely before opening any coolant connections.",
      "Place drain pan under radiator drain plug or lower hose.",
      "Open expansion tank cap slowly to release pressure.",
      "Open radiator drain or disconnect lower hose. Allow full drain.",
      "Flush system with distilled water if coolant is heavily contaminated.",
      "Close drain/reconnect lower hose.",
      "Mix G12+ coolant 50/50 with distilled water.",
      "Fill expansion tank to MAX mark.",
      "Run engine with heater on max and expansion tank cap off.",
      "Watch for air bubbles escaping at tank. Top up as needed.",
      "Once no more bubbles, fit cap. Check level when cold after first drive.",
    ],
    torqueSpecRefs: [],
  },
  {
    id: "battery-replacement",
    title: "Battery replacement",
    category: "electrical",
    difficulty: "easy",
    estimatedTime: "20–30 min",
    overview:
      "The Golf 5 battery is in the engine compartment under a plastic cover. After disconnecting and reconnecting the battery, several systems need recalibration. Source: VW Workshop Manual Golf 2004, Electrical system Rep. gr. 27.",
    tools: [
      "10mm socket (battery terminal clamps)",
      "Torque wrench",
      "Replacement battery (check CCA rating — diesel engines need high CCA)",
    ],
    warnings: [
      "Disconnect earth (negative) terminal FIRST when disconnecting, connect it LAST when reconnecting.",
      "After reconnecting battery: ESP/TCS warning lamp will illuminate — this is normal. Drive straight at 15–20 km/h to recalibrate steering angle sender G85.",
      "Open all electric windows fully and close again after reconnecting — window one-touch function needs reset.",
      "Check if car has a coded radio — obtain code before disconnecting battery.",
      "Battery venting hose must not be kinked or blocked — battery gases are hazardous and explosive.",
    ],
    steps: [
      "Switch off ignition and all electrical consumers. Note radio code if fitted.",
      "Release catch and take cover off battery box.",
      "First disconnect battery earth terminal clamp (negative, black) from battery negative terminal.",
      "Then unbolt battery positive terminal clamp.",
      "Unscrew securing bolt and remove securing bracket.",
      "Fold up handles and remove battery.",
      "Fit new battery. Ensure it is seated securely — a loose battery causes vibration damage and poor crash safety.",
      "Connect positive terminal first, then earth terminal clamp (negative). Tighten to specified torque.",
      "After connecting: switch ignition on then off again. Read event memory with diagnostic tester.",
      "Drive at 15–20 km/h in a straight line to extinguish ESP/TCS warning lamp and recalibrate steering angle sender.",
      "Open all electric windows fully and close again. Check all electrical consumers.",
    ],
    torqueSpecRefs: [],
  },
  {
    id: "egr-clean",
    title: "EGR valve clean",
    category: "engine",
    difficulty: "moderate",
    estimatedTime: "1–2 hours",
    overview:
      "The BKC EGR valve clogs with carbon deposits regularly, causing P0401. The BKC uses an electric-pneumatic EGR system (valve -N18- in solenoid valve block activates a mechanical EGR valve). Cleaning is usually sufficient before replacing. Source: VW Workshop Manual Rep. gr. 26.",
    tools: [
      "T25 Torx bit",
      "10mm socket",
      "Hand vacuum pump -V.A.G 1390- (for testing)",
      "Carburettor cleaner spray",
      "Old toothbrush or wire brush",
      "Rags, gloves, eye protection",
    ],
    warnings: [
      "Allow engine to cool completely before removing EGR valve.",
      "EGR gases contain soot and carcinogens — wear gloves and work in ventilated area.",
      "Renew self-locking nuts when refitting (VW workshop manual requirement).",
      "Inspect EGR cooler passages while valve is off — blockage there requires cooler replacement.",
    ],
    steps: [
      "Disconnect battery negative.",
      "Locate EGR valve on intake manifold (upper left of engine when viewed from front).",
      "Disconnect electrical connector and vacuum hose from EGR valve.",
      "Remove 3x T25 Torx bolts holding valve to manifold.",
      "Remove valve. Expect heavy carbon deposits on valve plate and bore.",
      "Test EGR valve diaphragm: connect hand vacuum pump -V.A.G 1390- to valve, operate a few times, then pull hose off — diaphragm rod must audibly return to original position.",
      "Spray carburettor cleaner liberally into valve. Use toothbrush to scrub carbon.",
      "Manually operate valve plate to ensure it moves freely when clean.",
      "Clean mating face on intake manifold.",
      "Refit with new gasket and NEW self-locking nuts. Torque to 10 Nm.",
      "Reconnect connector and vacuum hose.",
      "Clear P0401 fault code with OBD2 scanner after reassembly.",
    ],
    torqueSpecRefs: ["EGR valve to intake manifold"],
  },
]

export function searchGuides(query: string): RepairGuide[] {
  const q = query.toLowerCase().trim()
  if (!q) return BKC_REPAIR_GUIDES
  return BKC_REPAIR_GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.overview.toLowerCase().includes(q) ||
      g.category.includes(q) ||
      g.steps.some((s) => s.toLowerCase().includes(q)) ||
      g.tools.some((t) => t.toLowerCase().includes(q))
  )
}
