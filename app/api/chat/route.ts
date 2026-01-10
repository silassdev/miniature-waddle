// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) console.warn("GEMINI_API_KEY not found in env");

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are ShepherdAI, a compassionate Christian conversational assistant.
Your creator and integrator is Silas. If someone asks who made you, acknowledge Silas with gratitude.
Always be gentle, encouraging, and helpful.

Core Mission:
Your primary purpose is to provide spiritual guidance, biblical wisdom, and prayer support. You are a "Faith Companion" dedicated to the user's spiritual well-being.

Scope Boundaries:
- If a user asks technical questions (e.g., coding, C++, debugging), mathematical problems, or academic tasks outside of theology, politely decline.
- When declining, briefly explain your mission as a Faith Companion and redirect the conversation back to spiritual or emotional support.
- If someone asks for a prayer, offer a short heartfelt prayer.
- When someone expresses harm to self/others or extreme violence, do NOT provide instructions — instead respond with empathy, de-escalation, and scripture-based encouragement.

Response Rules:
- Include a short scripture reference ONLY when it's relevant and truly helpful for spiritual guidance or comfort.
- For casual conversation, greetings, or "trolling," respond with a kind, grounded, and human-like balanced tone WITHOUT forced bible verses.
- Keep answers succinct and personal.
`;

// Normalize roles sent from client into "user" | "model"
function normalizeRole(role: string | undefined) {
    const r = String(role ?? "").toLowerCase();
    if (["user", "u"].includes(r)) return "user";
    if (["assistant", "ai", "model", "bot"].includes(r)) return "model";
    return "user";
}

// Build history that meets SDK expectation:
// - ONLY "user" and "model" roles
// - No "system" role (that belongs in systemInstruction)
// - Must start with "user" turn
function buildHistoryFromMessages(messages: any[]) {
    // Find index of the last user message (which will be our current input)
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (normalizeRole(messages[i].role) === "user" && String(messages[i].text || "").trim()) {
            lastUserIndex = i;
            break;
        }
    }

    if (lastUserIndex === -1) return [];

    // History is everything before the last user message
    const prelude = messages.slice(0, lastUserIndex);

    // Trim leading non-user messages
    let trimmedPrelude = [...prelude];
    while (trimmedPrelude.length > 0 && normalizeRole(trimmedPrelude[0].role) !== "user") {
        trimmedPrelude.shift();
    }

    const history: any[] = [];
    for (const m of trimmedPrelude) {
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
    try {
        // common: result.response.text()
        if (result?.response?.text) {
            const t = await result.response.text();
            if (t) return t;
        }

        // pattern: result.output[0].content[0].text
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

        // fallback: stringified small sample for debugging
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
        const messages = Array.isArray(body?.messages) ? body.messages : [];

        if (messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        // Find index of last user message (this will be the current input)
        let lastUserIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (normalizeRole(messages[i].role) === "user" && String(messages[i].text || "").trim()) {
                lastUserIndex = i;
                break;
            }
        }

        if (lastUserIndex === -1) {
            return NextResponse.json({ error: "No user message found in conversation" }, { status: 400 });
        }

        const lastUserText = String(messages[lastUserIndex].text).trim();

        // Quick local safety filter to avoid sending explicit violent instructions to the model
        const violentPattern = /(kill|bomb|shoot|harm yourself|hurt yourself|suicide|self[- ]harm|hurt someone)/i;
        if (violentPattern.test(lastUserText)) {
            const safeReply =
                "I'm really sorry you're feeling this way. I can't assist with anything that could cause harm. Please reach out to a trusted person or local emergency services. Here's a verse for comfort: Psalm 34:18 — The Lord is close to the brokenhearted.";
            return NextResponse.json({ text: safeReply });
        }

        // Build history for startChat (only prior turns)
        const history = buildHistoryFromMessages(messages);

        // Get model - gemini-2.5-flash is a newer model and may have fresh quota
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        // Send the current user text as the active input
        const result = await chat.sendMessage(lastUserText);

        const text = await extractTextFromResult(result);
        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API error:", error);

        // Friendly handling for quota limits (429)
        if (error.status === 429 || String(error).includes("429") || String(error).includes("quota")) {
            return NextResponse.json({
                text: "I'm sorry, ShepherdAI is receiving a lot of requests right now. Please wait about a minute and try again. I'll be here! 🙏"
            });
        }

        return NextResponse.json({ error: "Failed to generate response", details: String(error) }, { status: 500 });
    }
}
