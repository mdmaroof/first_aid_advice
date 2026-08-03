/** Shared helpers for first-aid API results. */

export const MAX_SYMPTOM_LENGTH = 400;

export function normalizeSymptoms(symptomsOption) {
  if (!symptomsOption) {
    return { critical: [], basic: [] };
  }

  if (Array.isArray(symptomsOption)) {
    return { critical: symptomsOption, basic: [] };
  }

  return {
    critical: Array.isArray(symptomsOption.critical)
      ? symptomsOption.critical
      : [],
    basic: Array.isArray(symptomsOption.basic)
      ? symptomsOption.basic
      : Array.isArray(symptomsOption.not_serious)
        ? symptomsOption.not_serious
        : [],
  };
}

function normalizeSymptomList(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => ({
      symptom: String(item?.symptom ?? "").trim(),
      description: String(item?.description ?? "").trim(),
    }))
    .filter((item) => item.symptom);
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((item, index) => ({
      step: Number(item?.step) || index + 1,
      info: String(item?.info ?? "").trim(),
    }))
    .filter((item) => item.info);
}

/**
 * Normalize + lightly validate a model / quick-aid payload.
 * Returns null if the payload is unusable.
 */
export function normalizeAidResult(raw) {
  if (!raw || typeof raw !== "object") return null;

  const disease = String(raw.first_instance?.disease ?? "").trim();
  const medical_advice = String(raw.medical_advice ?? "").trim();
  const instant_help = normalizeSteps(raw.instant_help);
  const symptoms = normalizeSymptoms(raw.symptoms_option);

  if (!disease && !medical_advice && instant_help.length === 0) {
    return null;
  }

  return {
    first_instance: {
      disease: disease || "Urgent concern",
      accuracy: String(raw.first_instance?.accuracy ?? "Guidance").trim() || "Guidance",
    },
    medical_advice,
    instant_help,
    symptoms_option: {
      critical: normalizeSymptomList(symptoms.critical),
      basic: normalizeSymptomList(symptoms.basic),
    },
  };
}

export function clampSymptomInput(input) {
  return String(input ?? "")
    .trim()
    .slice(0, MAX_SYMPTOM_LENGTH);
}
