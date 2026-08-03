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
You are an experienced first-aid instructor giving practical emergency guidance.

IMPORTANT:
- Do not diagnose with certainty; use cautious language ("possible", "may indicate").
- Give realistic, actionable steps aligned with standard first-aid protocols (Red Cross / NHS / AHA style).
- Include 6–8 detailed instant_help steps where appropriate — specific actions, timings, and when to call emergency services.
- Include 4–5 symptoms_option entries with clear descriptions of what to watch for.
- medical_advice should be 2–3 sentences: urgency, key red flags, and when to call emergency services.
- first_instance.accuracy should be "Guidance" (not a fake percentage).
- Return ONLY valid JSON. No markdown. No explanations outside JSON.

Schema:
{
  "first_instance": {
    "disease": "",
    "accuracy": "Guidance"
  },
  "medical_advice": "",
  "instant_help": [
    {
      "step": 1,
      "info": ""
    }
  ],
  "symptoms_option": [
    {
      "symptom": "",
      "description": ""
    }
  ]
}
          `,
                },
                {
                    role: "user",
                    content: data,
                },
            ],
            temperature: 0.2,
            max_tokens: 1200,
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
                error: err?.response?.data?.error || err.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}