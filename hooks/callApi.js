import { getQuickAidData } from "@/data/quickAid";

// Flip to false when the DeepSeek API is paid and ready.
const USE_DEMO_DATA = true;

const getDemoData = (input) => ({
  first_instance: {
    disease: `Assessment needed for “${input}”`,
    accuracy: "Guidance",
  },
  medical_advice: `You described “${input}”. This app cannot diagnose you. If symptoms are sudden, severe, or getting worse — especially chest pain, trouble breathing, confusion, heavy bleeding, or loss of consciousness — call emergency services now. Otherwise, rest in a safe place, avoid alcohol and un-prescribed drugs, and contact a doctor or nurse for advice today.`,
  instant_help: [
    {
      step: 1,
      info: "Check the scene is safe. Ask the person their name; if they respond, note level of alertness, breathing, and whether they can move all limbs normally.",
    },
    {
      step: 2,
      info: "Help them sit or lie in the most comfortable position for their symptoms — upright if breathless, flat if faint (unless vomiting, then on their side).",
    },
    {
      step: 3,
      info: "Call emergency services if you see red flags: chest pain, severe breathlessness, stroke signs (face droop, arm weakness, speech difficulty), heavy bleeding, seizure, or sudden confusion.",
    },
    {
      step: 4,
      info: "Record when symptoms started, what triggered them, current medications, allergies, and relevant medical history — clinicians will need this.",
    },
    {
      step: 5,
      info: "Do not give food, drink, or medication (including aspirin) unless a clinician or emergency operator tells you to — some conditions worsen with the wrong treatment.",
    },
    {
      step: 6,
      info: "Stay with them, keep them warm, and recheck breathing and responsiveness every few minutes until help arrives or symptoms clearly improve.",
    },
  ],
  symptoms_option: [
    {
      symptom: "Worsening over minutes",
      description:
        "Rapidly increasing pain, breathlessness, or weakness — treat as urgent and call for help.",
    },
    {
      symptom: "Difficulty breathing",
      description:
        "Shortness of breath at rest, unable to speak full sentences, or lips turning blue — emergency.",
    },
    {
      symptom: "Chest pain or pressure",
      description:
        "Squeezing chest pain, especially with sweat, nausea, or pain into arm or jaw — call emergency services.",
    },
    {
      symptom: "Confusion or drowsiness",
      description:
        "Hard to wake, slurred speech, or not making sense — may signal serious illness or injury.",
    },
    {
      symptom: "Fever with stiff neck",
      description:
        "Headache with high fever and neck stiffness — possible meningitis; seek urgent hospital care.",
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
