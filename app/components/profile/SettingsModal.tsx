"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSettings, FiTrash2, FiLink2, FiUser, FiAlertTriangle, FiChevronRight } from "react-icons/fi";
import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

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
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="fixed z-[1000] inset-0 flex items-center justify-center p-4 bg-transparent"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={onClose}
                    >
                        <div
                            className="w-full max-w-lg bg-[var(--card)] border border-[var(--card-border)] shadow-2xl rounded-[2rem] flex flex-col h-[600px] overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button - Absolute for clarity */}
                            {/* Close Button - Absolute for clarity */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-3 rounded-2xl bg-[var(--background)] border-2 border-[var(--card-border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 group transition-all z-10 shadow-xl flex items-center gap-2"
                                aria-label="Close"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-[var(--accent)] hidden sm:block">Exit</span>
                                <FiX size={20} className="text-[var(--foreground)] group-hover:text-[var(--accent)]" />
                            </button>

                            {/* Header */}
                            <div className="p-8 border-b border-[var(--card-border)] bg-[var(--background)]/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                                        <FiSettings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl tracking-tight text-[var(--foreground)]">Profile Settings</h3>
                                        <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-0.5">Manage your account</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[var(--card)]">
                                {/* Profile Section */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)] flex items-center gap-2">
                                        <FiUser size={12} /> Personal Information
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1">Display Name</label>
                                        <div className="flex gap-2">
                                            <input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all placeholder:text-[var(--muted)]/50"
                                            />
                                            <button
                                                onClick={handleUpdateName}
                                                disabled={loading || name === session?.user?.name}
                                                className="px-6 py-3 bg-[var(--accent)] text-white text-xs font-black uppercase tracking-widest rounded-2xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/25"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />

                                {/* Account Connections */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)] flex items-center gap-2">
                                        <FiLink2 size={12} /> Connections
                                    </h4>
                                    <div className="p-5 rounded-3xl border border-[var(--card-border)] bg-[var(--background)]/50 flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                                <FiLink2 size={18} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold block text-[var(--foreground)]">Google OAuth</span>
                                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Connected</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUnlink}
                                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        >
                                            Unlink
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />

                                {/* Danger Zone */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 flex items-center gap-2">
                                        <FiAlertTriangle size={12} /> Danger Zone
                                    </h4>

                                    {!showDeleteConfirm ? (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="w-full p-5 rounded-3xl border border-red-500/20 bg-red-500/5 flex items-center justify-between hover:bg-red-500/10 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                                                    <FiTrash2 size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-red-500">Permanently Delete Account</span>
                                            </div>
                                            <FiChevronRight className="text-red-500/50 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 rounded-3xl border-2 border-red-500/30 bg-red-500/5 space-y-5"
                                        >
                                            <div className="flex items-start gap-4 text-red-500">
                                                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                                                    <FiAlertTriangle size={20} />
                                                </div>
                                                <p className="text-xs font-bold leading-relaxed">
                                                    This action is irreversible. All your chat history and profile data will be purged from our servers.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    disabled={loading}
                                                    className="flex-1 py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50"
                                                >
                                                    Confirm Purge
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="px-6 py-4 border border-[var(--card-border)] bg-[var(--card)] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[var(--card-border)]/20 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
