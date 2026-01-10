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
    console.log(">>> EXECUTING NEW CHAT ROUTE WITH GEMINI-PRO <<<");
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        // Format history for Gemini - MUST start with "user" and alternate roles
        const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
        let conversationMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : [];

        if (conversationMessages.length === 0) {
            return NextResponse.json({ error: "No user message found" }, { status: 400 });
        }

        const lastMessage = conversationMessages.pop().text;

        // Ensure only alternating roles (user, model, user, model...)
        const history: any[] = [];
        let expectedRole = "user";

        for (const msg of conversationMessages) {
            const currentRole = msg.role === "user" ? "user" : "model";
            if (currentRole === expectedRole) {
                history.push({
                    role: currentRole,
                    parts: [{ text: msg.text }],
                });
                expectedRole = expectedRole === "user" ? "model" : "user";
            }
        }

        // If the sequence ended expecting a user (meaning the last history was model), 
        // we are good to send the lastMessage as a user message.
        // If it ended expecting a model, the history is invalid for startChat 
        // and we should pop the last history item.
        if (expectedRole === "user" && history.length > 0) {
            history.pop();
        }

        const chat = model.startChat({
            history,
            generationConfig: {
                maxOutputTokens: 1000,
            }
        });

        // Prepend system prompt to the user message to ensure personality
        const finalPrompt = `${SYSTEM_PROMPT}\n\nUser: ${lastMessage}`;

        const result = await chat.sendMessage(finalPrompt);
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
