"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiClock, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useChat } from "./ChatContext";

type ChatPreview = {
    _id: string;
    title: string;
    updatedAt: string;
};

export default function HistoryModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { openChat } = useChat();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (open) {
            fetchHistory();
        }
    }, [open, page]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/chat/history?page=${page}&limit=10`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setChats(data.chats);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            toast.error("Failed to load chat history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(dateStr));
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
                                <FiClock className="text-[var(--accent)] w-5 h-5" />
                                <h3 className="font-bold text-lg">Chat History</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[var(--card-border)]/20 rounded-lg transition-all">
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : chats.length === 0 ? (
                                <div className="text-center py-12 text-[var(--muted)]">
                                    <p>No past conversations found.</p>
                                </div>
                            ) : (
                                chats.map((chat) => (
                                    <button
                                        key={chat._id}
                                        onClick={() => {
                                            openChat(chat._id);
                                            onClose();
                                        }}
                                        className="w-full p-4 rounded-2xl border border-[var(--card-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-left flex items-center justify-between group"
                                    >
                                        <div className="flex-1 mr-4 overflow-hidden">
                                            <p className="font-bold text-sm truncate">{chat.title}</p>
                                            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest mt-1">
                                                {formatDate(chat.updatedAt)}
                                            </p>
                                        </div>
                                        <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-all" size={16} />
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Pagination footer */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-[var(--card-border)] flex items-center justify-between">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 rounded-lg border border-[var(--card-border)] disabled:opacity-30 hover:bg-[var(--card-border)]/10 transition-all"
                                >
                                    <FiChevronLeft size={18} />
                                </button>
                                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 rounded-lg border border-[var(--card-border)] disabled:opacity-30 hover:bg-[var(--card-border)]/10 transition-all"
                                >
                                    <FiChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
