import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "../../../../lib/mongodb";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any)?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // admin check: see env ADMIN_EMAILS
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const userEmail = (session.user as any).email?.toLowerCase();
        if (!adminEmails.includes(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "shepherdai");
        const col = db.collection("feedback");

        // simple filters: ?status=new&minRating=3
        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const minRating = Number(url.searchParams.get("minRating") || 0);

        const q: any = {};
        if (status) q.status = status;
        if (minRating) q.rating = { $gte: minRating };

        const items = await col.find(q).sort({ createdAt: -1 }).limit(200).toArray();

        return NextResponse.json({ items });
    } catch (err) {
        console.error("GET /api/admin/feedback error:", err);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}

//Patch req
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const userEmail = (session?.user as any)?.email?.toLowerCase();
        if (!session || !adminEmails.includes(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { id, status } = body;
        if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
        if (!["new", "reviewed", "actioned", "dismissed"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "shepherdai");
        const col = db.collection("feedback");

        const { acknowledged } = await col.updateOne({ _id: new (require("mongodb").ObjectId)(id) }, { $set: { status } });
        return NextResponse.json({ ok: acknowledged });
    } catch (err) {
        console.error("PATCH /api/admin/feedback error:", err);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
