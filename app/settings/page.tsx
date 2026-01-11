"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiSettings, FiTrash2, FiLink2, FiUser, FiAlertTriangle, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [name, setName] = useState(session?.user?.name || "");
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUpdateName = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            await update({ name });
            toast.success("Display name updated");
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlink = async () => {
        if (!confirm("Are you sure you want to unlink your Google account?")) return;
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile/unlink", { method: "POST" });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            toast.success("Google account unlinked");
        } catch (err: any) {
            toast.error(err.message || "Failed to unlink account");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", { method: "DELETE" });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Account deleted. Farewell! 🙏");
            signOut({ callbackUrl: "/" });
        } catch (err: any) {
            toast.error("Failed to delete account");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
                >
                    <FiArrowLeft size={18} />
                    Back to Home
                </Link>

                {/* Header */}
                <motion.div
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                            <FiSettings size={32} />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tight text-[var(--foreground)]">Profile Settings</h1>
                            <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Manage your account</p>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Section */}
                <motion.div
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[var(--muted)] flex items-center gap-2 mb-6">
                        <FiUser size={14} /> Personal Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Display Name</label>
                            <div className="flex gap-3">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all placeholder:text-[var(--muted)]/50"
                                />
                                <button
                                    onClick={handleUpdateName}
                                    disabled={loading || name === session?.user?.name}
                                    className="px-8 py-4 bg-[var(--accent)] text-white text-xs font-black uppercase tracking-widest rounded-2xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/25"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Account Connections */}
                <motion.div
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[var(--muted)] flex items-center gap-2 mb-6">
                        <FiLink2 size={14} /> Connections
                    </h2>
                    <div className="p-6 rounded-3xl border border-[var(--card-border)] bg-[var(--background)]/50 flex items-center justify-between hover:border-[var(--accent)]/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                <FiLink2 size={20} />
                            </div>
                            <div>
                                <span className="text-base font-bold block text-[var(--foreground)]">Google OAuth</span>
                                <span className="text-xs text-green-500 font-bold uppercase tracking-widest">Connected</span>
                            </div>
                        </div>
                        <button
                            onClick={handleUnlink}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                        >
                            Unlink
                        </button>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    className="bg-[var(--card)] border-2 border-red-500/20 rounded-3xl p-8 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <h2 className="text-xs font-black uppercase tracking-[0.25em] text-red-500 flex items-center gap-2 mb-6">
                        <FiAlertTriangle size={14} /> Danger Zone
                    </h2>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full p-6 rounded-3xl border border-red-500/20 bg-red-500/5 flex items-center justify-between hover:bg-red-500/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                                    <FiTrash2 size={20} />
                                </div>
                                <span className="text-base font-bold text-red-500">Permanently Delete Account</span>
                            </div>
                            <FiChevronRight className="text-red-500/50 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-3xl border-2 border-red-500/30 bg-red-500/5 space-y-6"
                        >
                            <div className="flex items-start gap-4 text-red-500">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                                    <FiAlertTriangle size={24} />
                                </div>
                                <p className="text-sm font-bold leading-relaxed">
                                    This action is irreversible. All your chat history and profile data will be purged from our servers.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="flex-1 py-5 bg-red-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50"
                                >
                                    Confirm Purge
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-8 py-5 border border-[var(--card-border)] bg-[var(--card)] text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[var(--card-border)]/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
