/**
 * Rule-Based Plumbing Assistant Decision Tree
 * Strictly predefined logic - zero hallucination, 100% deterministic.
 */
const ASSISTANT_RULES = {
  initialQuestionId: "root",
  
  questions: {
    // ROOT QUESTION
    root: {
      id: "root",
      text: "Hi! What plumbing problem are you experiencing?",
      subtitle: "Select the option that best matches your situation.",
      options: [
        { label: "💧 Water Leak", next: "leak_active", icon: "💧" },
        { label: "🚽 Toilet Problem", next: "toilet_issue", icon: "🚽" },
        { label: "🚿 Low Water Pressure", next: "pressure_scope", icon: "🚿" },
        { label: "🌀 Blocked Drain", next: "drain_location", icon: "🌀" },
        { label: "🔥 Water Heater", next: "heater_problem", icon: "🔥" },
        { label: "🚰 No Water", next: "no_water_scope", icon: "🚰" },
        { label: "🔧 Pipe Problem", next: "pipe_problem", icon: "🔧" },
        { label: "❓ Not Sure", next: "not_sure_where", icon: "❓" }
      ]
    },

    // ==========================================
    // RULE 1: WATER LEAK
    // ==========================================
    leak_active: {
      id: "leak_active",
      text: "Is water actively flowing or causing damage?",
      subtitle: "This helps us determine safety steps and response speed.",
      options: [
        { 
          label: "Yes, major leak", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Emergency Plumbing",
            why: "Active water flow can cause structural damage and electrical hazards rapidly.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            alertBadge: "🚨 This may require urgent attention.",
            safetyAdvice: "Turn off the nearest water supply or main shutoff valve if it is safe to do so.",
            ctaLabel: "Book Emergency Plumbing",
            showEmergencyCall: true
          }
        },
        { label: "Small leak", next: "leak_location" },
        { label: "Not sure", next: "leak_location" }
      ]
    },

    leak_location: {
      id: "leak_location",
      text: "Where is the leak located?",
      subtitle: "Select the fixture or area where you notice moisture or dripping.",
      options: [
        { 
          label: "Pipe", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Pipe Repair & Repiping",
            why: "A leaking pipe can indicate joint wear, corrosion, or pinhole failure.",
            urgency: "Today or Within 24-48 Hours",
            urgencyValue: "today",
            safetyAdvice: "Place a bucket or towels beneath the pipe and avoid using connected fixtures.",
            ctaLabel: "Book Pipe Repair"
          }
        },
        { 
          label: "Tap/Faucet", 
          result: {
            serviceId: "bathroom-plumbing",
            serviceName: "Tap & Faucet Repair",
            why: "Faucet leaks are typically caused by worn O-rings, corroded valve seats, or failed cartridges.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Turn off the local fixture stop valve under the sink if dripping is steady.",
            ctaLabel: "Book Faucet Repair"
          }
        },
        { 
          label: "Toilet", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Leak Repair",
            why: "Toilet leaks may stem from supply lines, tank bolts, flappers, or the wax floor ring.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Check if water is pooling on the floor; turn off the chrome shutoff valve behind the toilet.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Sink", 
          result: {
            serviceId: "kitchen-plumbing",
            serviceName: "Sink & Trap Repair",
            why: "Under-sink leaks commonly occur at drain slip-joints, P-traps, or basket strainers.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Clear out cabinet items to prevent moisture absorption and wood rot.",
            ctaLabel: "Book Sink Repair"
          }
        },
        { 
          label: "Ceiling/Wall", 
          result: {
            serviceId: "leak-repair",
            serviceName: "Concealed Leak Detection & Repair",
            why: "Damp spots on drywall or ceilings indicate an active hidden pipe leak that needs acoustic/thermal location.",
            urgency: "Today",
            urgencyValue: "today",
            alertBadge: "🚨 Concealed Leak Alert",
            safetyAdvice: "If ceiling is sagging, do not stand underneath. Shut off main water if flow increases.",
            ctaLabel: "Book Leak Detection"
          }
        },
        { 
          label: "Not sure", 
          result: {
            serviceId: "leak-repair",
            serviceName: "Plumbing Leak Inspection",
            why: "Unidentified moisture requires professional pressure testing and thermal scanning.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Monitor your water meter while all fixtures are off to see if the dial moves.",
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
      subtitle: "Choose the primary fixture experiencing slow drainage or backup.",
      options: [
        { label: "Kitchen sink", next: "drain_flowing", context: "Kitchen sink" },
        { label: "Bathroom sink", next: "drain_flowing", context: "Bathroom sink" },
        { label: "Shower / Tub", next: "drain_flowing", context: "Shower" },
        { label: "Toilet", next: "drain_flowing", context: "Toilet" },
        { label: "Main drain", next: "drain_flowing", context: "Main drain" },
        { label: "Not sure", next: "drain_flowing", context: "Multiple fixtures" }
      ]
    },

    drain_flowing: {
      id: "drain_flowing",
      text: "Is water completely unable to drain?",
      subtitle: "Tell us if water is standing still or slowly receding.",
      options: [
        { 
          label: "Yes, completely blocked", 
          result: {
            serviceId: "drain-cleaning",
            serviceName: "Urgent Drain Cleaning",
            why: "Based on your answers, your drain is fully obstructed and poses a risk of dirty water backup.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Do not run further water or use harsh chemical cleaners which can damage pipes.",
            ctaLabel: "Book Drain Service"
          }
        },
        { 
          label: "No, draining slowly", 
          result: {
            serviceId: "drain-cleaning",
            serviceName: "Drain Inspection / Cleaning",
            why: "Based on your answers, grease, hair, soap scum, or mineral scale is restricting the pipe diameter.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            safetyAdvice: "Avoid putting cooking fats or fibrous matter down the disposal until inspected.",
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
      subtitle: "Select the specific symptom you are observing.",
      options: [
        { 
          label: "Won't flush", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Flush Mechanism Repair",
            why: "Commonly caused by broken lift chains, damaged flush handles, or disconnected trip levers.",
            urgency: "Today",
            urgencyValue: "today",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Constantly running", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Flapper & Fill Valve Service",
            why: "A failing flapper seal or misadjusted float valve wastes water non-stop.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Jiggling the handle is a temporary stopgap; turn the wall valve clockwise to silence it overnight.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Leaking around base", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Wax Ring & Base Reseal",
            why: "Water around the base indicates the wax gasket seal has degraded, risking subfloor water damage.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Wipe clean and minimize flushing until the seal is replaced.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Blocked / Backing up", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Auger & Clog Removal",
            why: "A severe clog in the integral S-trap or outlet horn requires motorized or heavy auger clearance.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Do not flush again if the bowl is near overflowing; close the shutoff valve immediately.",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Low water level in bowl", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "Toilet Fill Mechanism Inspection",
            why: "May indicate a cracked siphon tube, vent pipe blockage, or dry wax ring.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Toilet Repair"
          }
        },
        { 
          label: "Other toilet problem", 
          result: {
            serviceId: "toilet-repair",
            serviceName: "General Toilet Repair & Inspection",
            why: "Our plumber will inspect tank components, bolts, gaskets, and porcelain integrity.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Toilet Repair"
          }
        }
      ]
    },

    // ==========================================
    // RULE 4: WATER HEATER
    // ==========================================
    heater_problem: {
      id: "heater_problem",
      text: "What is the problem with your water heater?",
      subtitle: "Choose what best describes your hot water issue.",
      options: [
        { 
          label: "No hot water", 
          result: {
            serviceId: "water-heater",
            serviceName: "No Hot Water Service",
            why: "Heating elements, thermocouple, pilot assembly, or electrical breaker may have tripped or failed.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Check your electrical panel for a tripped breaker. For gas heaters, do not attempt to light if you smell gas.",
            ctaLabel: "Book Water Heater Service"
          }
        },
        { 
          label: "Water not hot enough", 
          result: {
            serviceId: "water-heater",
            serviceName: "Water Heater Inspection",
            why: "Sediment calcification around the lower element or a miscalibrated thermostat restricts temperature.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Water Heater Service"
          }
        },
        { 
          label: "Leaking from heater", 
          result: {
            serviceId: "water-heater",
            serviceName: "Water Heater Inspection & Leak Repair",
            why: "A leak from the temperature & pressure relief valve or bottom tank seam requires rapid assessment.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "If water is pooling around the heater, switch off the breaker or gas control valve.",
            ctaLabel: "Book Water Heater Service"
          }
        },
        { 
          label: "Strange noise (rumbling/popping)", 
          result: {
            serviceId: "water-heater",
            serviceName: "Water Heater Inspection",
            why: "Popping or knocking sounds are caused by trapped boiling water bubbles beneath heavy sediment.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Water Heater Service"
          }
        },
        { 
          label: "Installation needed", 
          result: {
            serviceId: "water-heater",
            serviceName: "Water Heater Installation",
            why: "Upgrading to a high-efficiency tank or on-demand tankless system with professional code venting.",
            urgency: "This week",
            urgencyValue: "this-week",
            ctaLabel: "Book Water Heater Service"
          }
        },
        { 
          label: "Other water heater issue", 
          result: {
            serviceId: "water-heater",
            serviceName: "Water Heater Inspection",
            why: "Professional diagnostic of gas supply, electrical circuitry, anode rod, and piping connections.",
            urgency: "Today or 1–2 days",
            urgencyValue: "today",
            ctaLabel: "Book Water Heater Service"
          }
        }
      ]
    },

    // ==========================================
    // RULE 5: LOW WATER PRESSURE
    // ==========================================
    pressure_scope: {
      id: "pressure_scope",
      text: "Is the low pressure affecting the whole property or only one tap?",
      subtitle: "This distinguishes localized aerator clogs from main line pressure problems.",
      options: [
        { 
          label: "Whole property", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Water Pressure & Main Line Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "One tap", 
          result: {
            serviceId: "bathroom-plumbing",
            serviceName: "Fixture Aerator & Cartridge Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "Several taps", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Pressure Regulator & Branch Line Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        },
        { 
          label: "Not sure", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Whole-House Plumbing Inspection",
            why: "Low water pressure can have several causes, including fixture issues, pipe restrictions, or supply problems. A plumber can inspect the system to identify the cause.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Inspection"
          }
        }
      ]
    },

    // ==========================================
    // RULE 6: NO WATER
    // ==========================================
    no_water_scope: {
      id: "no_water_scope",
      text: "Is there no water anywhere in the property?",
      subtitle: "Check whether other fixtures or neighbors are similarly affected.",
      options: [
        { 
          label: "Yes (No water anywhere)", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Urgent Plumbing Inspection",
            why: "Check whether the issue affects your property only or the wider area. If the issue is isolated to your property, professional inspection may be required.",
            urgency: "Today",
            urgencyValue: "today",
            safetyAdvice: "Verify if your main street curb valve or water meter shutoff was accidentally turned off.",
            ctaLabel: "Book Plumbing Inspection"
          }
        },
        { 
          label: "No (Isolated to specific rooms)", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Branch Line & Valve Inspection",
            why: "Water is present in parts of the building, meaning a local isolation valve or localized air lock is likely.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Plumbing Inspection"
          }
        },
        { 
          label: "Not Sure", 
          result: {
            serviceId: "plumbing-inspection",
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
    // PIPE PROBLEM
    // ==========================================
    pipe_problem: {
      id: "pipe_problem",
      text: "What seems to be wrong with the pipes?",
      subtitle: "Select the condition of the visible or audible piping.",
      options: [
        { 
          label: "Burst or cracked pipe", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Emergency Pipe Repair",
            why: "A burst pipe can discharge hundreds of gallons per hour.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            alertBadge: "🚨 High Risk of Flood Damage",
            safetyAdvice: "Shut off the main incoming water supply immediately if safe to do so.",
            ctaLabel: "Book Emergency Plumbing",
            showEmergencyCall: true
          }
        },
        { 
          label: "Pinhole leak / Corrosion", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Pipe Sectional Repair & Repiping",
            why: "Oxidation and pitting corrosion indicate pipe wall thinning that needs repair.",
            urgency: "Today or Within 24-48 Hours",
            urgencyValue: "today",
            ctaLabel: "Book Pipe Repair"
          }
        },
        { 
          label: "Loud banging / Water hammer", 
          result: {
            serviceId: "pipe-repair",
            serviceName: "Water Hammer Arrestor & Pressure Check",
            why: "Shockwaves when valves snap shut can loosen joints and damage pipe supports.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book Pipe Inspection"
          }
        },
        { 
          label: "Frozen pipes", 
          result: {
            serviceId: "emergency-plumbing",
            serviceName: "Urgent Frozen Pipe Service",
            why: "Expanding ice can split copper or plastic pipe walls.",
            urgency: "Immediate / ASAP",
            urgencyValue: "emergency",
            safetyAdvice: "Do not use an open flame to thaw pipes. Keep faucets slightly open.",
            ctaLabel: "Book Emergency Service"
          }
        }
      ]
    },

    // ==========================================
    // RULE 7: NOT SURE (5 Simple Step Questions)
    // ==========================================
    not_sure_where: {
      id: "not_sure_where",
      text: "Question 1 of 5: Where is the problem?",
      subtitle: "Select the general area of your home or business.",
      options: [
        { label: "Kitchen", next: "not_sure_seeing" },
        { label: "Bathroom", next: "not_sure_seeing" },
        { label: "Basement / Utility Room", next: "not_sure_seeing" },
        { label: "Outside / Yard", next: "not_sure_seeing" },
        { label: "Not sure / Multiple areas", next: "not_sure_seeing" }
      ]
    },

    not_sure_seeing: {
      id: "not_sure_seeing",
      text: "Question 2 of 5: What are you seeing?",
      subtitle: "Choose the visual or audible sign.",
      options: [
        { label: "Water on floor or ceiling", next: "not_sure_when" },
        { label: "Water draining slowly or backing up", next: "not_sure_when" },
        { label: "Strange noise or odor", next: "not_sure_when" },
        { label: "No obvious visual signs", next: "not_sure_when" }
      ]
    },

    not_sure_when: {
      id: "not_sure_when",
      text: "Question 3 of 5: When did it start?",
      subtitle: "Timing helps determine whether it is an acute failure or gradual wear.",
      options: [
        { label: "Just now / Today", next: "not_sure_leaking" },
        { label: "A few days ago", next: "not_sure_leaking" },
        { label: "Ongoing for weeks", next: "not_sure_leaking" }
      ]
    },

    not_sure_leaking: {
      id: "not_sure_leaking",
      text: "Question 4 of 5: Is water currently leaking?",
      subtitle: "Let us know if there is active liquid escape right now.",
      options: [
        { label: "Yes, active flow", next: "not_sure_urgency" },
        { label: "Slow drip or seepage", next: "not_sure_urgency" },
        { label: "No leak observed", next: "not_sure_urgency" }
      ]
    },

    not_sure_urgency: {
      id: "not_sure_urgency",
      text: "Question 5 of 5: How urgent is it for you?",
      subtitle: "Choose your preferred scheduling urgency.",
      options: [
        { 
          label: "Needs immediate attention", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Plumbing Inspection",
            why: "Based on your answers, an in-person multi-point inspection is the safest, most accurate way to diagnose the root cause.",
            urgency: "Today",
            urgencyValue: "today",
            ctaLabel: "Book an Inspection"
          }
        },
        { 
          label: "Within 24–48 hours", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Plumbing Inspection",
            why: "Based on your answers, an in-person multi-point inspection is the safest, most accurate way to diagnose the root cause.",
            urgency: "Within 2–3 days",
            urgencyValue: "2-3-days",
            ctaLabel: "Book an Inspection"
          }
        },
        { 
          label: "Flexible this week", 
          result: {
            serviceId: "plumbing-inspection",
            serviceName: "Plumbing Inspection",
            why: "Based on your answers, an in-person multi-point inspection is the safest, most accurate way to diagnose the root cause.",
            urgency: "This week",
            urgencyValue: "this-week",
            ctaLabel: "Book an Inspection"
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
