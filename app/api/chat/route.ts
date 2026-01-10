// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // keep your import

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) console.warn("GEMINI_API_KEY not found in env");

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are ShepherdAI, a compassionate Christian conversational assistant.
Always be gentle, encouraging, and rooted in biblical wisdom.
When someone asks for a prayer, offer a short heartfelt prayer.
When someone expresses harm to self/others or extreme violence, do NOT provide instructions — instead respond with empathy, de-escalation, and scripture-based encouragement.
Keep answers succinct and include a short scripture reference when relevant.
`;

function normalizeRole(r: string) {
    const rLower = String(r || "").toLowerCase();
    if (rLower === "user" || rLower === "u") return "user";
    if (rLower === "assistant" || rLower === "ai" || rLower === "model" || rLower === "bot") return "model";
    return "user";
}

function buildHistory(messages: any[]) {
    const history: any[] = [];

    // Append alternating user/model messages from incoming messages
    for (const m of messages || []) {
        const role = normalizeRole(m.role);
        if (!m.text) continue;
        history.push({
            role: role,
            parts: [{ text: String(m.text) }],
        });
    }

    return history;
}

async function extractTextFromResult(result: any) {
    // Try a few common shapes returned by different SDKs
    try {
        // pattern: result?.response?.text() -> earlier pattern from your code
        if (result?.response?.text) {
            const t = await result.response.text();
            if (t) return t;
        }

        // pattern: result?.output[0].content[0].text
        if (result?.output && Array.isArray(result.output)) {
            const firstOut = result.output[0];
            if (firstOut?.content && Array.isArray(firstOut.content) && firstOut.content[0]?.text) {
                return firstOut.content[0].text;
            }
        }

        // pattern: result?.candidates?.[0]?.content?.[0]?.text
        if (result?.candidates && result.candidates[0]?.content?.[0]?.text) {
            return result.candidates[0].content[0].text;
        }

        // fallback: JSON stringify for debugging
        return JSON.stringify(result).slice(0, 2000);
    } catch (e) {
        return `<<failed to extract text: ${String(e)}>>`;
    }
}

export async function POST(req: Request) {
    try {
        if (!API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY missing on server" }, { status: 500 });
        }

        const body = await req.json();
        const messages = body?.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        // Build history including system + previous messages
        const history = buildHistory(messages);

        // Final user input is the last user-type message
        // Walk messages from end to find last user-like message
        let lastUserText = null;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (normalizeRole(messages[i].role) === "user" && messages[i].text?.trim()) {
                lastUserText = String(messages[i].text).trim();
                break;
            }
        }
        if (!lastUserText) {
            return NextResponse.json({ error: "No user message found in conversation" }, { status: 400 });
        }

        // Basic safety: if user input contains explicit violent instructions, block locally
        const violentPattern = /(kill|suicide|bomb|shoot|hurt someone|harm yourself|self[- ]harm)/i;
        if (violentPattern.test(lastUserText)) {
            // Respond with compassionate redirection
            const safeReply = "I'm sorry you're feeling this way. I can't help with harm, but I care about your safety. Please consider contacting a trusted person or local emergency services. Here's a verse: Psalm 34:18 — The Lord is close to the brokenhearted.";
            return NextResponse.json({ text: safeReply });
        }

        // Get the generative model with system instructions
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        // startChat expects a history array
        const chat = model.startChat({
            history,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        // Send the last user text
        const result = await chat.sendMessage(lastUserText);


        // Extract text robustly
        const text = await extractTextFromResult(result);
        // Save to DB here if you want (not included)

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Failed to generate response", details: String(error) }, { status: 500 });
    }
}
