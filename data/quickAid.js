/** Curated first-aid responses for homepage quick picks — no API needed. */

const normalizeKey = (input) => input.trim().toLowerCase();

export const QUICK_AID_DATA = {
  "heart pain": {
    first_instance: { disease: "Possible cardiac concern", accuracy: "Guidance" },
    medical_advice:
      "Chest pain can signal a heart attack. If pain is severe, crushing, or comes with breathlessness or sweating, call emergency services immediately.",
    instant_help: [
      { step: 1, info: "Have the person sit or rest in a comfortable position. Loosen tight clothing." },
      { step: 2, info: "If they have prescribed heart medication (e.g. nitroglycerin), help them take it as directed." },
      { step: 3, info: "Call emergency services if pain lasts more than a few minutes, spreads to arm/jaw, or they feel faint." },
      { step: 4, info: "Stay calm, monitor breathing, and do not give food or drink unless advised." },
    ],
    symptoms_option: [
      { symptom: "Crushing chest pressure", description: "Heavy, squeezing pain in the centre of the chest." },
      { symptom: "Pain in arm or jaw", description: "Discomfort spreading to the left arm, shoulder, neck, or jaw." },
      { symptom: "Shortness of breath", description: "Difficulty breathing with little exertion or at rest." },
      { symptom: "Cold sweat or nausea", description: "Sudden sweating, vomiting, or feeling very unwell." },
    ],
  },

  "breathing trouble": {
    first_instance: { disease: "Breathing difficulty", accuracy: "Guidance" },
    medical_advice:
      "Trouble breathing is urgent. If lips or face turn blue, the person cannot speak, or breathing stops, call emergency services immediately.",
    instant_help: [
      { step: 1, info: "Help them sit upright — leaning forward often makes breathing easier." },
      { step: 2, info: "Loosen collars or belts. Move to fresh air and away from smoke or strong fumes." },
      { step: 3, info: "If they have an inhaler for asthma or COPD, help them use it as prescribed." },
      { step: 4, info: "Call emergency services if breathing worsens, they become confused, or lips turn blue." },
    ],
    symptoms_option: [
      { symptom: "Wheezing", description: "High-pitched whistling sound when breathing out." },
      { symptom: "Rapid shallow breaths", description: "Breathing fast but not getting enough air." },
      { symptom: "Chest tightness", description: "Feeling unable to take a full breath." },
      { symptom: "Blue lips or nails", description: "Sign of dangerously low oxygen — call 911 now." },
    ],
  },

  bleeding: {
    first_instance: { disease: "Bleeding wound", accuracy: "Guidance" },
    medical_advice:
      "Most bleeding can be controlled with direct pressure. Call emergency services for heavy bleeding that does not slow, spurting blood, or signs of shock.",
    instant_help: [
      { step: 1, info: "Wear gloves if available. Apply firm, direct pressure with a clean cloth or dressing." },
      { step: 2, info: "Keep pressure for at least 10 minutes without peeking. Elevate the limb if possible." },
      { step: 3, info: "If blood soaks through, add more cloth on top — do not remove the first layer." },
      { step: 4, info: "Call emergency services if bleeding is severe, from the neck, or the person feels faint." },
    ],
    symptoms_option: [
      { symptom: "Spurting blood", description: "Pulsing spray may indicate an artery — urgent help needed." },
      { symptom: "Pale, cold skin", description: "Early sign of shock from blood loss." },
      { symptom: "Dizziness or weakness", description: "May mean significant blood loss even if wound looks small." },
      { symptom: "Object stuck in wound", description: "Do not remove it — stabilise and seek medical care." },
    ],
  },

  burn: {
    first_instance: { disease: "Burn injury", accuracy: "Guidance" },
    medical_advice:
      "Cool the burn with running lukewarm water for 20 minutes. Do not use ice, butter, or toothpaste. Call emergency services for large, deep, or facial burns.",
    instant_help: [
      { step: 1, info: "Cool the burn under cool running water for at least 20 minutes." },
      { step: 2, info: "Remove jewellery and loose clothing near the burn before swelling starts." },
      { step: 3, info: "Cover loosely with a clean, non-fluffy dressing or cling film." },
      { step: 4, info: "Call emergency services for burns on face, hands, genitals, or larger than the palm." },
    ],
    symptoms_option: [
      { symptom: "Blistering skin", description: "Fluid-filled blisters — do not pop them." },
      { symptom: "White or charred skin", description: "May indicate a deep burn needing urgent care." },
      { symptom: "Chemical or electrical burn", description: "Rinse and call emergency services — do not delay." },
      { symptom: "Burn with smoke inhalation", description: "Coughing, soot around nose — get medical help." },
    ],
  },

  choking: {
    first_instance: { disease: "Choking", accuracy: "Guidance" },
    medical_advice:
      "A person who cannot cough, speak, or breathe needs immediate help. Call emergency services and start back blows and abdominal thrusts if trained.",
    instant_help: [
      { step: 1, info: "Encourage coughing if they can still breathe, speak, or cough forcefully." },
      { step: 2, info: "If severe: give up to 5 sharp back blows between the shoulder blades." },
      { step: 3, info: "If ineffective: give up to 5 abdominal thrusts (Heimlich manoeuvre)." },
      { step: 4, info: "Call emergency services. If they become unresponsive, start CPR and shout for help." },
    ],
    symptoms_option: [
      { symptom: "Silent choking", description: "Cannot speak or cough — airway may be fully blocked." },
      { symptom: "Clutching throat", description: "Universal sign of choking — act immediately." },
      { symptom: "Blue lips or skin", description: "Lack of oxygen — call 911 and begin first aid." },
      { symptom: "Weak or ineffective cough", description: "Partial blockage — monitor closely and be ready to act." },
    ],
  },

  headache: {
    first_instance: { disease: "Severe headache", accuracy: "Guidance" },
    medical_advice:
      "Most headaches are not emergencies. Call emergency services for sudden worst-ever headache, with confusion, weakness, or after a head injury.",
    instant_help: [
      { step: 1, info: "Have them rest in a quiet, dim room. Offer water if they are fully alert." },
      { step: 2, info: "A cool cloth on the forehead may help. Avoid bright screens and loud noise." },
      { step: 3, info: "Over-the-counter pain relief may help if they have no allergies and can swallow safely." },
      { step: 4, info: "Seek urgent care if headache is sudden and severe, or comes with fever, stiff neck, or vision changes." },
    ],
    symptoms_option: [
      { symptom: "Thunderclap headache", description: "Instant worst headache of life — call emergency services." },
      { symptom: "Stiff neck with fever", description: "Possible serious infection — urgent medical review." },
      { symptom: "Vision or speech changes", description: "May signal stroke — call emergency services." },
      { symptom: "Head injury before pain", description: "Even mild injury with headache needs medical assessment." },
    ],
  },

  "dog bite": {
    first_instance: { disease: "Dog bite", accuracy: "Guidance" },
    medical_advice:
      "Dog bites can cause infection and nerve damage. Wash the wound, control bleeding, and seek medical care — especially for deep, face, or hand bites.",
    instant_help: [
      { step: 1, info: "Move to safety. Do not chase the animal. Note breed and location if possible for authorities." },
      { step: 2, info: "Wash the wound gently with soap and running water for several minutes." },
      { step: 3, info: "Apply pressure to stop bleeding. Cover with a clean dressing." },
      { step: 4, info: "See a doctor for tetanus/rabies risk, deep wounds, or if the bite is on face, hands, or joints." },
    ],
    symptoms_option: [
      { symptom: "Deep puncture wounds", description: "Higher infection risk — medical care usually needed." },
      { symptom: "Swelling or redness spreading", description: "Sign of infection developing." },
      { symptom: "Unknown vaccination status", description: "Rabies risk — contact health services promptly." },
      { symptom: "Loss of movement or numbness", description: "Possible nerve or tendon damage." },
    ],
  },

  "snake bite": {
    first_instance: { disease: "Snake bite", accuracy: "Guidance" },
    medical_advice:
      "Treat all snake bites as potentially venomous until assessed. Call emergency services, keep the person still, and do not cut, suck, or apply a tourniquet.",
    instant_help: [
      { step: 1, info: "Call emergency services immediately. Keep the person calm and as still as possible." },
      { step: 2, info: "Remove tight jewellery or clothing near the bite before swelling." },
      { step: 3, info: "Keep the bitten limb below heart level if practical. Immobilise with a splint." },
      { step: 4, info: "Do not cut the wound, suck venom, use ice, or try to catch the snake. Note appearance if safe." },
    ],
    symptoms_option: [
      { symptom: "Fang marks or local pain", description: "Two puncture marks may be visible with swelling." },
      { symptom: "Nausea or vomiting", description: "Early sign of venom — urgent hospital care needed." },
      { symptom: "Drooping eyelids or blurred vision", description: "Neurotoxic venom signs — emergency help now." },
      { symptom: "Difficulty breathing", description: "Life-threatening — call 911 and monitor airway." },
    ],
  },
};

export function getQuickAidData(input) {
  return QUICK_AID_DATA[normalizeKey(input)] ?? null;
}

export function isQuickAidOption(input) {
  return normalizeKey(input) in QUICK_AID_DATA;
}
