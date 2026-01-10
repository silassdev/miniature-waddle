import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/User.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Verify user has a password set
        const user = await User.findById(session.user.id).select("+password");
        if (!user || !user.password) {
            return NextResponse.json({
                error: "You must set a password before unlinking your Google account to ensure you can still sign in."
            }, { status: 400 });
        }

        // 2. Remove the Google account link from the 'accounts' collection
        // Note: MongoDBAdapter uses a collection named 'accounts' by default
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not established");
        }

        const accountsCollection = db.collection("accounts");
        const deleteResult = await accountsCollection.deleteOne({
            userId: new mongoose.Types.ObjectId(session.user.id),
            provider: "google"
        });

        if (deleteResult.deletedCount === 0) {
            return NextResponse.json({ error: "No Google account linked or link already removed" }, { status: 404 });
        }

        return NextResponse.json({ message: "Google account unlinked successfully" });
    } catch (error: any) {
        console.error("Google unlink error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
