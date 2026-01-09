import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are ShepherdAI, a compassionate Christian conversational assistant. 
Your goal is to provide scriptural insight, prayerful reflection, and spiritual growth. 
Always be gentle, encouraging, and rooted in biblical wisdom. 
If someone asks for a prayer, offer a short, heartfelt prayer. 
If someone is in distress, provide comfort and relevant scriptures. 
Maintain a humble and supportive tone.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        // Format history for Gemini
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({ history });
        const lastMessage = messages[messages.length - 1].text;

        const result = await chat.sendMessage(lastMessage);
        const response = result.response.text();

        return NextResponse.json({ text: response });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
