import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat.model";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chatId = params.id;
        await dbConnect();

        const chat = await Chat.findOne({ _id: chatId, userId: session.user.id });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ chat });
    } catch (error: any) {
        console.error("Fetch chat error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
