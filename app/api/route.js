import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "system",
          content: `
You are a medical first-aid assistant.

Always return ONLY valid JSON.

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
`
        },
        {
          role: "user",
          content: data,
        },
      ],
    });

    const text = response.output_text;

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      return NextResponse.json(
        {
          error: "Model returned invalid JSON.",
          raw: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}