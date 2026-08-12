/**
 * Quick options that need a subtype picker (like Poison).
 * Only groups with real first-aid differences belong here.
 */

export const QUICK_TYPE_GROUPS = {
  poison: {
    id: "poison",
    eyebrow: "Poison help",
    title: "What kind of poison?",
    subtitle: "Pick one — get steps in seconds.",
    accent: "emergency",
    showPoisonHotline: true,
    types: [
      {
        id: "swallowed",
        key: "poison swallowed",
        label: "Swallowed",
        hint: "Pills, cleaner, liquid",
        icon: "Pill",
      },
      {
        id: "skin",
        key: "poison skin",
        label: "On skin",
        hint: "Splash or powder",
        icon: "Droplet",
      },
      {
        id: "eyes",
        key: "poison eyes",
        label: "In eyes",
        hint: "Splash or fumes",
        icon: "Eye",
      },
      {
        id: "inhaled",
        key: "poison inhaled",
        label: "Inhaled",
        hint: "Gas, smoke, fumes",
        icon: "Wind",
      },
      {
        id: "food",
        key: "poison food",
        label: "Food / plant",
        hint: "Mushroom, berry, meal",
        icon: "Leaf",
      },
      {
        id: "unknown",
        key: "poison unknown",
        label: "Unknown",
        hint: "Not sure — act fast",
        icon: "HelpCircle",
      },
    ],
  },

  burn: {
    id: "burn",
    eyebrow: "Burn help",
    title: "What kind of burn?",
    subtitle: "Type changes the first steps.",
    accent: "emergency",
    showPoisonHotline: false,
    types: [
      {
        id: "heat",
        key: "burn heat",
        label: "Heat / fire",
        hint: "Flame, hot liquid, steam",
        icon: "Flame",
      },
      {
        id: "chemical",
        key: "burn chemical",
        label: "Chemical",
        hint: "Acid, cleaner, battery",
        icon: "FlaskConical",
      },
      {
        id: "electrical",
        key: "burn electrical",
        label: "Electrical",
        hint: "Outlet, wire, lightning",
        icon: "Zap",
      },
      {
        id: "sun",
        key: "burn sun",
        label: "Sunburn",
        hint: "Sun or UV exposure",
        icon: "Sun",
      },
    ],
  },

  bite: {
    id: "bite",
    eyebrow: "Bite help",
    title: "What kind of bite?",
    subtitle: "Animal type changes the risk.",
    accent: "emergency",
    showPoisonHotline: false,
    types: [
      {
        id: "dog",
        key: "dog bite",
        label: "Dog",
        hint: "Pet or stray dog",
        icon: "Dog",
      },
      {
        id: "snake",
        key: "snake bite",
        label: "Snake",
        hint: "Treat as venomous",
        icon: "Worm",
      },
      {
        id: "insect",
        key: "insect bite",
        label: "Insect / bee",
        hint: "Sting, spider, tick",
        icon: "Bug",
      },
      {
        id: "other",
        key: "other bite",
        label: "Other / unknown",
        hint: "Cat, human, wildlife",
        icon: "HelpCircle",
      },
    ],
  },

  allergy: {
    id: "allergy",
    eyebrow: "Allergy help",
    title: "What triggered it?",
    subtitle: "Severe allergy can escalate fast.",
    accent: "emergency",
    showPoisonHotline: false,
    types: [
      {
        id: "food",
        key: "allergy food",
        label: "Food",
        hint: "Nuts, shellfish, meal",
        icon: "Utensils",
      },
      {
        id: "sting",
        key: "allergy sting",
        label: "Insect sting",
        hint: "Bee, wasp, ant",
        icon: "Bug",
      },
      {
        id: "medicine",
        key: "allergy medicine",
        label: "Medicine",
        hint: "Antibiotic, vaccine, dose",
        icon: "Syringe",
      },
      {
        id: "unknown",
        key: "allergy unknown",
        label: "Unknown",
        hint: "Not sure — act fast",
        icon: "HelpCircle",
      },
    ],
  },
};
