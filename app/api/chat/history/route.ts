import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat.model";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        await dbConnect();

        const chats = await Chat.find({ userId: session.user.id })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("title updatedAt messages");

        const total = await Chat.countDocuments({ userId: session.user.id });

        return NextResponse.json({
            chats,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error: any) {
        console.error("History API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
