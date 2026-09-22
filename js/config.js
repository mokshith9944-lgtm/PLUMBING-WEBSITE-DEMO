/**
 * Centralized Business Configuration — United Kingdom
 * Valvoro-inspired professional UK plumbing & heating business configuration.
 */
const SITE_CONFIG = {
  // Business Identity (UK)
  COMPANY_NAME: "[COMPANY_NAME]", // e.g. "Valvoro Plumbing & Heating UK"
  TAGLINE: "Trusted, Certified UK Plumbers & Heating Engineers",
  PHONE_NUMBER: "[PHONE_NUMBER]", // e.g. "0800 012 3456" or "020 7946 0192"
  PHONE_RAW: "[PHONE_NUMBER]", // tel format, e.g. "+448000123456"
  WHATSAPP_NUMBER: "[WHATSAPP_NUMBER]", // e.g. "447700900123"
  EMAIL: "enquiries@[company].co.uk",
  CURRENCY: "£",
  COUNTRY: "UK",
  
  // Location & UK Postcode Coverage
  CITY: "[CITY]", // e.g. "London & Surrounding Counties"
  SERVICE_AREAS: [
    { name: "[CITY / CENTRAL]", note: "Central Postcodes (EC1, WC1, W1, SW1)", available: true },
    { name: "[AREA 1 / NORTH]", note: "North Districts (N1, NW3, EN1)", available: true },
    { name: "[AREA 2 / WEST]", note: "West & Thames Valley (W2, W6, TW1)", available: true },
    { name: "[AREA 3 / SOUTH]", note: "South Districts (SE1, SW4, CR0)", available: true },
    { name: "[AREA 4 / EAST]", note: "East & Docklands (E1, E14, IG1)", available: true }
  ],
  
  // Operational Details (UK Working Hours & 24/7 On-Call)
  BUSINESS_HOURS: {
    weekdays: "07:30 – 19:00",
    saturday: "08:00 – 17:00",
    sunday: "Emergency Callouts Only",
    emergency: "24/7 Emergency Plumber Service Across UK"
  },
  
  EMERGENCY_AVAILABILITY: true,
  EMERGENCY_PHONE_NOTE: "For burst mains, severe water leaks, or boiler breakdowns, please call our emergency dispatch desk immediately.",

  // UK Standard Available Services
  SERVICES: [
    {
      id: "emergency-plumbing",
      title: "Emergency Plumber",
      icon: "🚨",
      badge: "24/7 UK Dispatch",
      shortDesc: "Rapid response for burst pipes, active flooding, and urgent water isolation.",
      description: "When an emergency strikes, every minute matters. Our fully qualified UK emergency plumbers arrive in stocked vans to isolate internal stopcocks, halt flooding, and repair damaged pipework safely.",
      commonSigns: [
        "Uncontrollable water pouring from ceilings or floorboards",
        "Burst mains supply pipe or frozen external pipework",
        "Sewage or waste backing up into bath or sinks",
        "Major internal stopcock failure"
      ],
      whatPlumberDoes: [
        "Immediate stopcock isolation and flood control",
        "Emergency pipe replacement and compression jointing",
        "Safety pressure testing and drainage clearance",
        "Assistance with insurance damage reporting"
      ],
      urgency: "Immediate / ASAP",
      recommendedUrgencyValue: "emergency"
    },
    {
      id: "boiler-heating",
      title: "Boiler & Central Heating",
      icon: "🔥",
      badge: "Heating Specialists",
      shortDesc: "Boiler breakdown repairs, radiator bleeding, thermostat faults, and heating repairs.",
      description: "Keep your home warm through the British winter. We troubleshoot combi boilers, system boilers, diverter valves, circulating pumps, and low pressure error codes with certified Gas Safe expertise.",
      commonSigns: [
        "No heating or hot water despite boiler running",
        "Boiler displaying fault code (e.g. F22, EA, E119)",
        "Radiators cold at the bottom or cold at the top",
        "Banging or kettling noises from the heat exchanger"
      ],
      whatPlumberDoes: [
        "Diagnostic inspection of boiler pressure and PCB electronics",
        "Motorised diverter valve and pump replacement",
        "Radiator valve repair and thermostatic valve (TRV) upgrades",
        "Annual boiler servicing and system efficiency checks"
      ],
      urgency: "Today or Tomorrow",
      recommendedUrgencyValue: "today"
    },
    {
      id: "leak-repair",
      title: "Leak Detection & Repair",
      icon: "💧",
      badge: "Trace & Access",
      shortDesc: "Non-destructive acoustic and thermal leak detection for hidden pipes.",
      description: "Concealed leaks behind plasterboard or under floorboards can cause damp, rot, and rising water bills. Our non-invasive acoustic sensors and thermal cameras pinpoint leaks without destroying walls.",
      commonSigns: [
        "Damp patches on ceilings, walls, or warped floorboards",
        "Continuous water meter spinning when all taps are off",
        "Low boiler pressure dropping repeatedly",
        "Musty damp smell in bathrooms or under sinks"
      ],
      whatPlumberDoes: [
        "Acoustic pipe tracing and thermal imaging surveys",
        "Precision cut-and-replace copper or barrier pipe repair",
        "Hydrostatic pressure testing to guarantee zero loss",
        "Detailed Trace & Access reports for home insurance"
      ],
      urgency: "Today or Tomorrow",
      recommendedUrgencyValue: "today"
    },
    {
      id: "drain-cleaning",
      title: "Blocked Drains & Pipes",
      icon: "🌀",
      badge: "High-Pressure Jetting",
      shortDesc: "Clearing stubborn blockages, gullies, soil stacks, and external inspection chambers.",
      description: "From slow-draining kitchen waste pipes to external gullies overflowing with fats and silt, our high-pressure electro-mechanical rotary machines and CCTV drain cameras clear blockages cleanly.",
      commonSigns: [
        "Gurgling sounds from plugholes and toilet basins",
        "Unpleasant sewage odors from internal or external drains",
        "Water rising high in the toilet bowl when flushed",
        "Standing water in driveways or outdoor drain gullies"
      ],
      whatPlumberDoes: [
        "High-pressure water jetting to descale fat and scale",
        "Motorised snake clearance of internal waste pipes",
        "CCTV camera surveys to inspect pipe integrity",
        "Tree root clearance and drainage relining"
      ],
      urgency: "Today or Tomorrow",
      recommendedUrgencyValue: "today"
    },
    {
      id: "toilet-repair",
      title: "Toilet & Cistern Repair",
      icon: "🚽",
      badge: "Same-Day Service",
      shortDesc: "Fixing running siphons, push-button valves, inlet leaks, and new toilet installs.",
      description: "A constantly trickling dual-flush toilet can waste up to 400 litres of metered water every day. We service push-button mechanisms, ballvalves, doughnut gaskets, and fit modern rimless toilets.",
      commonSigns: [
        "Water running continuously into the toilet pan",
        "Push-button or lever flush fails to trigger siphon",
        "Water pooling around the base pan or floor tiles",
        "Slow-filling cistern with loud hissing sounds"
      ],
      whatPlumberDoes: [
        "Dual-flush valve and inlet diaphragm replacement",
        "Close-coupled cistern resealing and doughnut gasket renewal",
        "Unblocking choked toilet traps with heavy-duty augers",
        "Complete installation of modern water-saving suites"
      ],
      urgency: "Today",
      recommendedUrgencyValue: "today"
    },
    {
      id: "hot-water-cylinder",
      title: "Hot Water Cylinders",
      icon: "🚰",
      badge: "Vented & Unvented",
      shortDesc: "Repairs for Megaflo unvented cylinders, immersion heaters, and pressure relief valves.",
      description: "Whether you have a traditional vented gravity cylinder with cold header tank or a pressurised unvented Megaflo cylinder, our G3-certified plumbers service immersion elements, thermostats, and expansion vessels.",
      commonSigns: [
        "Complete loss of hot water or lukewarm showers",
        "Water discharging from external tundish overflow pipe",
        "Dripping temperature and pressure relief valves",
        "Tripping fuseboard when immersion heater switched on"
      ],
      whatPlumberDoes: [
        "Dual immersion heater element and thermostat replacement",
        "Expansion vessel pressure recharging and diaphragm check",
        "G3 unvented safety relief valve compliance testing",
        "Upgrades to high-efficiency stainless steel cylinders"
      ],
      urgency: "Today or Tomorrow",
      recommendedUrgencyValue: "today"
    },
    {
      id: "taps-showers",
      title: "Taps & Shower Plumbing",
      icon: "🚿",
      badge: "Drip-Free Guarantee",
      shortDesc: "Repairing dripping mixer taps, thermostatic shower valves, and cartridge changes.",
      description: "Fix annoying drips, sudden temperature spikes, or low flow. We replace ceramic disc cartridges, fit modern pull-out kitchen mixer taps, and install thermostatic bar showers that protect from scalding.",
      commonSigns: [
        "Constant drip from bathroom or kitchen mixer tap",
        "Shower fluctuates between boiling hot and ice cold",
        "Stiff or seized tap handles that won't turn off completely",
        "Low flow rate from mixer heads"
      ],
      whatPlumberDoes: [
        "Ceramic disc valve cartridge replacement",
        "Thermostatic shower cartridge descaling or renewal",
        "Tap reseating and flexible hose connection upgrades",
        "Installation of luxury digital and mixer showers"
      ],
      urgency: "Within 2–3 Days",
      recommendedUrgencyValue: "2-3-days"
    },
    {
      id: "pipe-repair",
      title: "Pipework & Stopcocks",
      icon: "🔧",
      badge: "Burst Prevention",
      shortDesc: "Replacing lead pipes, stiff main stopcocks, copper pinholes, and barrier pipes.",
      description: "Ensure your home's water supply is secure and clean. We replace seized brass stopcocks with easy-turn quarter-turn lever valves, remove historical lead piping, and fix noisy water hammer pipes.",
      commonSigns: [
        "Main stopcock is seized and will not shut off water",
        "Pinhole corrosion leaks on copper pipe runs",
        "Loud banging noises (water hammer) when taps shut",
        "Historic lead supply pipes in older UK properties"
      ],
      whatPlumberDoes: [
        "Installation of modern quarter-turn brass lever stopcocks",
        "Copper and multi-layer barrier pipe sectional replacement",
        "Water hammer arrestor fitting to absorb pressure shocks",
        "Lead supply pipe replacement up to boundary box"
      ],
      urgency: "Within 2–3 Days",
      recommendedUrgencyValue: "2-3-days"
    },
    {
      id: "radiators-powerflushing",
      title: "Radiators & Power Flushing",
      icon: "🌡️",
      badge: "Heat Efficiency",
      shortDesc: "Power flushing central heating circuits, fixing cold spots, and fitting new radiators.",
      description: "Sludge and black magnetite iron oxide in your radiators can raise heating bills by up to 25%. Our magnetic power flush removes sludge to restore blistering hot radiators throughout your home.",
      commonSigns: [
        "Radiators cold at the bottom and warm at the top",
        "Black or brown sludge when bleeding radiators",
        "Noisy central heating boiler or pump strain",
        "Rooms failing to reach set thermostat temperature"
      ],
      whatPlumberDoes: [
        "High-flow magnetic chemical power flush",
        "Installation of magnetic central heating system filter",
        "Thermostatic radiator valve (TRV) replacements",
        "Designer column and towel radiator fitting"
      ],
      urgency: "This Week",
      recommendedUrgencyValue: "this-week"
    },
    {
      id: "bathroom-kitchen",
      title: "Bathroom & Kitchen Plumbing",
      icon: "🛁",
      badge: "Fit & Install",
      shortDesc: "Washing machine feeds, dishwasher waste loops, waste disposals, and basin installs.",
      description: "From plumbing in new American fridge freezers and washing machines to complete bathroom sanitaryware rough-in, our plumbers ensure all trapwork and waste connections are watertight.",
      commonSigns: [
        "Leak underneath kitchen plinths when appliances run",
        "Waste pipe gurgling into adjoining basins",
        "Need new plumbing connections for dishwasher or washer",
        "Upgrading bathroom sanitaryware"
      ],
      whatPlumberDoes: [
        "Appliance isolation valves and non-return double check valves",
        "Solvent-weld waste pipe re-routing and trap connections",
        "Basin waste clicker and bottle trap replacements",
        "Complete second-fix bathroom fitting"
      ],
      urgency: "This Week",
      recommendedUrgencyValue: "this-week"
    },
    {
      id: "other",
      title: "Get a Custom Quote",
      icon: "💬",
      badge: "Free Consultation",
      shortDesc: "Gas safety certificates (CP12), commercial installations, and custom plumbing.",
      description: "Landlord safety checks, commercial facility maintenance, water softeners, or tailored installations. Get in touch with our team for a free, transparent estimate in GBP (£).",
      commonSigns: [
        "Landlord gas safety certificate (CP12) required",
        "Water softener or whole-house scale prevention",
        "Commercial washroom refurbishment",
        "Unlisted bespoke domestic plumbing works"
      ],
      whatPlumberDoes: [
        "On-site survey and written estimate in GBP (£)",
        "Water hardness testing and filter sizing",
        "Landlord compliance documentation",
        "Transparent itemised quotes with no hidden fees"
      ],
      urgency: "Flexible / Get a Quote",
      recommendedUrgencyValue: "quote"
    }
  ],

  // Booking Time Slots Configuration (UK Friendly)
  BOOKING_SLOTS: [
    { id: "slot-0800", time: "08:00 AM", period: "Morning (08:00 – 12:00)", available: true },
    { id: "slot-1000", time: "10:00 AM", period: "Morning (10:00 – 13:00)", available: true },
    { id: "slot-1200", time: "12:00 PM", period: "Midday (12:00 – 14:00)", available: true },
    { id: "slot-1400", time: "02:00 PM", period: "Afternoon (14:00 – 17:00)", available: true },
    { id: "slot-1600", time: "04:00 PM", period: "Late Afternoon (16:00 – 18:30)", available: false }, // example booked slot
    { id: "slot-1800", time: "06:00 PM", period: "Evening Window", available: true }
  ],

  // Urgency Levels (UK Format)
  URGENCY_LEVELS: [
    { id: "emergency", label: "🚨 Emergency — ASAP (UK On-Call Dispatch)", note: "Rapid arrival for burst pipes & flooding", isEmergency: true },
    { id: "today", label: "⚡ Today", note: "Same-day service window", isEmergency: false },
    { id: "tomorrow", label: "📅 Tomorrow", note: "Priority next-day booking", isEmergency: false },
    { id: "2-3-days", label: "🗓️ Within 2–3 Days", note: "Standard scheduled appointment", isEmergency: false },
    { id: "this-week", label: "📆 This Week", note: "Convenient scheduled date", isEmergency: false },
    { id: "quote", label: "💬 Get a Quote (No immediate visit required)", note: "Free written estimate in GBP (£)", isEmergency: false }
  ]
};

// Freeze config to prevent accidental runtime mutation
if (typeof Object.freeze === 'function') {
  Object.freeze(SITE_CONFIG);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
