import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/User.model";
import { Chat } from "@/models/Chat.model";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await dbConnect();
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully", name: updatedUser.name });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Delete all chats
        await Chat.deleteMany({ userId: session.user.id });

        // Delete user
        await User.findByIdAndDelete(session.user.id);

        // Note: In a real app with MongoDBAdapter, 
        // you might also want to delete entries in the 'accounts' 
        // and 'sessions' collections if they are managed separately.

        return NextResponse.json({ message: "Account deleted successfully" });
    } catch (error: any) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
