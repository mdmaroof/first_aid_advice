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
You are a medical first-aid assistant.

IMPORTANT:
- Do not diagnose with certainty.
- Return ONLY valid JSON.
- No markdown.
- No explanations.

Schema:
{
  "first_instance": {
    "disease": "",
    "accuracy": ""
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
            max_tokens: 350,
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