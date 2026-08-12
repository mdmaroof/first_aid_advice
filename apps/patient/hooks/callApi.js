import { getQuickAidData } from "@/data/quickAid";
import {
  clampSymptomInput,
  MAX_SYMPTOM_LENGTH,
  normalizeAidResult,
} from "@/lib/aidResult";

const USE_DEMO_DATA = false;

const getDemoData = (input) => ({
  first_instance: {
    disease: `Assessment needed for “${input}”`,
    accuracy: "Guidance",
  },
  medical_advice:
    "Sudden severe symptoms? Call emergency. Otherwise rest and get advice today.",
  instant_help: [
    { step: 1, info: "Check the scene is safe." },
    { step: 2, info: "Note alertness, breathing, and movement." },
    { step: 3, info: "Sit or lie them in the most comfortable position." },
    {
      step: 4,
      info: "Chest pain, heavy bleed, or confusion? Call emergency.",
    },
    { step: 5, info: "No food, drink, or unprescribed meds unless told." },
    { step: 6, info: "Stay with them. Recheck breathing often." },
  ],
  symptoms_option: {
    critical: [
      {
        symptom: "Getting worse fast",
        description: "Minutes matter — call now.",
      },
      {
        symptom: "Trouble breathing",
        description: "Can't speak full sentences — emergency.",
      },
      {
        symptom: "Chest pain or pressure",
        description: "With sweat or nausea — call now.",
      },
      {
        symptom: "Confusion or hard to wake",
        description: "Treat as urgent.",
      },
    ],
    basic: [
      {
        symptom: "Mild, steady discomfort",
        description: "Rest. Recheck in 30 minutes.",
      },
      {
        symptom: "Familiar mild symptoms",
        description: "Hydrate and rest. Seek advice if unsure.",
      },
      {
        symptom: "Improving with rest",
        description: "Keep watching. Escalate if it returns.",
      },
    ],
  },
});

export const callApi = async (input) => {
  const trimmed = clampSymptomInput(input);

  if (!trimmed) {
    return {
      success: false,
      error: true,
      message: "Type a symptom first.",
      data: null,
    };
  }

  if (String(input ?? "").trim().length > MAX_SYMPTOM_LENGTH) {
    return {
      success: false,
      error: true,
      message: `Keep it under ${MAX_SYMPTOM_LENGTH} characters.`,
      data: null,
    };
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const quickData = getQuickAidData(trimmed);
    if (quickData) {
      const normalized = normalizeAidResult(quickData);
      return { success: true, error: false, message: null, data: normalized };
    }
    return {
      success: false,
      error: true,
      message:
        "You’re offline. Try a quick option above, or call emergency services.",
      data: null,
    };
  }

  try {
    const quickData = getQuickAidData(trimmed);
    if (quickData) {
      const normalized = normalizeAidResult(quickData);
      return { success: true, error: false, message: null, data: normalized };
    }

    if (USE_DEMO_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        error: false,
        message: null,
        data: normalizeAidResult(getDemoData(trimmed)),
      };
    }

    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: trimmed }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: true,
        message: payload?.error || "Something went wrong. Please try again.",
        data: null,
      };
    }

    const normalized = normalizeAidResult(payload);
    if (!normalized) {
      return {
        success: false,
        error: true,
        message: "Couldn’t read that response. Please try again.",
        data: null,
      };
    }

    return { success: true, error: false, message: null, data: normalized };
  } catch (err) {
    console.error(err);
    const offline =
      typeof navigator !== "undefined" && !navigator.onLine
        ? "You’re offline. Try a quick option, or call emergency services."
        : null;
    return {
      success: false,
      error: true,
      message:
        offline || err?.message || "Something went wrong. Please try again.",
      data: null,
    };
  }
};
