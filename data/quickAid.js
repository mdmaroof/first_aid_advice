/** Curated first-aid responses for homepage quick picks — no API needed. */

const normalizeKey = (input) => input.trim().toLowerCase();

export const QUICK_AID_DATA = {
  "heart pain": {
    first_instance: { disease: "Possible cardiac event", accuracy: "Guidance" },
    medical_advice:
      "Chest pain can be a heart attack, especially if it is crushing, lasts more than a few minutes, or comes with breathlessness, sweating, nausea, or pain spreading to the arm, jaw, or back. Call emergency services immediately — do not wait to see if it passes. Time lost is heart muscle lost.",
    instant_help: [
      {
        step: 1,
        info: "Check the scene is safe. Ask if they have chest pain now, when it started, and whether they have heart disease or take nitroglycerin.",
      },
      {
        step: 2,
        info: "Have them stop activity, sit or lie down in a comfortable position, and loosen tight clothing around the neck and chest.",
      },
      {
        step: 3,
        info: "If they are alert, not allergic to aspirin, and have no bleeding disorder, give one adult aspirin (160–325 mg) to chew slowly — do not give aspirin if they are under 16 or aspirin was forbidden by their doctor.",
      },
      {
        step: 4,
        info: "If they have prescribed nitroglycerin, help them take one dose under the tongue as directed. Wait 5 minutes; if pain continues, they may take a second dose if their doctor allows.",
      },
      {
        step: 5,
        info: "Call emergency services at once if pain is severe, lasts more than 5 minutes, spreads to arm/jaw/back, or they feel faint, nauseous, or short of breath. Do not drive them yourself unless there is no other option.",
      },
      {
        step: 6,
        info: "Stay with them, keep them calm, and monitor breathing and responsiveness. If they become unresponsive and are not breathing normally, start CPR and use an AED if available.",
      },
      {
        step: 7,
        info: "Do not give food, drink, or un-prescribed medication. Note the time symptoms started — this helps paramedics and hospital staff.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Crushing chest pressure",
        description:
          "Heavy, squeezing, or burning pain in the centre of the chest that may feel like a weight — classic heart attack sign.",
      },
      {
        symptom: "Pain spreading to arm, jaw, or back",
        description:
          "Discomfort radiating to the left arm (sometimes both), shoulder, neck, jaw, or between the shoulder blades.",
      },
      {
        symptom: "Shortness of breath",
        description:
          "Gasping or difficulty breathing with little exertion, sometimes without obvious chest pain (more common in women).",
      },
      {
        symptom: "Cold sweat, nausea, or dizziness",
        description:
          "Sudden clamminess, vomiting, lightheadedness, or a sense of doom alongside chest discomfort.",
      },
      {
        symptom: "Irregular or very fast pulse",
        description:
          "Heart racing, fluttering, or an unusually weak pulse — may signal dangerous arrhythmia.",
      },
    ],
  },

  "breathing trouble": {
    first_instance: { disease: "Breathing difficulty", accuracy: "Guidance" },
    medical_advice:
      "Difficulty breathing can become life-threatening quickly. Call emergency services if the person cannot speak full sentences, lips or fingernails turn blue or grey, they are confused, or breathing stops. Asthma, allergic reaction, heart failure, and choking are common causes — treat the situation as urgent until a clinician assesses them.",
    instant_help: [
      {
        step: 1,
        info: "Help them sit upright — leaning slightly forward with hands on knees often opens the airway better than lying flat. Do not lay them down if they are struggling to breathe.",
      },
      {
        step: 2,
        info: "Loosen tight clothing at the neck and waist. Move them to fresh air; open windows and move away from smoke, dust, strong fumes, or known allergens.",
      },
      {
        step: 3,
        info: "If they have an asthma or COPD inhaler, shake it, attach a spacer if they have one, and help them take 1 puff with slow deep breaths. Wait about a minute between puffs as directed on their action plan (often up to 4–10 puffs for an attack).",
      },
      {
        step: 4,
        info: "If they have a prescribed epinephrine auto-injector (e.g. for anaphylaxis) and show swelling of face/lips, hives, or wheeze after food or a sting, help them use it immediately in the outer thigh — then call emergency services even if they improve.",
      },
      {
        step: 5,
        info: "Encourage slow, controlled breathing if they are panicking — breathe with them: in through the nose for 4 counts, out through pursed lips for 6.",
      },
      {
        step: 6,
        info: "Call emergency services if breathing worsens, they cannot speak, chest muscles pull in visibly (retractions), lips turn blue, or they become drowsy or confused.",
      },
      {
        step: 7,
        info: "If they stop breathing or lose consciousness, lay them on a firm surface, open the airway, and start CPR. Send someone to fetch an AED if one is nearby.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Wheezing",
        description:
          "High-pitched whistling, especially when breathing out — common in asthma or allergic reaction.",
      },
      {
        symptom: "Cannot speak in full sentences",
        description:
          "Having to pause every few words to breathe — sign of a severe attack needing urgent help.",
      },
      {
        symptom: "Blue or grey lips and nails",
        description:
          "Cyanosis means dangerously low oxygen — call emergency services immediately.",
      },
      {
        symptom: "Chest tightness or retractions",
        description:
          "Skin sucking in between ribs or at the neck with each breath — severe respiratory distress.",
      },
      {
        symptom: "Swelling of face or tongue",
        description:
          "May indicate anaphylaxis — use epinephrine if prescribed and call emergency services.",
      },
    ],
  },

  bleeding: {
    first_instance: { disease: "Bleeding wound", accuracy: "Guidance" },
    medical_advice:
      "Most external bleeding stops with firm, direct pressure. Call emergency services for spurting blood, bleeding that does not slow after 10–15 minutes of pressure, a wound on the neck or chest, amputation, or signs of shock (pale, cold, clammy skin; rapid weak pulse; confusion). Wear gloves if available to protect yourself.",
    instant_help: [
      {
        step: 1,
        info: "Make sure the scene is safe. Put on disposable gloves if you have them. If the person is responsive, have them apply pressure themselves if they can — you can guide them.",
      },
      {
        step: 2,
        info: "Expose the wound. Remove or cut clothing around it. For a small cut, wash around (not into) the wound with clean running water if you will seek care later.",
      },
      {
        step: 3,
        info: "Place a clean dressing, cloth, or gauze directly on the wound and press firmly with both hands — use your body weight on larger wounds. Do not lift the pad to check; that restarts bleeding.",
      },
      {
        step: 4,
        info: "Maintain continuous pressure for at least 10–15 minutes. If blood soaks through, add more material on top without removing the first layer.",
      },
      {
        step: 5,
        info: "If the wound is on an arm or leg and there is no fracture suspected, raise the limb above heart level while keeping pressure on the wound.",
      },
      {
        step: 6,
        info: "Once bleeding slows, bandage the dressing snugly in place. If an object is embedded (glass, knife), do not remove it — build padding around the object and bandage over it.",
      },
      {
        step: 7,
        info: "Treat for shock: lay them down, keep them warm with a blanket, and raise legs about 30 cm unless the leg is injured. Call emergency services for severe bleeding, weakness, or altered consciousness.",
      },
      {
        step: 8,
        info: "A tourniquet is only for life-threatening limb bleeding that cannot be controlled by pressure — place 5–8 cm above the wound, tighten until bleeding stops, note the time applied, and get emergency care immediately.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Spurting or pulsing blood",
        description:
          "Bright red blood spraying with the heartbeat suggests an artery — apply heavy pressure and call emergency services.",
      },
      {
        symptom: "Pale, cold, clammy skin",
        description:
          "Early shock from blood loss — person may feel thirsty, anxious, or nauseous.",
      },
      {
        symptom: "Dizziness or passing out",
        description:
          "May mean significant blood loss even if the wound looks small — lie them down and call for help.",
      },
      {
        symptom: "Object stuck in the wound",
        description:
          "Stabilise in place; removing it can worsen bleeding. Bandage around it and seek urgent care.",
      },
      {
        symptom: "Bleeding from nose, ears, or mouth after injury",
        description:
          "Possible skull fracture or internal injury — keep them still and call emergency services.",
      },
    ],
  },

  burn: {
    first_instance: { disease: "Burn injury", accuracy: "Guidance" },
    medical_advice:
      "Cooling within the first hour improves outcomes. Run cool (not icy) water over the burn for 20 minutes. Call emergency services for burns larger than the person’s palm, full-thickness (white/charred) burns, burns on the face, hands, feet, genitals, or joints, chemical or electrical burns, or if the person is a child or elderly. Never use ice, butter, toothpaste, or ointments on a fresh burn.",
    instant_help: [
      {
        step: 1,
        info: "Stop the burning process — remove the person from heat, flames, or hot liquid. If clothing is on fire, get them to stop, drop, and roll on the ground to smother flames.",
      },
      {
        step: 2,
        info: "Cool the burn under cool running tap water for a full 20 minutes. If running water is unavailable, use cool clean water in a bowl and refresh it. Do not use ice — it can deepen tissue damage.",
      },
      {
        step: 3,
        info: "While cooling, gently remove rings, watches, and loose clothing near the burn before swelling starts. Do not pull clothing stuck to the skin — cut around it.",
      },
      {
        step: 4,
        info: "After cooling, cover loosely with a clean, non-fluffy dressing, cling film (layer over the burn, not wrapped tightly), or a clean plastic bag for hand burns.",
      },
      {
        step: 5,
        info: "Do not break blisters, apply creams, butter, or home remedies. Give over-the-counter pain relief if they are alert and not allergic.",
      },
      {
        step: 6,
        info: "For chemical burns, brush off dry powder first, then flush with large amounts of running water for at least 20 minutes while removing contaminated clothing.",
      },
      {
        step: 7,
        info: "For electrical burns, ensure the power is off before touching the person. There may be entry and exit wounds and internal injury — always seek medical assessment.",
      },
      {
        step: 8,
        info: "Call emergency services if the burn is deep, circumferential (around a limb), accompanied by smoke inhalation (cough, soot around nose/mouth), or the person is unresponsive — start CPR if needed.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Red, painful skin without blisters",
        description:
          "Superficial (first-degree) burn — painful but usually heals with cooling and simple dressing.",
      },
      {
        symptom: "Blistering or wet-looking skin",
        description:
          "Partial-thickness (second-degree) burn — do not pop blisters; cover and seek care if large or on sensitive areas.",
      },
      {
        symptom: "White, waxy, or charred skin",
        description:
          "Deep (third-degree) burn — may be less painful due to nerve damage; needs urgent hospital care.",
      },
      {
        symptom: "Coughing or singed nasal hairs",
        description:
          "Possible airway burn from smoke or hot gases — call emergency services even if skin burns seem minor.",
      },
      {
        symptom: "Burn from chemicals or electricity",
        description:
          "Flush chemicals extensively; electrical burns need ECG monitoring — always get professional assessment.",
      },
    ],
  },

  choking: {
    first_instance: { disease: "Airway obstruction (choking)", accuracy: "Guidance" },
    medical_advice:
      "Mild choking: the person can cough forcefully — encourage coughing and stay with them. Severe choking: they cannot speak, breathe, or cough effectively — call emergency services and begin back blows and abdominal thrusts for adults and children over 1 year. If they become unresponsive, lower them carefully and start CPR, checking the mouth for visible objects between compressions.",
    instant_help: [
      {
        step: 1,
        info: "Ask loudly, “Are you choking?” If they can speak, cough, or breathe, encourage forceful coughing and do not slap their back yet — monitor closely.",
      },
      {
        step: 2,
        info: "If they cannot speak, breathe, or cough, or are making high-pitched or silent sounds, treat as severe choking. Call emergency services or send someone to call — stay with the person.",
      },
      {
        step: 3,
        info: "For an adult or child over 1 year: stand slightly behind and to the side. Lean them forward and give up to 5 firm back blows between the shoulder blades with the heel of your hand.",
      },
      {
        step: 4,
        info: "If back blows fail, stand behind them, place a fist above the navel and below the ribcage, grasp it with your other hand, and give up to 5 sharp inward-upward abdominal thrusts (Heimlich manoeuvre).",
      },
      {
        step: 5,
        info: "Alternate 5 back blows and 5 abdominal thrusts until the object comes out, they can breathe/cough, or they become unresponsive. For pregnant or obese persons, use chest thrusts at the centre of the breastbone instead.",
      },
      {
        step: 6,
        info: "If they collapse, lower them to the ground carefully. Open the airway and look in the mouth — remove only objects you can see clearly. Begin CPR with chest compressions; check the mouth after every 30 compressions.",
      },
      {
        step: 7,
        info: "Even if you dislodge the object, they should be checked by a clinician — internal injury or residual swelling can still block the airway.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Cannot speak or cry",
        description:
          "Complete or near-complete blockage — silent choking is an emergency.",
      },
      {
        symptom: "Hands clutching the throat",
        description:
          "Universal choking sign — act immediately if they cannot cough effectively.",
      },
      {
        symptom: "Weak or silent cough",
        description:
          "Partial blockage that may worsen — be ready to give back blows and thrusts.",
      },
      {
        symptom: "Blue lips, neck, or face",
        description:
          "Brain is being starved of oxygen — call emergency services and start first aid at once.",
      },
      {
        symptom: "Loss of consciousness",
        description:
          "Begin CPR immediately; the airway may still be obstructed.",
      },
    ],
  },

  headache: {
    first_instance: { disease: "Headache — assess for emergency signs", accuracy: "Guidance" },
    medical_advice:
      "Most headaches are tension or migraine and are not emergencies. Call emergency services for a sudden “worst headache of life,” headache after head injury, with confusion, weakness, seizure, fever with stiff neck, or vision/speech changes — these can indicate stroke, bleeding in the brain, or meningitis. When in doubt, seek urgent medical assessment.",
    instant_help: [
      {
        step: 1,
        info: "Ask when the headache started, how severe it is (0–10), and whether it came on suddenly or gradually. Note any head injury, fever, neck stiffness, or neurological symptoms.",
      },
      {
        step: 2,
        info: "If red flags are present (thunderclap onset, confusion, weakness on one side, slurred speech, seizure, fever with stiff neck), call emergency services — do not wait for pain medicine to work.",
      },
      {
        step: 3,
        info: "For a non-emergency headache, help them rest in a quiet, dim room. Offer water — dehydration worsens many headaches.",
      },
      {
        step: 4,
        info: "A cool, damp cloth on the forehead or the back of the neck may ease discomfort. Avoid bright screens, loud noise, and strong smells.",
      },
      {
        step: 5,
        info: "If they are fully alert, not pregnant unless approved by a clinician, and have no kidney/liver issues or allergies, paracetamol (acetaminophen) or ibuprofen may help at standard adult doses — follow package instructions.",
      },
      {
        step: 6,
        info: "Caffeine in small amounts can help some migraines if they usually tolerate it; avoid excess caffeine which can rebound later.",
      },
      {
        step: 7,
        info: "Seek same-day medical care if headache follows a fall, persists or worsens over days, wakes them from sleep, or is unlike any headache they have had before.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Sudden worst-ever headache",
        description:
          "“Thunderclap” reaching maximum intensity within seconds to minutes — possible brain haemorrhage; call emergency services.",
      },
      {
        symptom: "Stiff neck with fever",
        description:
          "Headache with inability to touch chin to chest and high fever — possible meningitis; urgent hospital care.",
      },
      {
        symptom: "Weakness, numbness, or drooping face",
        description:
          "Use FAST (Face, Arms, Speech, Time) — stroke symptoms need emergency care immediately.",
      },
      {
        symptom: "Headache after injury",
        description:
          "Even mild head trauma with worsening pain, vomiting, or drowsiness needs medical assessment.",
      },
      {
        symptom: "Vision changes or confusion",
        description:
          "Blurred vision, double vision, trouble speaking, or altered awareness — treat as urgent.",
      },
    ],
  },

  "dog bite": {
    first_instance: { disease: "Dog bite wound", accuracy: "Guidance" },
    medical_advice:
      "Dog bites crush tissue and push bacteria deep into the wound — infection and nerve/tendon damage are common. All bites that break the skin need medical review within 24 hours when possible. Call emergency services if bleeding is heavy, the face or neck is injured, or the person is weak or faint. Report the bite to local animal control; identify the dog and owner if safe to do so.",
    instant_help: [
      {
        step: 1,
        info: "Move the victim to safety — do not chase or corner the dog. If the animal is still aggressive, close a door or gate between them and call animal control.",
      },
      {
        step: 2,
        info: "If bleeding is present, apply direct pressure with a clean cloth. Elevate the injured limb if practical.",
      },
      {
        step: 3,
        info: "Wash the wound thoroughly with soap and running water for at least 5 minutes. Gently clean from the centre outward; let water run freely over punctures.",
      },
      {
        step: 4,
        info: "If available, apply an antiseptic after washing. Cover with a sterile non-stick dressing. Do not close deep punctures with tape tightly — they often need to drain.",
      },
      {
        step: 5,
        info: "Note the dog’s description, location, owner contact, and vaccination status if known. Take photos of the wound for clinicians and authorities.",
      },
      {
        step: 6,
        info: "See a doctor or urgent care the same day for any bite that breaks skin — especially on hands, face, joints, or genitals. They may prescribe antibiotics, update tetanus, and assess rabies risk.",
      },
      {
        step: 7,
        info: "Watch for infection over the next days: increasing pain, redness spreading, warmth, pus, fever, or red streaks up the limb — return for care immediately if these appear.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Deep puncture wounds",
        description:
          "Small holes can hide serious deep infection — antibiotics are often needed even if the surface looks minor.",
      },
      {
        symptom: "Numbness or trouble moving fingers",
        description:
          "Possible nerve or tendon injury — hand bites need specialist assessment.",
      },
      {
        symptom: "Unknown or stray animal",
        description:
          "Rabies risk depends on region — health services may recommend post-exposure vaccination.",
      },
      {
        symptom: "Spreading redness or fever",
        description:
          "Signs of cellulitis or systemic infection — seek urgent medical care.",
      },
      {
        symptom: "Facial or neck bite",
        description:
          "Higher risk of scarring and serious infection — emergency department evaluation is often needed.",
      },
    ],
  },

  "snake bite": {
    first_instance: { disease: "Snake bite — treat as venomous until proven otherwise", accuracy: "Guidance" },
    medical_advice:
      "Assume venomous until a clinician rules it out. Call emergency services immediately. Keep the person still — movement speeds venom spread. Do not cut the wound, suck venom, use ice, electric shock, or a tight tourniquet. Antivenom and monitoring are hospital treatments. If safe, note snake colour, size, and pattern from a distance — do not try to catch or kill the snake.",
    instant_help: [
      {
        step: 1,
        info: "Call emergency services at once. Keep the person calm and as still as possible — have them sit or lie down. Panic and activity increase heart rate and venom spread.",
      },
      {
        step: 2,
        info: "Move them away from the snake only if needed for safety — do not attempt to capture or kill the snake.",
      },
      {
        step: 3,
        info: "Remove rings, watches, and tight clothing from the bitten limb before swelling starts.",
      },
      {
        step: 4,
        info: "Keep the bitten limb immobilised at roughly heart level — not raised high above the heart and not dangling low. Splint the limb with a board or rolled magazine if available.",
      },
      {
        step: 5,
        info: "If trained and in a region where pressure immobilisation is recommended (e.g. Australian elapid bites), apply a firm elastic bandage over the entire limb from fingers/toes upward, then splint — follow local protocols.",
      },
      {
        step: 6,
        info: "Do not cut, suck, or wash the bite site aggressively (hospital staff may need venom on skin for identification). Do not apply ice or tourniquets unless directed by emergency services.",
      },
      {
        step: 7,
        info: "Mark the edge of swelling or tenderness on the skin with a pen and note the time — this helps clinicians track envenomation.",
      },
      {
        step: 8,
        info: "Monitor breathing, consciousness, and pulse. If they vomit, turn them on their side. Be ready to start CPR if they collapse — even non-venomous bites can cause severe allergic reaction.",
      },
    ],
    symptoms_option: [
      {
        symptom: "Fang marks or local pain",
        description:
          "One or two puncture marks with pain, swelling, or bruising developing over minutes to hours.",
      },
      {
        symptom: "Nausea, vomiting, or sweating",
        description:
          "Systemic effects of venom — urgency increases even if the bite looks minor.",
      },
      {
        symptom: "Drooping eyelids or blurred vision",
        description:
          "Neurotoxic venom (e.g. some cobras, taipans) — can progress to paralysis; emergency care critical.",
      },
      {
        symptom: "Bleeding from gums or nose",
        description:
          "Haemotoxic venom affecting clotting — internal bleeding risk; hospital monitoring essential.",
      },
      {
        symptom: "Difficulty breathing or swallowing",
        description:
          "Airway compromise — call emergency services and prepare to support breathing.",
      },
    ],
  },
};

export function getQuickAidData(input) {
  return QUICK_AID_DATA[normalizeKey(input)] ?? null;
}

export function isQuickAidOption(input) {
  return normalizeKey(input) in QUICK_AID_DATA;
}
