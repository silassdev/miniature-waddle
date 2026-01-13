import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../../lib/mongodb";
import type { NextRequest } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { rating, comment, context } = body || {};

        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating (1-5 required)" }, { status: 400 });
        }

        let userId = null;
        let userEmail = null;
        try {
            const session = await getServerSession(authOptions);
            if (session?.user) {
                userId = (session.user as any).id ?? null;
                userEmail = session.user.email ?? null;
            }
        } catch (e) {
            // ignore — session optional for feedback
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const col = db.collection("feedback");

        const doc = {
            userId,
            userEmail,
            rating,
            comment: String(comment || "").trim(),
            context: String(context || ""),
            createdAt: new Date(),
            status: "new",
        };

        const res = await col.insertOne(doc);
        return NextResponse.json({ ok: true, id: res.insertedId });
    } catch (err) {
        console.error("POST /api/feedback error:", err);
        return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }
}
