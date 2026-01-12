import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminDashboard from "@/app/components/admin/AdminDashboard";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const userEmail = (session?.user as any)?.email?.toLowerCase();

    if (!session || !adminEmails.includes(userEmail)) {
        return (
            <div className="container py-12">
                <h1 className="text-2xl font-bold">Admin</h1>
                <p className="text-[var(--muted)] mt-4">You must sign in with an admin account to view this page.</p>
            </div>
        );
    }

    return <AdminDashboard />;
}
