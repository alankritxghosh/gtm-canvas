import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { pillarName, pillarDescription } = await req.json();

        if (!pillarName) {
            return NextResponse.json({ error: "Context is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      You are an expert Go-To-Market strategist. 
      The user wants to generate a concrete 3-step action sequence (like a 3-day cold email cadence, or a 3-part social media launch) for this strategic pillar:
      Pillar: ${pillarName}
      Context: ${pillarDescription}

      Return exactly 3 sequential action steps in pure JSON mapping to this schema:
      {
        "nodes": [
          {
            "id": "action-unique-id-1",
            "type": "action",
            "data": {
              "day": "Day 1",
              "subject": "The Hook",
              "body": "Brief snippet of the actual copy..."
            }
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(responseText);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Failed to generate action" }, { status: 500 });
    }
}
