import { getQuickAidData } from "@/data/quickAid";

// Flip to false when the DeepSeek API is paid and ready.
const USE_DEMO_DATA = true;

const getDemoData = (input) => ({
  first_instance: {
    disease: `Possible concern related to “${input}”`,
    accuracy: "68%",
  },
  medical_advice:
    "This is demo guidance for UI testing only. Rest, monitor symptoms, and seek professional care if they worsen. SnapAid is not a substitute for emergency or medical care.",
  instant_help: [
    {
      step: 1,
      info: "Move to a safe, calm place and check breathing and responsiveness.",
    },
    {
      step: 2,
      info: "If symptoms are severe (chest pain, trouble breathing, confusion), call emergency services immediately.",
    },
    {
      step: 3,
      info: "Note when symptoms started, what makes them better or worse, and any recent injuries or illnesses.",
    },
    {
      step: 4,
      info: "Avoid food, drink, or medication unless advised by a clinician or emergency responder.",
    },
  ],
  symptoms_option: [
    {
      symptom: "Shortness of breath",
      description:
        "Difficulty breathing at rest or with light activity. May feel like you cannot get enough air.",
    },
    {
      symptom: "Dizziness or faintness",
      description:
        "Lightheaded feeling, unsteady balance, or nearly passing out when standing or moving.",
    },
    {
      symptom: "Spreading pain or numbness",
      description:
        "Pain, tingling, or numbness moving into the arm, jaw, neck, or legs.",
    },
    {
      symptom: "Fever or chills",
      description:
        "Raised body temperature, shivering, or feeling unusually hot or cold.",
    },
  ],
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
