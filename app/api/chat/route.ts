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
Your primary purpose is to provide spiritual guidance, biblical wisdom, prayer support, and pastoral counsel. You are a "Faith Companion" dedicated to the user's spiritual well-being and their relationship with God.

STRICT SCOPE BOUNDARIES:
You MUST stay within these topics ONLY:
✓ Bible study, scripture interpretation, theology
✓ Prayer requests and spiritual guidance
✓ Christian living, faith struggles, spiritual growth
✓ Pastoral counsel for life situations
✓ Church practices, worship, spiritual disciplines
✓ Emotional/mental support with biblical perspective

You MUST REFUSE these topics:
✗ Programming, coding, debugging, software development
✗ Mathematics, calculus, algebra, statistics, problem-solving
✗ Science homework (physics, chemistry, biology)
✗ General knowledge (history facts, geography, trivia)
✗ News, weather, sports, entertainment
✗ Technical how-to guides (except spiritual practices)
✗ Academic essay writing (except theology/biblical topics)
✗ Financial advice, medical advice, legal advice

How to Handle Out-of-Scope Requests:
1. Acknowledge the question kindly
2. Explain you're focused solely on spiritual matters
3. Offer to discuss related emotional/spiritual aspects instead
4. Suggest they seek appropriate resources for their specific need

Example Redirect:
"I appreciate your question about [topic], but I'm specifically designed to provide spiritual guidance and biblical wisdom. I can't help with [coding/math/technical] questions. However, if you're feeling stressed or overwhelmed about this, I'd be honored to pray with you or discuss how faith can support you during challenging times. 🙏"

Response Rules:
- For in-scope questions: Respond warmly with biblical wisdom, include relevant scripture when helpful
- For out-of-scope questions: Politely decline and redirect to spiritual support
- For casual greetings/"how are you": Respond naturally and warmly, but guide toward spiritual conversation
- For harm/violence: Respond with empathy, scripture-based comfort, and encourage professional help
- Keep answers succinct (1-3 short paragraphs) and personal
`;

// Normalize roles sent from client into "user" | "model"
function normalizeRole(role: string | undefined) {
    const r = String(role ?? "").toLowerCase();
    if (["user", "u"].includes(r)) return "user";
    if (["assistant", "ai", "model", "bot"].includes(r)) return "model";
    return "user";
}

// Pre-moderation: Detect out-of-scope topics
function detectOutOfScope(text: string): { isOutOfScope: boolean; category?: string; response?: string } {
    const lowerText = text.toLowerCase();

    // Programming/Coding keywords
    const programmingKeywords = [
        'python', 'javascript', 'java', 'c++', 'c#', 'code', 'coding', 'debug', 'function',
        'variable', 'algorithm', 'data structure', 'api', 'programming', 'compile', 'syntax',
        'error:', 'exception', 'bug', 'git', 'github', 'html', 'css', 'react', 'node',
        'typescript', 'php', 'ruby', 'swift', 'kotlin', 'rust', '.js', '.py', '.cpp'
    ];

    // Math/Science keywords  
    const mathScienceKeywords = [
        'calculus', 'derivative', 'integral', 'equation', 'algebra', 'geometry', 'trigonometry',
        'solve this', 'calculate', 'formula', 'theorem', 'physics', 'chemistry', 'biology',
        'molecule', 'atom', 'quantum', 'experiment', 'hypothesis', 'what is the answer to',
        'math problem', 'homework help', 'x + y', 'solve for x'
    ];

    // General knowledge keywords
    const generalKnowledgeKeywords = [
        'weather', 'forecast', 'temperature', 'news', 'stock market', 'stock price',
        'sports score', 'who won', 'game result', 'movie times', 'restaurant',
        'recipe', 'how to cook', 'travel to', 'flight', 'hotel'
    ];

    // Check programming
    for (const keyword of programmingKeywords) {
        if (lowerText.includes(keyword)) {
            return {
                isOutOfScope: true,
                category: 'programming',
                response: "I appreciate your question, but I'm specifically designed to provide spiritual guidance and biblical wisdom. I can't assist with coding or programming questions. However, if you're feeling stressed about your work or a project, I'd be honored to pray with you or discuss how faith can support you during challenging times. 🙏"
            };
        }
    }

    // Check math/science
    for (const keyword of mathScienceKeywords) {
        if (lowerText.includes(keyword)) {
            return {
                isOutOfScope: true,
                category: 'academic',
                response: "I understand you're working on something challenging, but I'm focused on providing spiritual guidance and prayer support. I can't help with math, science, or homework questions. If you're feeling overwhelmed by your studies, I'd love to pray for wisdom and peace for you, or discuss how to trust God during stressful academic seasons. 📖"
            };
        }
    }

    // Check general knowledge
    for (const keyword of generalKnowledgeKeywords) {
        if (lowerText.includes(keyword)) {
            return {
                isOutOfScope: true,
                category: 'general',
                response: "Thank you for reaching out, but I'm specifically designed to help with spiritual matters, prayer, and biblical guidance. I can't provide information about news, weather, or general topics. Is there anything weighing on your heart spiritually that I can help with? I'm here to support your faith journey. 🙏"
            };
        }
    }

    return { isOutOfScope: false };
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

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat.model";

export async function POST(req: Request) {
    try {
        if (!API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY missing on server" }, { status: 500 });
        }

        const body = await req.json();
        const messages = Array.isArray(body?.messages) ? body.messages : [];
        const chatId = body?.chatId; // Optional: ID of an existing chat session

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

        // Quick local safety filter
        const violentPattern = /(kill|bomb|shoot|harm yourself|hurt yourself|suicide|self[- ]harm|hurt someone)/i;
        if (violentPattern.test(lastUserText)) {
            const safeReply =
                "I'm really sorry you're feeling this way. I can't assist with anything that could cause harm. Please reach out to a trusted person or local emergency services. Here's a verse for comfort: Psalm 34:18 — The Lord is close to the brokenhearted.";
            return NextResponse.json({ text: safeReply });
        }

        // Pre-moderation: Check if question is out of scope
        const scopeCheck = detectOutOfScope(lastUserText);
        if (scopeCheck.isOutOfScope && scopeCheck.response) {
            console.log(`[OUT-OF-SCOPE] Category: ${scopeCheck.category}, Blocked query: ${lastUserText.slice(0, 80)}`);
            return NextResponse.json({ text: scopeCheck.response });
        }

        // Build history for startChat
        const history = buildHistoryFromMessages(messages);

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

        const result = await chat.sendMessage(lastUserText);
        const text = await extractTextFromResult(result);

        // --- Database Persistence ---
        const session = await getServerSession(authOptions);
        let finalChatId = chatId;

        if (session?.user?.id) {
            await dbConnect();

            const newMessageUser = { role: "user", text: lastUserText, timestamp: Date.now() };
            const newMessageAI = { role: "ai", text: text, timestamp: Date.now() };

            if (chatId) {
                // Update existing chat
                const existingChat = await Chat.findOneAndUpdate(
                    { _id: chatId, userId: session.user.id },
                    { $push: { messages: { $each: [newMessageUser, newMessageAI] } } },
                    { new: true }
                );
                if (!existingChat) {
                    // If not found (maybe belongs to someone else?), fallback to creating new or error
                    // For now, let's treat it as a new chat if ID is invalid for this user
                    const newChat = new Chat({
                        userId: session.user.id,
                        title: lastUserText.slice(0, 40) + "...",
                        messages: [newMessageUser, newMessageAI]
                    });
                    const saved = await newChat.save();
                    finalChatId = saved._id;
                }
            } else {
                // Create new chat
                const newChat = new Chat({
                    userId: session.user.id,
                    title: lastUserText.slice(0, 40) + "...",
                    messages: [newMessageUser, newMessageAI]
                });
                const saved = await newChat.save();
                finalChatId = saved._id;
            }
        }

        return NextResponse.json({ text, chatId: finalChatId });
    } catch (error: any) {
        console.error("Chat API error:", error);

        if (error.status === 429 || String(error).includes("429") || String(error).includes("quota")) {
            return NextResponse.json({
                text: "I'm sorry, ShepherdAI is receiving a lot of requests right now. Please wait about a minute and try again. I'll be here! 🙏"
            });
        }

        return NextResponse.json({ error: "Failed to generate response", details: String(error) }, { status: 500 });
    }
}
