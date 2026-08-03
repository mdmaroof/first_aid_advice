/** Curated first-aid responses for homepage quick picks — no API needed. */

const normalizeKey = (input) => input.trim().toLowerCase();

export const QUICK_AID_DATA = {
  "heart pain": {
    first_instance: { disease: "Possible heart attack", accuracy: "Guidance" },
    medical_advice: "Chest pain + sweat or breathlessness? Call emergency now.",
    instant_help: [
      { step: 1, info: "Stop all activity. Sit or lie them down." },
      { step: 2, info: "Loosen tight clothes at neck and chest." },
      {
        step: 3,
        info: "If alert, adult, no allergy/bleed risk: chew one aspirin.",
      },
      {
        step: 4,
        info: "Give prescribed nitroglycerin under the tongue if they have it.",
      },
      {
        step: 5,
        info: "Call emergency if pain lasts over 5 minutes or spreads.",
      },
      {
        step: 6,
        info: "Stay with them. If unresponsive and not breathing — start CPR.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Crushing chest pressure",
          description: "Feels like a weight — call emergency.",
        },
        {
          symptom: "Pain to arm, jaw, or back",
          description: "Spreading pain is a red flag.",
        },
        {
          symptom: "Cold sweat or nausea",
          description: "Classic heart-attack warning.",
        },
        {
          symptom: "Sudden breathlessness",
          description: "Hard to breathe with chest pain — emergency.",
        },
      ],
      basic: [
        {
          symptom: "Mild ache after heavy lifting",
          description: "Rest. Recheck if it returns with effort.",
        },
        {
          symptom: "Brief twinge that fades fast",
          description: "Watch it. Call if it comes back stronger.",
        },
        {
          symptom: "Sore muscles after exercise",
          description: "Gentle rest and hydration usually help.",
        },
      ],
    },
  },

  "breathing trouble": {
    first_instance: { disease: "Breathing difficulty", accuracy: "Guidance" },
    medical_advice: "Can't speak full sentences? Call emergency now.",
    instant_help: [
      { step: 1, info: "Sit them upright — lean slightly forward." },
      { step: 2, info: "Loosen clothes. Move to fresh air." },
      {
        step: 3,
        info: "Help with their inhaler if they have one (slow deep puffs).",
      },
      {
        step: 4,
        info: "For severe allergy swelling: use epinephrine auto-injector, then call.",
      },
      {
        step: 5,
        info: "Coach slow breathing: in 4, out 6 through pursed lips.",
      },
      {
        step: 6,
        info: "Blue lips, confusion, or silence? Call emergency and start CPR if needed.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Can't finish a sentence",
          description: "Severe distress — call now.",
        },
        {
          symptom: "Blue or grey lips",
          description: "Low oxygen — emergency.",
        },
        {
          symptom: "Face or tongue swelling",
          description: "Possible anaphylaxis — epinephrine + call.",
        },
        {
          symptom: "Chest sucking in",
          description: "Ribs pulling in with each breath — urgent.",
        },
      ],
      basic: [
        {
          symptom: "Mild wheeze after exercise",
          description: "Rest upright. Use inhaler if prescribed.",
        },
        {
          symptom: "Short of breath from anxiety",
          description: "Slow nose-in, pursed-lip out. Stay calm.",
        },
        {
          symptom: "Stuffy air or dust trigger",
          description: "Move to fresh air and loosen clothes.",
        },
      ],
    },
  },

  bleeding: {
    first_instance: { disease: "Bleeding wound", accuracy: "Guidance" },
    medical_advice: "Spurting blood or won't stop? Call emergency. Press hard.",
    instant_help: [
      { step: 1, info: "Scene safe? Gloves on if you have them." },
      { step: 2, info: "Expose the wound. Press a clean cloth firmly." },
      {
        step: 3,
        info: "Don't peek. Hold pressure 10–15 minutes straight.",
      },
      {
        step: 4,
        info: "Blood soaks through? Add more pads — don't remove the first.",
      },
      {
        step: 5,
        info: "Arm or leg? Raise it above the heart while pressing.",
      },
      {
        step: 6,
        info: "Object stuck in? Leave it. Pad around it and bandage.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Spurting or pulsing blood",
          description: "Likely artery — press hard and call.",
        },
        {
          symptom: "Pale, cold, clammy skin",
          description: "Possible shock — lie them down, call.",
        },
        {
          symptom: "Dizzy or passing out",
          description: "Serious blood loss — emergency.",
        },
        {
          symptom: "Bleed after head injury",
          description: "From nose/ears/mouth — keep still, call.",
        },
      ],
      basic: [
        {
          symptom: "Small cut, steady ooze",
          description: "Wash, press, bandage. Watch for infection.",
        },
        {
          symptom: "Scraped skin (abrasion)",
          description: "Rinse, clean dressing, keep dry.",
        },
        {
          symptom: "Stopped after brief pressure",
          description: "Cover cleanly. Elevate if it restarts.",
        },
      ],
    },
  },

  burn: {
    first_instance: { disease: "Burn injury", accuracy: "Guidance" },
    medical_advice: "Cool under running water 20 minutes. No ice, butter, or cream.",
    instant_help: [
      { step: 1, info: "Stop the burn — get away from heat or flames." },
      { step: 2, info: "Cool under cool running water for 20 minutes." },
      {
        step: 3,
        info: "Remove rings and loose clothing before swelling starts.",
      },
      {
        step: 4,
        info: "Cover loosely with clean non-fluffy cloth or cling film.",
      },
      {
        step: 5,
        info: "Never pop blisters. No butter, toothpaste, or ice.",
      },
      {
        step: 6,
        info: "Face, hands, large, or charred burn? Seek urgent care.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "White, waxy, or charred skin",
          description: "Deep burn — hospital now.",
        },
        {
          symptom: "Cough or singed nose hairs",
          description: "Possible airway burn — call emergency.",
        },
        {
          symptom: "Chemical or electrical burn",
          description: "Flush chemicals; always get checked.",
        },
        {
          symptom: "Bigger than a palm",
          description: "Large burn — urgent medical care.",
        },
      ],
      basic: [
        {
          symptom: "Red, painful, no blisters",
          description: "Cool 20 min. Light cover. Pain relief if allowed.",
        },
        {
          symptom: "Small blister patch",
          description: "Don't pop. Cover loosely. Recheck tomorrow.",
        },
        {
          symptom: "Sunburn without blistering",
          description: "Cool water, shade, drink fluids.",
        },
      ],
    },
  },

  choking: {
    first_instance: { disease: "Choking", accuracy: "Guidance" },
    medical_advice: "Can't speak, cough, or breathe? Back blows now — then call.",
    instant_help: [
      { step: 1, info: "Ask: “Are you choking?” If they can cough — let them." },
      {
        step: 2,
        info: "Silent, can't speak? Call emergency. Stay with them.",
      },
      {
        step: 3,
        info: "Lean them forward. Give up to 5 firm back blows.",
      },
      {
        step: 4,
        info: "Still blocked? Up to 5 abdominal thrusts (Heimlich).",
      },
      {
        step: 5,
        info: "Keep alternating 5 and 5 until clear or they collapse.",
      },
      {
        step: 6,
        info: "If they collapse: CPR. Check mouth for visible objects only.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Can't speak or cry",
          description: "Severe blockage — act now.",
        },
        {
          symptom: "Hands at the throat",
          description: "Universal choking sign.",
        },
        {
          symptom: "Blue lips or face",
          description: "No oxygen — emergency.",
        },
        {
          symptom: "Passes out",
          description: "Start CPR immediately.",
        },
      ],
      basic: [
        {
          symptom: "Strong, forceful cough",
          description: "Mild choke — encourage coughing. Stay close.",
        },
        {
          symptom: "Can speak between coughs",
          description: "Airway partly open — monitor closely.",
        },
        {
          symptom: "Cleared after coughing",
          description: "Still get checked if throat feels sore or swollen.",
        },
      ],
    },
  },

  headache: {
    first_instance: { disease: "Headache", accuracy: "Guidance" },
    medical_advice: "Worst headache of your life — sudden? Call emergency.",
    instant_help: [
      { step: 1, info: "Note onset: sudden or gradual? Any injury or fever?" },
      {
        step: 2,
        info: "Red flags (thunderclap, weakness, stiff neck)? Call now.",
      },
      { step: 3, info: "No red flags: rest in a quiet, dim room." },
      { step: 4, info: "Drink water. Cool cloth on forehead or neck." },
      {
        step: 5,
        info: "If allowed: standard paracetamol or ibuprofen dose.",
      },
      {
        step: 6,
        info: "Worsens, follows a fall, or unlike usual? See a clinician today.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Sudden worst-ever pain",
          description: "Thunderclap — call emergency.",
        },
        {
          symptom: "Fever + stiff neck",
          description: "Possible meningitis — hospital now.",
        },
        {
          symptom: "Face droop or weak arm",
          description: "FAST stroke signs — call now.",
        },
        {
          symptom: "Confusion or vision loss",
          description: "Treat as urgent.",
        },
      ],
      basic: [
        {
          symptom: "Tight band around the head",
          description: "Often tension — rest, water, dim light.",
        },
        {
          symptom: "Familiar migraine pattern",
          description: "Quiet room, hydrate, usual relief if safe.",
        },
        {
          symptom: "After too little sleep",
          description: "Rest and fluids. Recheck if it builds.",
        },
      ],
    },
  },

  "dog bite": {
    first_instance: { disease: "Dog bite", accuracy: "Guidance" },
    medical_advice: "Skin broken? Clean well, then get checked same day.",
    instant_help: [
      { step: 1, info: "Get to safety. Don't chase the dog." },
      { step: 2, info: "Press to stop bleeding. Elevate if you can." },
      { step: 3, info: "Wash with soap and running water for 5+ minutes." },
      { step: 4, info: "Cover with a clean dressing. Don't seal deep punctures tight." },
      {
        step: 5,
        info: "Note dog, owner, and rabies/vaccine status if known.",
      },
      {
        step: 6,
        info: "See a clinician today — antibiotics or tetanus may be needed.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Heavy bleeding or faintness",
          description: "Press hard. Call emergency.",
        },
        {
          symptom: "Face or neck bite",
          description: "High risk — emergency care.",
        },
        {
          symptom: "Can't move fingers",
          description: "Possible nerve/tendon damage.",
        },
        {
          symptom: "Spreading redness or fever",
          description: "Infection rising — urgent care.",
        },
      ],
      basic: [
        {
          symptom: "Shallow scratch, little blood",
          description: "Wash well. Cover. Watch 48 hours.",
        },
        {
          symptom: "Known vaccinated pet",
          description: "Still clean and get clinical advice.",
        },
        {
          symptom: "Mild soreness only",
          description: "Keep clean and dry. Recheck if warmer/redder.",
        },
      ],
    },
  },

  "snake bite": {
    first_instance: { disease: "Snake bite", accuracy: "Guidance" },
    medical_advice: "Treat as venomous until proven otherwise. Call emergency. Stay still.",
    instant_help: [
      { step: 1, info: "Call emergency. Keep them calm and still." },
      { step: 2, info: "Move away from the snake only if unsafe nearby." },
      {
        step: 3,
        info: "Remove rings and tight clothes before swelling starts.",
      },
      {
        step: 4,
        info: "Immobilise the limb at about heart level.",
      },
      {
        step: 5,
        info: "Don't cut, suck, ice, or use a tight tourniquet.",
      },
      {
        step: 6,
        info: "Mark swelling edge + time. Be ready for CPR if they collapse.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Fang marks + fast swelling",
          description: "Assume venom — call now.",
        },
        {
          symptom: "Drooping eyelids / blurry vision",
          description: "Neurotoxin risk — emergency.",
        },
        {
          symptom: "Trouble breathing or swallowing",
          description: "Airway risk — call and stay ready.",
        },
        {
          symptom: "Bleeding gums or vomiting blood",
          description: "Clotting problem — hospital now.",
        },
      ],
      basic: [
        {
          symptom: "Tiny nick, no swelling yet",
          description: "Still keep still and get assessed.",
        },
        {
          symptom: "Fear and racing heart only",
          description: "Stay calm. Still call — better safe.",
        },
        {
          symptom: "Dry bite suspicion",
          description: "Only a clinician can confirm. Don't wait it out alone.",
        },
      ],
    },
  },

  "poison swallowed": {
    category: "poison",
    first_instance: { disease: "Poison swallowed", accuracy: "Guidance" },
    medical_advice:
      "Don't make them vomit. Call poison control or emergency now.",
    instant_help: [
      { step: 1, info: "Call poison control or emergency — stay on the line." },
      { step: 2, info: "Do not make them vomit or give salt water." },
      { step: 3, info: "No food, drink, or milk unless a clinician says so." },
      { step: 4, info: "Keep the container or label for responders." },
      { step: 5, info: "Note what, how much, and when it was taken." },
      {
        step: 6,
        info: "If drowsy, seizing, or not breathing — call emergency; start CPR if needed.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Drowsy or hard to wake",
          description: "Call emergency now.",
        },
        {
          symptom: "Seizure or collapse",
          description: "Protect airway — emergency.",
        },
        {
          symptom: "Trouble breathing",
          description: "Airway risk — call now.",
        },
        {
          symptom: "Burns in mouth or throat",
          description: "Corrosive risk — urgent care.",
        },
      ],
      basic: [
        {
          symptom: "Small sip, feels fine",
          description: "Still call poison control to confirm.",
        },
        {
          symptom: "Mild nausea only",
          description: "Don't induce vomiting. Get advice now.",
        },
        {
          symptom: "Unknown amount swallowed",
          description: "Treat as serious until advised otherwise.",
        },
      ],
    },
  },

  "poison skin": {
    category: "poison",
    first_instance: {
      disease: "Poison on skin",
      accuracy: "Guidance",
    },
    medical_advice:
      "Brush off dry powder, then rinse with water 15+ minutes. Call for advice.",
    instant_help: [
      { step: 1, info: "Move away from the chemical. Avoid spreading it." },
      { step: 2, info: "Brush off dry powder before water if it's a dry chemical." },
      { step: 3, info: "Remove contaminated clothes and jewelry carefully." },
      { step: 4, info: "Rinse skin with cool running water for 15+ minutes." },
      { step: 5, info: "Wash gently with soap after long rinse if advised." },
      { step: 6, info: "Call poison control. Bring the product label." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Burning, blistering skin",
          description: "Chemical burn — urgent care.",
        },
        {
          symptom: "Trouble breathing after splash",
          description: "Possible fumes — call emergency.",
        },
        {
          symptom: "Large area exposed",
          description: "Call poison control / emergency.",
        },
        {
          symptom: "Eyes also exposed",
          description: "Rinse eyes too — see eye guidance.",
        },
      ],
      basic: [
        {
          symptom: "Small splash, mild sting",
          description: "Rinse 15 min. Still get advice.",
        },
        {
          symptom: "Redness after rinse",
          description: "Cover loosely. Recheck with hotline.",
        },
        {
          symptom: "Known mild household cleaner",
          description: "Rinse well. Call if unsure.",
        },
      ],
    },
  },

  "poison eyes": {
    category: "poison",
    first_instance: { disease: "Poison in eyes", accuracy: "Guidance" },
    medical_advice:
      "Rinse eyes with clean water 15+ minutes. Don't rub. Call now.",
    instant_help: [
      { step: 1, info: "Hold eyelids open. Flush with clean lukewarm water." },
      { step: 2, info: "Rinse for at least 15 minutes — clock it." },
      { step: 3, info: "Remove contact lenses while rinsing if easy." },
      { step: 4, info: "Do not rub eyes or use eye drops unless told." },
      { step: 5, info: "Call poison control or emergency while rinsing if you can." },
      { step: 6, info: "Seek urgent eye care after rinsing — take the product." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Severe pain or vision loss",
          description: "Emergency — keep rinsing, call.",
        },
        {
          symptom: "Chemical still burning",
          description: "Continue flush — urgent care.",
        },
        {
          symptom: "Both eyes affected",
          description: "Call emergency / poison control.",
        },
        {
          symptom: "Alkali or battery acid",
          description: "High damage risk — hospital now.",
        },
      ],
      basic: [
        {
          symptom: "Mild sting, rinsing helps",
          description: "Finish 15 min rinse. Still get advice.",
        },
        {
          symptom: "Redness after flush",
          description: "See urgent care same day.",
        },
        {
          symptom: "Splash of mild soap",
          description: "Rinse well. Call if pain continues.",
        },
      ],
    },
  },

  "poison inhaled": {
    category: "poison",
    first_instance: { disease: "Poison inhaled", accuracy: "Guidance" },
    medical_advice:
      "Fresh air now. If breathless or confused — call emergency.",
    instant_help: [
      { step: 1, info: "Get to fresh air. Don't re-enter a toxic space." },
      { step: 2, info: "Loosen tight clothing. Sit upright if breathless." },
      { step: 3, info: "Open windows only if safe — prefer leave the area." },
      { step: 4, info: "Call poison control or emergency. Name the gas if known." },
      { step: 5, info: "Don't enter confined spaces to “help” without protection." },
      {
        step: 6,
        info: "If unresponsive and not breathing — start CPR; call emergency.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Can't catch breath",
          description: "Call emergency now.",
        },
        {
          symptom: "Blue lips or confusion",
          description: "Low oxygen — emergency.",
        },
        {
          symptom: "Chest pain after fumes",
          description: "Urgent — call now.",
        },
        {
          symptom: "Collapse in a closed room",
          description: "Possible CO/gas — emergency.",
        },
      ],
      basic: [
        {
          symptom: "Mild headache after smell",
          description: "Fresh air. Call poison control.",
        },
        {
          symptom: "Cough that is easing",
          description: "Stay outside. Get advice if it returns.",
        },
        {
          symptom: "Brief exposure, feeling OK",
          description: "Still report it — some gases delay effects.",
        },
      ],
    },
  },

  "poison food": {
    category: "poison",
    first_instance: {
      disease: "Food or plant poison",
      accuracy: "Guidance",
    },
    medical_advice:
      "Don't make them vomit. Save a sample. Call poison control now.",
    instant_help: [
      { step: 1, info: "Call poison control or emergency for advice." },
      { step: 2, info: "Do not force vomiting." },
      { step: 3, info: "Save leftover food, plant, or mushrooms in a bag." },
      { step: 4, info: "Note time eaten and how much." },
      { step: 5, info: "Sip water only if fully alert and advised to." },
      {
        step: 6,
        info: "Severe vomiting, confusion, or breathing trouble — call emergency.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Severe vomiting or diarrhea",
          description: "Dehydration risk — urgent care.",
        },
        {
          symptom: "Hallucinations or confusion",
          description: "Possible toxin — call emergency.",
        },
        {
          symptom: "Trouble swallowing or breathing",
          description: "Emergency now.",
        },
        {
          symptom: "Wild mushroom eaten",
          description: "Treat as serious — call now.",
        },
      ],
      basic: [
        {
          symptom: "Mild stomach upset",
          description: "Rest. Call poison control to confirm.",
        },
        {
          symptom: "Known food allergy mild itch",
          description: "Watch closely; epinephrine if prescribed anaphylaxis.",
        },
        {
          symptom: "Small taste of unknown berry",
          description: "Still call — better safe.",
        },
      ],
    },
  },

  "poison unknown": {
    category: "poison",
    first_instance: { disease: "Unknown poison", accuracy: "Guidance" },
    medical_advice:
      "Treat as serious. Call poison control or emergency now.",
    instant_help: [
      { step: 1, info: "Call poison control or emergency immediately." },
      { step: 2, info: "Don't guess — no vomiting, no home remedies." },
      { step: 3, info: "Move to fresh air if fumes are possible." },
      { step: 4, info: "Rinse skin/eyes if a splash may have happened." },
      { step: 5, info: "Gather any bottles, plants, or pills nearby." },
      {
        step: 6,
        info: "Stay with them. If they collapse — emergency + CPR if needed.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Any breathing trouble",
          description: "Call emergency now.",
        },
        {
          symptom: "Seizure, collapse, or confusion",
          description: "Emergency — protect airway.",
        },
        {
          symptom: "Burns on lips or skin",
          description: "Possible corrosive — urgent.",
        },
        {
          symptom: "Child or unknown dose",
          description: "Don't wait — call now.",
        },
      ],
      basic: [
        {
          symptom: "Exposure unclear, feels well",
          description: "Still call poison control to triage.",
        },
        {
          symptom: "Mild worry only",
          description: "Get expert advice before home care.",
        },
        {
          symptom: "Possible contact, no symptoms yet",
          description: "Some poisons are delayed — call.",
        },
      ],
    },
  },
};

export function getQuickAidData(input) {
  return QUICK_AID_DATA[normalizeKey(input)] ?? null;
}

export function isQuickAidOption(input) {
  return normalizeKey(input) in QUICK_AID_DATA;
}
