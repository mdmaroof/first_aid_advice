import { getQuickAidData } from "@/data/quickAid";

// Flip to false when the DeepSeek API is paid and ready.
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
  try {
    const quickData = getQuickAidData(input);
    if (quickData) {
      return { success: true, error: false, data: quickData };
    }

    if (USE_DEMO_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { success: true, error: false, data: getDemoData(input) };
    }

    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: input }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.error || "Something went wrong. Please try again.";
      alert(message);
      return { success: false, error: true, data: null };
    }

    if (!data) {
      alert("No response received. Please try again.");
      return { success: false, error: true, data: null };
    }

    return { success: true, error: false, data };
  } catch (err) {
    console.error(err);
    alert(err?.message || "Something went wrong. Please try again.");
    return { success: false, error: true, data: null };
  }
};
