/**
 * Rule-Based Plumbing Assistant Decision Tree — United Kingdom
 * Strictly predefined logic - zero hallucination, 100% deterministic.
 */
const ASSISTANT_RULES = {
  initialQuestionId: "root",
  
  questions: {
    // ROOT QUESTION
    root: {
      id: "root",
      text: "Hi! What plumbing or heating problem are you experiencing?",
      subtitle: "Select the option that best matches your situation in your UK property.",
      options: [
        { label: "💧 Water Leak", next: "leak_active", icon: "💧" },
        { label: "🚽 Toilet Problem", next: "toilet_issue", icon: "🚽" },
        { label: "🚿 Low Water Pressure", next: "pressure_scope", icon: "🚿" },
        { label: "🌀 Blocked Drain", next: "drain_location", icon: "🌀" },
        { label: "🔥 Boiler & Hot Water", next: "heater_problem", icon: "🔥" },
        { label: "🚰 No Water Supply", next: "no_water_scope", icon: "🚰" },
        { label: "🔧 Pipework / Stopcock", next: "pipe_problem", icon: "🔧" },
        { label: "❓ Not Sure", next: "not_sure_where", icon: "❓" }
      ]
    },

    // ==========================================
    // RULE 1: WATER LEAK
    // ==========================================
    leak_active: {
      id: "leak_active",
      text: "Is water actively flowing or causing damage?",
      subtitle: "This helps our UK dispatch team determine safety steps and response speed.",
      options: [
        { 
          label: "Yes, major active leak", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Emergency Plumber",
            why: "Active water flow can cause structural ceiling collapse, electrical hazard, and severe property damage rapidly.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            alertBadge: "🚨 Urgent UK Emergency Dispatch",
            safetyAdvice: "Turn off your main internal stopcock (usually located under the kitchen sink or beneath stairs) immediately if safe to do so.",
            ctaLabel: "Book Emergency Plumber",
            showEmergencyCall: true
          }
        },
        { label: "Small drip or leak", next: "leak_location" },
        { label: "Not sure", next: "leak_location" }
      ]
    },

    leak_location: {
      id: "leak_location",
      text: "Where is the leak located?",
      subtitle: "Select the fixture or area where you notice moisture or dripping.",
      options: [
        { 
          label: "Pipework", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Pipework & Stopcock Repair",
            why: "A leaking pipe can indicate joint wear, high water pressure, pinhole corrosion, or cracked fittings.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            safetyAdvice: "Place a bucket or towels beneath the pipe and avoid using connected fixtures.",
            ctaLabel: "Book Pipe Repair"
          }
        },
        { 
          label: "Tap / Mixer", 
          result: {
            serviceId: "taps-showers",
            serviceName: "Tap & Shower Repair",
            why: "Dripping taps are typically caused by worn ceramic disc cartridges or perished rubber washers.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Turn off the local chrome isolation valve under the basin using a flat screwdriver if dripping is steady.",
            ctaLabel: "Book Tap Repair"
          }
        },
        { 
          label: "Toilet / Cistern", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet & Cistern Repair",
            why: "Toilet leaks may stem from flexi-hoses, close-coupled doughnut washers, or faulty flush valves.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Check if water is pooling on floor tiles; shut off the service isolation valve behind the pan.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Kitchen or Bathroom Sink", 
          result: {
            serviceId: "bathroom-kitchen",
            serviceName: "Sink Trap & Waste Pipe Repair",
            why: "Under-sink leaks commonly occur at compression joints, telescopic P-traps, or waste strainers.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Clear out cupboard items to prevent moisture absorption and cabinet damage.",
            ctaLabel: "Book Sink Repair"
          }
        },
        { 
          label: "Ceiling / Wall / Floorboards", 
          result: {
            serviceId: "leak-repair",
            serviceName: "Concealed Leak Detection & Repair",
            why: "Damp stains on ceilings or floorboards indicate a concealed supply or central heating pipe leak requiring acoustic/thermal tracing.",
            urgency: "Today",
            urgencyValue: "today",
            alertBadge: "🚨 Concealed Leak Alert",
            safetyAdvice: "If a ceiling plasterboard is bulging or discoloured, do not stand underneath. Turn off internal stopcock if dripping accelerates.",
            ctaLabel: "Book Leak Detection"
          }
        },
        { 
          label: "Not sure", 
          result: {
            serviceId: "leak-repair",
            serviceName: "Professional Leak Inspection",
            why: "Unidentified moisture requires professional pressure testing, thermal imaging, and pipe inspection.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            safetyAdvice: "Check your UK water meter (if fitted) with all taps closed to see if the dial continues spinning.",
            ctaLabel: "Book Leak Inspection"
          }
        }
      ]
    },

    // ==========================================
    // RULE 2: BLOCKED DRAIN
    // ==========================================
    drain_location: {
      id: "drain_location",
      text: "Where is the blockage located?",
      subtitle: "Choose the primary fixture or drain experiencing slow drainage or backup.",
      options: [
        { label: "Kitchen sink", next: "drain_flowing", context: "Kitchen sink" },
        { label: "Bathroom basin", next: "drain_flowing", context: "Bathroom basin" },
        { label: "Shower / Bath", next: "drain_flowing", context: "Shower" },
        { label: "Toilet", next: "drain_flowing", context: "Toilet" },
        { label: "Outdoor main drain / Gully", next: "drain_flowing", context: "Outdoor gully" },
        { label: "Not sure", next: "drain_flowing", context: "Multiple fixtures" }
      ]
    },

    drain_flowing: {
      id: "drain_flowing",
      text: "Is water completely unable to drain?",
      subtitle: "Tell us if dirty water is standing still or slowly receding.",
      options: [
        { 
          label: "Yes, completely blocked / backing up", 
          result: {
            serviceId: "drain-cleaning",
            serviceName: "Urgent Drain Unblocking",
            why: "Based on your answers, the waste pipe or soil stack is fully obstructed and poses a risk of dirty water flooding.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Do not run further water, washing machines, or dishwashers until cleared.",
            ctaLabel: "Book Drain Service"
          }
        },
        { 
          label: "No, draining slowly with gurgling", 
          result: {
            serviceId: "drain-cleaning",
            serviceName: "Drain Inspection & Cleaning",
            why: "Based on your answers, fats, oils, hair, or mineral scale are constricting the internal pipe bore.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            safetyAdvice: "Avoid chemical caustic drain unblockers which can damage plastic push-fit joints and emit toxic fumes.",
            ctaLabel: "Book Drain Service"
          }
        }
      ]
    },

    // ==========================================
    // RULE 3: TOILET
    // ==========================================
    toilet_issue: {
      id: "toilet_issue",
      text: "What is happening with the toilet?",
      subtitle: "Select the specific symptom you are observing in your bathroom or cloakroom.",
      options: [
        { 
          label: "Won't flush (push-button or lever)", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Flush Valve Repair",
            why: "Commonly caused by broken push-button cables, failed siphon diaphragms, or worn flush seals.",
            urgency: "Today",
            urgencyValue: "today",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Constantly running water into pan", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Cistern Inlet & Flush Valve Service",
            why: "A failing inlet valve diaphragm or degraded siphon seal allows metered water to run continuously into the pan.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Turn the chrome isolation slot-valve on the supply pipe clockwise to silence the cistern overnight.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Leaking around base of pan", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Pan Connector & Seal Renewal",
            why: "Water around the pan base indicates the waste pan connector collar or floor seal has failed.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Mop dry and avoid flushing until resealed to prevent subfloor water damage.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Blocked / Water rising near rim", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Unblocking & Trap Clearance",
            why: "A severe blockage in the integral ceramic trap or soil pipe requires heavy-duty mechanical auger clearance.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Do NOT flush again if water is near the rim; close the cistern inlet valve.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Low water level or slow refill", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Cistern Fill Valve Inspection",
            why: "Restricted inlet diaphragm, limescale buildup, or a partially closed service valve is slowing refill.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Other toilet problem", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "General Toilet Repair & Inspection",
            why: "Our UK plumber will inspect cistern internals, close-coupled bolts, pan connectors, and flush seals.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            ctaLabel: "Book Toilet Repair"
          }
        }
      ]
    },

    // ==========================================
    // RULE 4: BOILER & WATER HEATER
    // ==========================================
    heater_problem: {
      id: "heater_problem",
      text: "What is the problem with your boiler or hot water?",
      subtitle: "Choose what best describes your central heating or hot water issue.",
      options: [
        { 
          label: "No hot water or heating", 
          result: {
            serviceId: "boiler-heating",
            serviceName: "Boiler Breakdown & No Hot Water Service",
            why: "Diverter valve, burner ignition, low water pressure error, or circulating pump failure.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Check boiler pressure gauge — if below 1 bar, it may need repressurising via the filling loop. If you smell gas, turn off the meter handle and call the National Gas Emergency Service.",
            ctaLabel: "Book Boiler Service"
          }
        },
        { 
          label: "Water warm but not hot enough", 
          result: {
            serviceId: "hot-water-cylinder",
            serviceName: "Hot Water Cylinder & Thermostat Check",
            why: "Immersion heater thermostat fault, cylinder limescale, or boiler plate heat exchanger scaling.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            ctaLabel: "Book Hot Water Service"
          }
        },
        { 
          label: "Water leaking from boiler / cylinder", 
          result: {
            serviceId: "boiler-heating",
            serviceName: "Boiler & Cylinder Leak Repair",
            why: "Pressure relief valve (PRV) discharging, automatic air vent leak, or internal cylinder corrosion.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Switch off boiler electrical fused spur switch and place a container under visible drips.",
            ctaLabel: "Book Boiler Repair"
          }
        },
        { 
          label: "Strange banging / kettling noises", 
          result: {
            serviceId: "radiators-powerflushing",
            serviceName: "Boiler De-scaling & System Flush",
            why: "Kettling sounds indicate hard water limescale and magnetite sludge trapping boiling water in the heat exchanger.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Heating Inspection"
          }
        },
        { 
          label: "New boiler or cylinder installation needed", 
          result: {
            serviceId: "boiler-heating",
            serviceName: "Boiler & Cylinder Installation",
            why: "Replacing an inefficient system with an A-rated condensing combi boiler or Megaflo cylinder.",
            urgency: "This Week",
            urgencyValue: "this-week",
            ctaLabel: "Get a Quote in GBP (£)"
          }
        },
        { 
          label: "Other heating issue", 
          result: {
            serviceId: "boiler-heating",
            serviceName: "Central Heating Diagnostic",
            why: "Comprehensive multi-point inspection of motorized zone valves, programmers, and room thermostats.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            ctaLabel: "Book Heating Inspection"
          }
        }
      ]
    },

    // ==========================================
    // RULE 5: LOW WATER PRESSURE
    // ==========================================
    pressure_scope: {
      id: "pressure_scope",
      text: "Is the low water pressure affecting the whole property or only one tap?",
      subtitle: "This distinguishes localized aerator scale from main supply pressure restrictions.",
      options: [
        { 
          label: "Whole property (all taps & shower)", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Main Water Pressure & Supply Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Check that your main internal stopcock is fully open counter-clockwise.",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "Only one tap or shower", 
          result: {
            serviceId: "taps-showers",
            serviceName: "Tap Aerator & Cartridge Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "Several taps", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Plumbing Branch & Pressure Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "Not sure", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Comprehensive Plumbing Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        }
      ]
    },

    // ==========================================
    // RULE 6: NO WATER SUPPLY
    // ==========================================
    no_water_scope: {
      id: "no_water_scope",
      text: "Is there no water anywhere in the property?",
      subtitle: "Check whether your cold kitchen tap (direct mains) and neighbours are affected.",
      options: [
        { 
          label: "Yes (No water anywhere)", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Emergency Plumbing Inspection",
            why: "Check whether the issue affects your property only or the wider area. If the issue is isolated to your property, professional inspection may be required.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Check if your street external boundary stopcock (in pavement) was turned off by your water supplier for street repairs.",
            ctaLabel: "Book Plumbing Inspection"
          }
        },
        { 
          label: "No (Isolated to upstairs or specific rooms)", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Internal Branch & Stopcock Check",
            why: "Water is present at the kitchen mains tap, indicating a localized air lock, seized gate valve, or attic header tank issue.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Plumbing Inspection"
          }
        },
        { 
          label: "Not Sure", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Plumbing Inspection",
            why: "Check whether the issue affects your property only or the wider area. If the issue is isolated to your property, professional inspection may be required.",
            urgency: "Today",
            urgencyValue: "today",
            ctaLabel: "Book Plumbing Inspection"
          }
        }
      ]
    },

    // ==========================================
    // PIPE PROBLEM & STOPCOCKS
    // ==========================================
    pipe_problem: {
      id: "pipe_problem",
      text: "What seems to be wrong with the pipes or stopcock?",
      subtitle: "Select the condition of the pipework in your UK property.",
      options: [
        { 
          label: "Burst or cracked pipe", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Emergency Pipe Repair",
            why: "A burst pipe can discharge hundreds of litres per hour and cause rapid structural damage.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            alertBadge: "🚨 High Risk of Flood Damage",
            safetyAdvice: "Turn off the internal stopcock under the kitchen sink immediately.",
            ctaLabel: "Book Emergency Plumber",
            showEmergencyCall: true
          }
        },
        { 
          label: "Seized internal stopcock won't turn", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Stopcock Replacement (Quarter-Turn Lever)",
            why: "Old seized brass stopcocks prevent you from shutting off water in an emergency.",
            urgency: "Today or Tomorrow",
            urgencyValue: "today",
            ctaLabel: "Book Stopcock Replacement"
          }
        },
        { 
          label: "Loud banging pipes (water hammer)", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Water Hammer Arrestor Installation",
            why: "Shockwaves when taps or appliance solenoid valves close can loosen pipe clips and joints.",
            urgency: "Within 2–3 Days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Pipe Inspection"
          }
        },
        { 
          label: "Frozen pipes in winter", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Urgent Frozen Pipe Service",
            why: "Expanding ice can split copper or plastic pipework behind cupboards and lofts.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            safetyAdvice: "Do not use naked flames or blowtorches. Keep cold taps open slightly.",
            ctaLabel: "Book Emergency Plumber"
          }
        }
      ]
    },

    // ==========================================
    // RULE 7: NOT SURE (5 Simple Step Questions)
    // ==========================================
    not_sure_where: {
      id: "not_sure_where",
      text: "Question 1 of 5: Where is the problem located?",
      subtitle: "Select the general area of your home or commercial building.",
      options: [
        { label: "Kitchen", next: "not_sure_seeing" },
        { label: "Bathroom / En-suite", next: "not_sure_seeing" },
        { label: "Boiler Cupboard / Loft", next: "not_sure_seeing" },
        { label: "Outside / Garden / Driveway", next: "not_sure_seeing" },
        { label: "Not sure / Multiple areas", next: "not_sure_seeing" }
      ]
    },

    not_sure_seeing: {
      id: "not_sure_seeing",
      text: "Question 2 of 5: What are you seeing or hearing?",
      subtitle: "Choose the visual sign, sound, or smell.",
      options: [
        { label: "Water pooling on floor or ceiling damp", next: "not_sure_when" },
        { label: "Water draining slowly or waste gurgling", next: "not_sure_when" },
        { label: "Strange noises, vibrations, or bad odour", next: "not_sure_when" },
        { label: "No obvious visual signs, but boiler or taps faulty", next: "not_sure_when" }
      ]
    },

    not_sure_when: {
      id: "not_sure_when",
      text: "Question 3 of 5: When did it start?",
      subtitle: "Timing helps determine whether it is an acute emergency or gradual wear.",
      options: [
        { label: "Just now / Today", next: "not_sure_leaking" },
        { label: "Yesterday / A few days ago", next: "not_sure_leaking" },
        { label: "Ongoing for several weeks", next: "not_sure_leaking" }
      ]
    },

    not_sure_leaking: {
      id: "not_sure_leaking",
      text: "Question 4 of 5: Is water actively escaping?",
      subtitle: "Tell us if there is active liquid flow right now.",
      options: [
        { label: "Yes, active escaping water", next: "not_sure_urgency" },
        { label: "Slow intermittent drip", next: "not_sure_urgency" },
        { label: "No leak observed", next: "not_sure_urgency" }
      ]
    },

    not_sure_urgency: {
      id: "not_sure_urgency",
      text: "Question 5 of 5: How urgently do you need a plumber?",
      subtitle: "Choose your preferred scheduling urgency in the UK.",
      options: [
        { 
          label: "Needs immediate attention (Today)", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Plumbing Diagnostic & Inspection",
            why: "Based on your answers, an in-person multi-point inspection is the safest, most accurate way to diagnose the root cause.",
            urgency: "Today",
            urgencyValue: "today",
            ctaLabel: "Book an Inspection"
          }
        },
        { 
          label: "Tomorrow or within 48 hours", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Plumbing Diagnostic & Inspection",
            why: "Based on your answers, an in-person multi-point inspection is the safest, most accurate way to diagnose the root cause.",
            urgency: "Tomorrow",
            urgencyValue: "tomorrow",
            ctaLabel: "Book an Inspection"
          }
        },
        { 
          label: "Flexible this week", 
          result: {
            serviceId: "other",
            serviceName: "Plumbing Inspection & Quote",
            why: "Based on your answers, a qualified UK engineer will assess the installation and provide a clear quotation in GBP (£).",
            urgency: "This Week",
            urgencyValue: "this-week",
            ctaLabel: "Get a Quote"
          }
        }
      ]
    }
  }
};

// Freeze rules to prevent runtime mutation
if (typeof Object.freeze === 'function') {
  Object.freeze(ASSISTANT_RULES);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ASSISTANT_RULES;
}
