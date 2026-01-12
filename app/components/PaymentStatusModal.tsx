"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

interface PaymentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "failure";
}

export default function PaymentStatusModal({ isOpen, onClose, type }: PaymentStatusModalProps) {
    if (!isOpen) return null;

    const isSuccess = type === "success";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--card)] border border-[var(--card-border)] w-full max-w-md rounded-3xl p-8 relative shadow-2xl overflow-hidden text-center"
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-500 to-pink-600'}`} />
                            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />

                            <div className="mb-6 relative inline-block">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto shadow-inner ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {isSuccess ? '😇' : '😔'}
                                </div>
                                <div className={`absolute bottom-0 right-0 p-2 rounded-full text-white shadow-lg ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {isSuccess ? <FiCheck size={20} /> : <FiAlertCircle size={20} />}
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-[var(--foreground)] mb-3">
                                {isSuccess ? "Thank You!" : "Oh no!"}
                            </h2>
                            <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
                                {isSuccess
                                    ? "Thank You for your support! Your generosity helps us keep the light of wisdom burning bright. We appreciate you! ❤️"
                                    : "Something went wrong with your donation. Don't worry, no funds were taken. Want to try again?"}
                            </p>

                            <div className="flex flex-col gap-3">
                                {isSuccess ? (
                                    <Link
                                        href="/"
                                        className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-bold hover:opacity-90 transition-all"
                                    >
                                        Return Home
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={onClose}
                                            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/20"
                                        >
                                            Try Again
                                        </button>
                                        <Link
                                            href="/"
                                            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium text-sm py-2"
                                        >
                                            Maybe later
                                        </Link>
                                    </>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
