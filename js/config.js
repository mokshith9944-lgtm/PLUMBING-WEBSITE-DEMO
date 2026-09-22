/**
 * Centralized Business Configuration
 * Easily adjust these settings to rebrand or modify business details.
 */
const SITE_CONFIG = {
  // Business Identity
  COMPANY_NAME: "[COMPANY_NAME]", // e.g. "Apex Plumbing & Drain Solutions"
  TAGLINE: "Fast, Reliable & Licensed Plumbing Services",
  PHONE_NUMBER: "[PHONE_NUMBER]", // e.g. "+1 (555) 234-5678"
  PHONE_RAW: "[PHONE_NUMBER]", // tel: link format, e.g. "+15552345678"
  WHATSAPP_NUMBER: "[WHATSAPP_NUMBER]", // e.g. "15552345678"
  EMAIL: "contact@[company].com",
  
  // Location & Coverage
  CITY: "[CITY]", // e.g. "Metro Area"
  SERVICE_AREAS: [
    { name: "[CITY]", note: "Central & Downtown", available: true },
    { name: "[AREA 1]", note: "North District & Suburbs", available: true },
    { name: "[AREA 2]", note: "West Metro & Hills", available: true },
    { name: "[AREA 3]", note: "East Valley & Residential", available: true },
    { name: "[AREA 4]", note: "South County & Industrial", available: true }
  ],
  
  // Operational Details
  BUSINESS_HOURS: {
    weekdays: "7:00 AM – 7:00 PM",
    saturday: "8:00 AM – 5:00 PM",
    sunday: "Emergency Calls Only",
    emergency: "24/7 On-Call Emergency Service"
  },
  
  EMERGENCY_AVAILABILITY: true,
  EMERGENCY_PHONE_NOTE: "For burst pipes, major flooding, or severe gas leaks, please call immediately.",

  // Standard Available Services
  SERVICES: [
    {
      id: "emergency-plumbing",
      title: "Emergency Plumbing",
      icon: "🚨",
      badge: "24/7 Available",
      shortDesc: "Rapid response for burst pipes, severe flooding, and urgent water issues.",
      description: "When disaster strikes, every minute counts. Our emergency plumbing technicians are dispatched with fully equipped vans to quickly isolate leaks, stop flooding, and prevent costly structural damage to your home or business.",
      commonSigns: [
        "Uncontrollable water pouring from ceiling or walls",
        "Burst or frozen supply pipes",
        "Sewage backing up into tubs or sinks",
        "Strong smell of natural gas or sulfur"
      ],
      whatPlumberDoes: [
        "Rapid diagnostic and immediate supply isolation",
        "High-pressure pipe repair or replacement",
        "Safe extraction support and leak sealing",
        "System pressure and safety testing"
      ],
      urgency: "Immediate / ASAP",
      recommendedUrgencyValue: "emergency"
    },
    {
      id: "leak-repair",
      title: "Leak Detection & Repair",
      icon: "💧",
      badge: "Water Saving",
      shortDesc: "Precision acoustic leak detection and long-lasting pipe and fixture repair.",
      description: "Hidden leaks can waste thousands of gallons of water and cause silent structural decay or mold growth. We locate invisible leaks behind drywall, beneath slabs, and inside ceilings without destructive demolition.",
      commonSigns: [
        "Unexplained spikes in water utility bills",
        "Damp spots, discoloration, or warm spots on floors or walls",
        "Running water sounds when all taps are closed",
        "Musty odors in bathrooms, basements, or crawlspaces"
      ],
      whatPlumberDoes: [
        "Non-invasive electronic acoustic leak detection",
        "Thermal imaging scan of plumbing pathways",
        "Durable copper, PEX, or PVC line replacement",
        "Post-repair hydrostatic pressure testing"
      ],
      urgency: "Today or Within 24-48 Hours",
      recommendedUrgencyValue: "today"
    },
    {
      id: "drain-cleaning",
      title: "Drain Cleaning & Unblocking",
      icon: "🌀",
      badge: "High Demand",
      shortDesc: "Clearing stubborn clogs, tree roots, and buildup from sinks, showers, and main lines.",
      description: "From slow-draining kitchen sinks clogged with grease to main sewer lines invaded by tree roots, our hydro-jetting and motorized snaking equipment restore full pipe diameter quickly and cleanly.",
      commonSigns: [
        "Standing water in shower basin or bathtub",
        "Gurgling sounds from drains or toilets",
        "Foul, sulfurous odors emerging from sink outlets",
        "Water backing up into other fixtures when using appliances"
      ],
      whatPlumberDoes: [
        "CCTV camera pipe inspection to locate exact obstruction",
        "Commercial motorized snaking & mechanical root cutting",
        "Hydro-jetting to flush grease, sludge, and scale build-up",
        "Preventive drain enzyme recommendations"
      ],
      urgency: "Today or 1-2 Days",
      recommendedUrgencyValue: "today"
    },
    {
      id: "toilet-repair",
      title: "Toilet Repair & Replacement",
      icon: "🚽",
      badge: "Same-Day Service",
      shortDesc: "Fixing running flappers, persistent blockages, leaks, and complete toilet installs.",
      description: "A constantly running or poorly flushing toilet can waste up to 200 gallons of water per day. We service all makes and models, replacing worn fill valves, flappers, wax seals, and installing high-efficiency units.",
      commonSigns: [
        "Water trickling constantly into the bowl",
        "Toilet won't flush or requires holding handle down",
        "Water pooling around the base on the floor",
        "Weak flush or overflowing after flushing"
      ],
      whatPlumberDoes: [
        "Rebuild flush valves, fill valves, and flapper assemblies",
        "Replace damaged wax rings and secure loose toilet bases",
        "Auger deep mechanical trap clogs",
        "Complete installation of dual-flush, water-saving toilets"
      ],
      urgency: "Today",
      recommendedUrgencyValue: "today"
    },
    {
      id: "water-heater",
      title: "Water Heater Repair & Install",
      icon: "🔥",
      badge: "Tank & Tankless",
      shortDesc: "Restoring consistent hot water, thermostat checks, anode rods, and new installations.",
      description: "Whether you have a traditional storage tank heater or an on-demand tankless unit, our certified technicians troubleshoot heating elements, burner assemblies, thermostats, and venting systems safely.",
      commonSigns: [
        "Water runs cold after only a few minutes",
        "Rust-colored or metallic-tasting hot water",
        "Popping, rumbling, or banging sounds from the tank",
        "Water pooling in the heater drip pan or base"
      ],
      whatPlumberDoes: [
        "Electric heating element & thermostat diagnostics",
        "Gas thermocouple, pilot, and control valve inspection",
        "Tank sediment flushing and sacrificial anode replacement",
        "New energy-efficient unit sizing and installation"
      ],
      urgency: "Today / 1-2 Days",
      recommendedUrgencyValue: "today"
    },
    {
      id: "pipe-repair",
      title: "Pipe Repair & Repiping",
      icon: "🔧",
      badge: "Durable Fix",
      shortDesc: "Corrosion treatment, burst sections, pinhole leaks, and whole-house repiping.",
      description: "Aging galvanized iron or compromised copper pipes can cause rusty water, low pressure, and persistent pinhole leaks. We offer targeted sectional replacements as well as complete, minimally invasive PEX repiping.",
      commonSigns: [
        "Discolored water when turning on fixtures",
        "Gradual decline in household water pressure",
        "Greenish oxidation or chalky deposits on exposed pipes",
        "Multiple small leaks appearing over time"
      ],
      whatPlumberDoes: [
        "Material assessment and pipe wall integrity check",
        "Sectional pipe cutting and sanitary coupling",
        "Modern PEX or copper supply line replacement",
        "Full code-compliance testing and water pressure regulation"
      ],
      urgency: "Within 2-3 Days",
      recommendedUrgencyValue: "2-3-days"
    },
    {
      id: "bathroom-plumbing",
      title: "Bathroom Plumbing",
      icon: "🛁",
      badge: "Renovation & Repair",
      shortDesc: "Faucets, showers, tub valves, vanity connections, and cartridge replacements.",
      description: "Upgrade your bathroom experience or fix annoying drips and temperature spikes. We install luxury shower systems, freestanding tubs, vanities, and pressure-balancing shower cartridges.",
      commonSigns: [
        "Dripping shower head or faucet handle",
        "Sudden scalding or freezing water when a toilet flushes",
        "Moisture or wood rot inside the vanity cabinet",
        "Low flow from modern shower fixtures"
      ],
      whatPlumberDoes: [
        "Pressure-balancing shower valve installation",
        "Designer faucet mounting and drain hookup",
        "Tub waste and overflow replacement",
        "Behind-the-wall supply and trap reconfiguration"
      ],
      urgency: "Within 2-3 Days",
      recommendedUrgencyValue: "2-3-days"
    },
    {
      id: "kitchen-plumbing",
      title: "Kitchen Plumbing & Disposal",
      icon: "🍳",
      badge: "Appliances & Sinks",
      shortDesc: "Garbage disposals, dishwasher water lines, double-basin sinks, and ice makers.",
      description: "Keep your kitchen running smoothly. We resolve jammed garbage disposals, leaky sink basket strainers, water filtration installations, and refrigerator water line connections.",
      commonSigns: [
        "Garbage disposal hums but blades don't spin",
        "Water leaking under the sink after running the dishwasher",
        "Low flow from pull-out kitchen sprayers",
        "Slow draining double sink basins"
      ],
      whatPlumberDoes: [
        "Disposal repair or high-torque replacement",
        "Dual P-trap and continuous waste line installation",
        "Dishwasher drain loop and anti-siphon compliance",
        "Reverse osmosis and under-sink filter integration"
      ],
      urgency: "Within 2-3 Days",
      recommendedUrgencyValue: "2-3-days"
    },
    {
      id: "plumbing-installation",
      title: "Plumbing Fixture Installation",
      icon: "🏗️",
      badge: "Upgrade & New",
      shortDesc: "Professional installation of sinks, toilets, softeners, pumps, and outdoor bibs.",
      description: "Ensure new fixtures operate efficiently and without voiding manufacturer warranties. From water softeners and filtration units to sump pumps and outdoor frost-free hose bibs, we install to code.",
      commonSigns: [
        "New fixture purchased needing professional installation",
        "Upgrading to water-saving or touchless technology",
        "Replacing failing sump pump or adding battery backup",
        "Adding outdoor irrigation spigots"
      ],
      whatPlumberDoes: [
        "Accurate code-compliant pipe rough-in",
        "Secure mounting, sealing, and pressure regulation",
        "Manufacturer-spec validation and testing",
        "Proper disposal of old disconnected fixtures"
      ],
      urgency: "Scheduled / This Week",
      recommendedUrgencyValue: "this-week"
    },
    {
      id: "plumbing-inspection",
      title: "Plumbing & System Inspection",
      icon: "🔍",
      badge: "Comprehensive",
      shortDesc: "Whole-home plumbing health check, pre-purchase inspections, and preventative maintenance.",
      description: "Gain complete peace of mind about your home's hidden infrastructure. Our comprehensive multi-point inspection uncovers hidden leaks, deteriorating pipes, pressure issues, and water heater safety hazards.",
      commonSigns: [
        "Buying or selling a residential or commercial property",
        "Annual preventative home maintenance check",
        "Recent increase in utility costs without obvious reason",
        "Home older than 20 years with original plumbing"
      ],
      whatPlumberDoes: [
        "Static and dynamic water pressure testing",
        "Water heater temperature and relief valve safety audit",
        "Fixture shutoff valve operation check",
        "Detailed digital inspection report with actionable findings"
      ],
      urgency: "Scheduled / This Week",
      recommendedUrgencyValue: "this-week"
    },
    {
      id: "other",
      title: "Custom / Other Plumbing",
      icon: "💬",
      badge: "Consultation",
      shortDesc: "Custom inquiries, commercial needs, gas piping, and specialized solutions.",
      description: "Have a unique plumbing requirement or commercial facility project? Speak directly with our master plumbers to schedule an on-site consultation or customized estimate.",
      commonSigns: [
        "Specialized commercial plumbing requirements",
        "Gas line extensions for grills or fire pits",
        "Sewer line re-routing or replacement",
        "Unlisted residential plumbing problems"
      ],
      whatPlumberDoes: [
        "On-site consultation and blueprint assessment",
        "Custom material sourcing and engineering",
        "Permit coordination and municipal code review",
        "Detailed itemized estimate for project phases"
      ],
      urgency: "Flexible / Quote Request",
      recommendedUrgencyValue: "quote"
    }
  ],

  // Booking Time Slots Configuration
  BOOKING_SLOTS: [
    { id: "slot-0800", time: "8:00 AM", period: "Morning", available: true },
    { id: "slot-0900", time: "9:00 AM", period: "Morning", available: true },
    { id: "slot-1000", time: "10:00 AM", period: "Morning", available: true },
    { id: "slot-1100", time: "11:00 AM", period: "Morning", available: true },
    { id: "slot-1300", time: "1:00 PM", period: "Afternoon", available: true },
    { id: "slot-1400", time: "2:00 PM", period: "Afternoon", available: true },
    { id: "slot-1500", time: "3:00 PM", period: "Afternoon", available: false }, // example booked slot
    { id: "slot-1600", time: "4:00 PM", period: "Afternoon", available: true },
    { id: "slot-1700", time: "5:00 PM", period: "Afternoon", available: true }
  ],

  // Urgency Levels
  URGENCY_LEVELS: [
    { id: "emergency", label: "🚨 Emergency — ASAP", note: "Priority on-call dispatch", isEmergency: true },
    { id: "today", label: "⚡ Today", note: "Same-day service window", isEmergency: false },
    { id: "2-3-days", label: "📅 Within 2–3 days", note: "Standard prompt scheduling", isEmergency: false },
    { id: "this-week", label: "🗓️ This week", note: "Convenient scheduled time", isEmergency: false },
    { id: "quote", label: "💬 Just requesting a quote", note: "No immediate appointment needed", isEmergency: false }
  ]
};

// Freeze config to prevent unintended accidental runtime mutation
if (typeof Object.freeze === 'function') {
  Object.freeze(SITE_CONFIG);
}

// Support browser global and optional Node export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
