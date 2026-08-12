import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  clampSymptomInput,
  MAX_SYMPTOM_LENGTH,
  normalizeAidResult,
} from "@/lib/aidResult";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`aid:${ip}`, { limit: 12, windowMs: 60_000 });
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${limited.retryAfterSec}s.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const data = clampSymptomInput(body?.data);

    if (!data) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    if (String(body?.data ?? "").trim().length > MAX_SYMPTOM_LENGTH) {
      return NextResponse.json(
        { error: `Keep symptoms under ${MAX_SYMPTOM_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "Guidance service is temporarily unavailable." },
        { status: 503 }
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
- Output ONLY one JSON object.
- Do NOT wrap in markdown.
- Do NOT explain anything.
- Do NOT include notes.
- Do NOT include \`\`\`json.
- The response must be parseable by JSON.parse().
- If unsure, use an empty string rather than omitting fields.

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
      temperature: 0,
      max_tokens: 1200,
      response_format: {
        type: "json_object",
      },
      thinking: {
        type: "disabled",
      },
    });

    const text = completion.choices[0].message.content;
    if (!text) {
      return NextResponse.json(
        { error: "No response from the model" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid guidance response. Please try again." },
        { status: 502 }
      );
    }

    const normalized = normalizeAidResult(parsed);
    if (!normalized) {
      return NextResponse.json(
        { error: "Incomplete guidance response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(normalized);
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
