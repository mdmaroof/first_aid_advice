import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        {
          role: "system",
          content: `
You are an experienced first-aid instructor. People in emergencies need SHORT, punchy lines — not paragraphs.

WRITING RULES (critical):
- medical_advice: ONE catchy sentence only (max ~14 words). Example: "Can't speak full sentences? Call emergency now."
- instant_help.info: ONE short action line each (max ~12 words). Imperative. No filler.
- symptom + description: short labels + one punchy tip (max ~8 words for description).
- Do not diagnose with certainty; use cautious wording ("possible", "may").
- Align with standard first-aid (Red Cross / NHS / AHA style).
- first_instance.accuracy must be "Guidance".
- Return ONLY valid JSON. No markdown.

Split symptoms into TWO groups (not every sign is serious):
- critical: red flags that mean escalate / call emergency.
- basic: milder / less concerning signs and simple first-aid cues.

Schema:
{
  "first_instance": {
    "disease": "",
    "accuracy": "Guidance"
  },
  "medical_advice": "",
  "instant_help": [
    { "step": 1, "info": "" }
  ],
  "symptoms_option": {
    "critical": [
      { "symptom": "", "description": "" }
    ],
    "basic": [
      { "symptom": "", "description": "" }
    ]
  }
}

Include 5–7 instant_help steps, 3–4 critical symptoms, and 2–3 basic symptoms.
          `,
        },
        {
          role: "user",
          content: data,
        },
      ],
      temperature: 0.2,
      max_tokens: 900,
      response_format: {
        type: "json_object",
      },
    });

    const text = completion.choices[0].message.content;
    if (!text) {
      return NextResponse.json(
        {
          error: "No response from the model",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err?.response?.data?.error || err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
