"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSettings, FiTrash2, FiLink2, FiUser, FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function SettingsModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { data: session, update } = useSession();
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

            // Update local session
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
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed z-[90] inset-y-0 right-0 max-w-md w-full bg-[var(--card)] shadow-2xl border-l border-[var(--card-border)] flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--background)]/50">
                            <div className="flex items-center gap-3">
                                <FiSettings className="text-[var(--accent)] w-5 h-5" />
                                <h3 className="font-bold text-lg">Settings</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[var(--card-border)]/20 rounded-lg transition-all">
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Profile Section */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Profile Settings</h4>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--muted)]">Display Name</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm focus:ring-2 ring-[var(--accent)]/10 outline-none"
                                        />
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={loading || name === session?.user?.name}
                                            className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-xl disabled:opacity-30 transition-all hover:scale-105"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-[var(--card-border)]" />

                            {/* Account Connections */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Connections</h4>
                                <div className="p-4 rounded-2xl border border-[var(--card-border)] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <FiLink2 size={16} />
                                        </div>
                                        <span className="text-sm font-medium">Google OAuth</span>
                                    </div>
                                    <button
                                        onClick={handleUnlink}
                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
                                    >
                                        Unlink
                                    </button>
                                </div>
                            </div>

                            <hr className="border-[var(--card-border)]" />

                            {/* Danger Zone */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Danger Zone</h4>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between hover:bg-red-500/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 text-red-500">
                                            <FiTrash2 size={16} />
                                            <span className="text-sm font-bold">Delete Account</span>
                                        </div>
                                    </button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl border-2 border-red-500/50 bg-red-500/10 space-y-4"
                                    >
                                        <div className="flex items-start gap-3 text-red-500">
                                            <FiAlertTriangle className="shrink-0 mt-1" size={20} />
                                            <p className="text-xs font-medium leading-relaxed">
                                                Are you absolutely sure? This will permanently delete your profile, chat history, and all faith recordings. This action cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="flex-1 py-3 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all"
                                            >
                                                Yes, Delete
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-4 py-3 border border-[var(--card-border)] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[var(--card-border)]/10 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
