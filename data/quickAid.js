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
    // Alias for typed "Burn" / legacy — same as heat
    first_instance: { disease: "Heat burn", accuracy: "Guidance" },
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
          symptom: "Bigger than a palm",
          description: "Large burn — urgent medical care.",
        },
        {
          symptom: "On face, hands, or joints",
          description: "Needs urgent assessment.",
        },
      ],
      basic: [
        {
          symptom: "Red, painful, no blisters",
          description: "Cool 20 min. Light cover.",
        },
        {
          symptom: "Small blister patch",
          description: "Don't pop. Cover loosely.",
        },
        {
          symptom: "Cooling eases pain",
          description: "Keep covered. Recheck tomorrow.",
        },
      ],
    },
  },

  "burn heat": {
    first_instance: { disease: "Heat burn", accuracy: "Guidance" },
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
          symptom: "Bigger than a palm",
          description: "Large burn — urgent medical care.",
        },
        {
          symptom: "On face, hands, or joints",
          description: "Needs urgent assessment.",
        },
      ],
      basic: [
        {
          symptom: "Red, painful, no blisters",
          description: "Cool 20 min. Light cover.",
        },
        {
          symptom: "Small blister patch",
          description: "Don't pop. Cover loosely.",
        },
        {
          symptom: "Cooling eases pain",
          description: "Keep covered. Recheck tomorrow.",
        },
      ],
    },
  },

  "burn chemical": {
    category: "poison",
    first_instance: { disease: "Chemical burn", accuracy: "Guidance" },
    medical_advice:
      "Brush off dry powder first. Flush with water 20+ minutes. Call for advice.",
    instant_help: [
      { step: 1, info: "Move away from the chemical. Avoid spreading it." },
      { step: 2, info: "Brush off dry powder before using water." },
      { step: 3, info: "Remove contaminated clothes carefully." },
      { step: 4, info: "Flush with cool running water for 20+ minutes." },
      { step: 5, info: "Don't rub in creams or neutralize with other chemicals." },
      { step: 6, info: "Call poison control or emergency. Keep the product label." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Eyes also exposed",
          description: "Rinse eyes 15+ min — emergency.",
        },
        {
          symptom: "Trouble breathing after fumes",
          description: "Call emergency now.",
        },
        {
          symptom: "Deep blistering or white skin",
          description: "Urgent hospital care.",
        },
        {
          symptom: "Large area soaked",
          description: "Call emergency / poison control.",
        },
      ],
      basic: [
        {
          symptom: "Small splash, mild sting",
          description: "Flush 20 min. Still get advice.",
        },
        {
          symptom: "Redness after rinse",
          description: "Cover loosely. Recheck with hotline.",
        },
        {
          symptom: "Household cleaner, tiny amount",
          description: "Rinse well. Call if unsure.",
        },
      ],
    },
  },

  "burn electrical": {
    first_instance: { disease: "Electrical burn", accuracy: "Guidance" },
    medical_advice:
      "Power off first. Always get checked — injury can be inside.",
    instant_help: [
      { step: 1, info: "Do not touch them until power is off / safe." },
      { step: 2, info: "Call emergency — electrical injury needs assessment." },
      { step: 3, info: "Once safe, check breathing and responsiveness." },
      { step: 4, info: "Cool any visible burns with water — no ice." },
      { step: 5, info: "Cover burns loosely. Look for entry and exit marks." },
      {
        step: 6,
        info: "If unresponsive and not breathing — start CPR.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Still in contact with power",
          description: "Don't touch — cut power / call emergency.",
        },
        {
          symptom: "Irregular pulse or collapse",
          description: "Heart risk — emergency + CPR if needed.",
        },
        {
          symptom: "Entry and exit burn marks",
          description: "Internal injury possible — hospital.",
        },
        {
          symptom: "Lightning strike",
          description: "Call emergency even if they seem OK.",
        },
      ],
      basic: [
        {
          symptom: "Tiny spark, tiny mark",
          description: "Still get clinical check same day.",
        },
        {
          symptom: "Feels fine after shock",
          description: "Delayed heart issues possible — get checked.",
        },
        {
          symptom: "Mild skin redness only",
          description: "Cool, cover, seek assessment.",
        },
      ],
    },
  },

  "burn sun": {
    first_instance: { disease: "Sunburn", accuracy: "Guidance" },
    medical_advice:
      "Cool water, shade, fluids. Blisters or fever? Escalate care.",
    instant_help: [
      { step: 1, info: "Get out of the sun into shade or indoors." },
      { step: 2, info: "Cool skin with cool (not ice) water or compresses." },
      { step: 3, info: "Drink water. Avoid alcohol." },
      { step: 4, info: "Don't pop blisters. Loose cotton clothing helps." },
      { step: 5, info: "Moisturizer or aloe only on unbroken skin if tolerated." },
      {
        step: 6,
        info: "Large blisters, fever, confusion, or baby/elderly — seek care.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Fever, chills, or confusion",
          description: "Possible heat illness — urgent care.",
        },
        {
          symptom: "Large blistered areas",
          description: "Needs medical assessment.",
        },
        {
          symptom: "Severe swelling of face",
          description: "Seek urgent care.",
        },
        {
          symptom: "Infant or elderly hard hit",
          description: "Lower threshold — get checked.",
        },
      ],
      basic: [
        {
          symptom: "Red, hot, no blisters",
          description: "Cool, hydrate, stay shaded.",
        },
        {
          symptom: "Mild sting after beach day",
          description: "Cool compress. Loose clothes.",
        },
        {
          symptom: "Peeling skin later",
          description: "Don't peel forcibly. Keep moisturized.",
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

  "insect bite": {
    first_instance: { disease: "Insect bite or sting", accuracy: "Guidance" },
    medical_advice:
      "Remove stinger if seen. Ice and watch for allergy. Hard to breathe? Call.",
    instant_help: [
      { step: 1, info: "Move away from bees/wasps. Stay calm." },
      { step: 2, info: "Scrape out a visible stinger — don't squeeze with tweezers." },
      { step: 3, info: "Wash with soap and water. Cool with ice wrapped in cloth." },
      { step: 4, info: "Elevate the area if swollen. Antihistamine if usually safe for them." },
      {
        step: 5,
        info: "If they have an epinephrine auto-injector for allergy — use it for severe signs.",
      },
      {
        step: 6,
        info: "Face/tongue swelling, wheeze, or faintness — call emergency.",
      },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Face, lips, or tongue swelling",
          description: "Anaphylaxis risk — call now.",
        },
        {
          symptom: "Wheeze or can't breathe",
          description: "Emergency — epinephrine if prescribed.",
        },
        {
          symptom: "Dizzy or collapsing",
          description: "Severe reaction — call emergency.",
        },
        {
          symptom: "Many stings at once",
          description: "Higher risk — get urgent care.",
        },
      ],
      basic: [
        {
          symptom: "Local redness and itch",
          description: "Ice, wash, don't scratch hard.",
        },
        {
          symptom: "Mild swelling at the site",
          description: "Elevate. Recheck over hours.",
        },
        {
          symptom: "Tick still attached",
          description: "Pull straight out with fine tweezers. Save the tick.",
        },
      ],
    },
  },

  "other bite": {
    first_instance: { disease: "Animal or human bite", accuracy: "Guidance" },
    medical_advice:
      "Wash well. Skin broken? Get checked same day — infection risk is high.",
    instant_help: [
      { step: 1, info: "Get to safety. Don't chase the animal." },
      { step: 2, info: "Press to stop bleeding if needed." },
      { step: 3, info: "Wash with soap and running water for 5+ minutes." },
      { step: 4, info: "Cover with a clean dressing." },
      {
        step: 5,
        info: "Note animal type, time, and vaccine status if known.",
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
          symptom: "Face, hand, or joint bite",
          description: "High infection risk — urgent care.",
        },
        {
          symptom: "Spreading redness or fever",
          description: "Infection rising — seek care now.",
        },
        {
          symptom: "Wild animal or bat",
          description: "Rabies risk — emergency assessment.",
        },
      ],
      basic: [
        {
          symptom: "Shallow scratch, little blood",
          description: "Wash well. Cover. Watch 48 hours.",
        },
        {
          symptom: "Cat bite puncture",
          description: "Small hole, high infection — still get checked.",
        },
        {
          symptom: "Human bite broke skin",
          description: "Clean and get clinical advice same day.",
        },
      ],
    },
  },

  "allergy food": {
    first_instance: { disease: "Food allergy reaction", accuracy: "Guidance" },
    medical_advice:
      "Severe swelling or breathing trouble? Epinephrine if prescribed — call emergency.",
    instant_help: [
      { step: 1, info: "Stop eating the food. Call emergency if severe signs." },
      {
        step: 2,
        info: "Use epinephrine auto-injector in the outer thigh if prescribed for anaphylaxis.",
      },
      { step: 3, info: "Lie them down with legs raised unless breathing is hard — then sit up." },
      { step: 4, info: "Call emergency even if epinephrine helped." },
      { step: 5, info: "Second dose only if their plan allows and help is delayed." },
      { step: 6, info: "Don't give more of the trigger food. Stay with them." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Throat tightness or wheeze",
          description: "Anaphylaxis — epinephrine + call.",
        },
        {
          symptom: "Face or tongue swelling",
          description: "Emergency now.",
        },
        {
          symptom: "Vomiting with breathing trouble",
          description: "Severe reaction — call.",
        },
        {
          symptom: "Sudden faintness",
          description: "Shock risk — emergency.",
        },
      ],
      basic: [
        {
          symptom: "Mild hives only",
          description: "Antihistamine if usually safe. Watch closely.",
        },
        {
          symptom: "Itchy mouth after a bite",
          description: "Stop eating. Escalate if it spreads.",
        },
        {
          symptom: "Known mild allergy pattern",
          description: "Follow their care plan. Have epinephrine ready.",
        },
      ],
    },
  },

  "allergy sting": {
    first_instance: {
      disease: "Allergy to insect sting",
      accuracy: "Guidance",
    },
    medical_advice:
      "Past severe allergy + new sting? Epinephrine if prescribed — call emergency.",
    instant_help: [
      { step: 1, info: "Move away from the insect. Scrape out stinger if seen." },
      {
        step: 2,
        info: "Use epinephrine auto-injector immediately if this is their severe allergy.",
      },
      { step: 3, info: "Call emergency. Stay with them." },
      { step: 4, info: "Ice the site. Keep them calm and still." },
      { step: 5, info: "Second epinephrine only if their plan says so." },
      { step: 6, info: "Even if they improve — hospital check after epinephrine." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Wheeze or can't speak",
          description: "Anaphylaxis — call now.",
        },
        {
          symptom: "Whole-body hives fast",
          description: "Severe reaction — epinephrine + call.",
        },
        {
          symptom: "Swelling far from the sting",
          description: "Systemic allergy — emergency.",
        },
        {
          symptom: "Known anaphylaxis history",
          description: "Don't wait for peak symptoms — act.",
        },
      ],
      basic: [
        {
          symptom: "Swelling only at sting site",
          description: "Ice and clean. Watch 30–60 min.",
        },
        {
          symptom: "Mild itch, no breathing issue",
          description: "Antihistamine if safe. Stay alert.",
        },
        {
          symptom: "First sting ever, mild",
          description: "Monitor. Seek care if it worsens.",
        },
      ],
    },
  },

  "allergy medicine": {
    first_instance: { disease: "Medicine allergy", accuracy: "Guidance" },
    medical_advice:
      "Stop the medicine. Breathing or swelling trouble? Call emergency.",
    instant_help: [
      { step: 1, info: "Stop the suspected medicine. Don't take another dose." },
      {
        step: 2,
        info: "Use epinephrine if prescribed and signs are severe (swelling, wheeze, faint).",
      },
      { step: 3, info: "Call emergency for severe signs — or urgent care for spreading rash." },
      { step: 4, info: "Keep the medicine packaging for clinicians." },
      { step: 5, info: "Note time of dose and when symptoms started." },
      { step: 6, info: "Don't restart the drug until a clinician clears it." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Throat swelling or wheeze",
          description: "Emergency — epinephrine if prescribed.",
        },
        {
          symptom: "Blistering rash or peeling skin",
          description: "Serious drug reaction — emergency care.",
        },
        {
          symptom: "Fever with widespread rash",
          description: "Urgent medical assessment.",
        },
        {
          symptom: "Collapse after a dose",
          description: "Call emergency now.",
        },
      ],
      basic: [
        {
          symptom: "Mild itchy rash",
          description: "Stop drug. Contact a clinician today.",
        },
        {
          symptom: "Nausea without breathing issue",
          description: "May be side effect — still get advice.",
        },
        {
          symptom: "Known mild sensitivity",
          description: "Avoid the drug. Confirm with a clinician.",
        },
      ],
    },
  },

  "allergy unknown": {
    first_instance: { disease: "Allergic reaction", accuracy: "Guidance" },
    medical_advice:
      "Hard to breathe or swelling of face/tongue? Call emergency now.",
    instant_help: [
      { step: 1, info: "Call emergency if breathing or swallowing is hard." },
      {
        step: 2,
        info: "Use epinephrine auto-injector if they have one for anaphylaxis.",
      },
      { step: 3, info: "Help them sit up if breathless; lie down if faint (legs raised)." },
      { step: 4, info: "Remove any obvious trigger nearby (food, insect, drug)." },
      { step: 5, info: "Stay with them. Watch breathing and alertness." },
      { step: 6, info: "Even mild cases that spread fast need urgent advice." },
    ],
    symptoms_option: {
      critical: [
        {
          symptom: "Can't breathe or swallow",
          description: "Emergency now.",
        },
        {
          symptom: "Face or tongue swelling",
          description: "Airway risk — call.",
        },
        {
          symptom: "Sudden widespread hives + vomit",
          description: "Severe reaction — emergency.",
        },
        {
          symptom: "Grey or blue lips",
          description: "Low oxygen — call and stay ready for CPR.",
        },
      ],
      basic: [
        {
          symptom: "Mild local itch",
          description: "Watch 30 min. Escalate if it spreads.",
        },
        {
          symptom: "A few hives, breathing OK",
          description: "Antihistamine if safe. Keep watching.",
        },
        {
          symptom: "Unclear trigger, mild only",
          description: "Note foods/drugs/insects today for clinicians.",
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
