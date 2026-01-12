"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiMail, FiDollarSign, FiGithub, FiCheck } from "react-icons/fi";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import PaymentStatusModal from "../components/PaymentStatusModal";

// Replace with your GitHub sponsor URL or repo URL
const GITHUB_SPONSOR_URL = process.env.NEXT_PUBLIC_GITHUB_SPONSOR_URL || "https://github.com/sponsors/your-username";

type Currency = "USD" | "NGN";

function SponsorContent() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<Currency>("USD");
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusType, setStatusType] = useState<"success" | "failure">("failure");

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Check for cancellation/failure params
        if (searchParams.get('canceled')) {
            setStatusType('failure');
            setShowStatusModal(true);
            // Clean up URL
            router.replace('/sponsor');
        }
    }, [searchParams, router]);

    // Open GitHub Sponsors
    const openGithubSponsor = () => {
        window.open(GITHUB_SPONSOR_URL, '_blank', 'noopener,noreferrer');
    };

    const handleDonate = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid donation amount");
            return;
        }

        setLoading(true);
        try {
            if (currency === "USD") {
                // Stripe Checkout
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to create Stripe session');
                if (data.url) window.location.href = data.url;
                else throw new Error('No checkout URL returned');
            } else {
                // Flutterwave Checkout
                const res = await fetch('/api/flutterwave/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to create Flutterwave payment');
                if (data.checkoutUrl) window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
                else throw new Error('No checkout URL returned');
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <PaymentStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                type={statusType}
            />

            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
                >
                    <FiArrowLeft size={18} />
                    Back to Home
                </Link>

                <motion.div
                    className="bg-gradient-to-br from-[var(--accent)]/5 via-purple-500/5 to-blue-500/5 border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute top-0 right-0 p-12 bg-gradient-to-br from-[var(--accent)]/10 to-transparent blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                            <FiHeart size={40} className="fill-current" />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tight text-[var(--foreground)]">Support ShepherdAI</h1>
                            <p className="text-[var(--muted)] leading-relaxed mt-2 max-w-lg">
                                Your generosity helps us maintain this free resource and bring spiritual guidance to more people worldwide.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <FiGithub size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--foreground)]">GitHub</h3>
                                    <p className="text-xs text-[var(--muted)] font-medium">One Time or Recurring support on Github</p>
                                </div>
                            </div>
                            <button
                                onClick={openGithubSponsor}
                                className="px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-all w-full sm:w-auto"
                            >
                                Sponsor on GitHub
                            </button>
                        </div>

                        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />

                            <h3 className="font-black text-xl text-[var(--foreground)] mb-6 flex items-center gap-2">
                                <FiDollarSign className="text-[var(--accent)]" />
                                Make a One-Time Donation
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">Choose Currency</label>
                                    <div className="flex bg-[var(--background)] p-1 rounded-xl border border-[var(--card-border)] w-fit">
                                        {(["USD", "NGN"] as const).map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setCurrency(c)}
                                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${currency === c
                                                    ? "bg-[var(--accent)] text-white shadow-md"
                                                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 block">Enter Amount</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-black text-lg">
                                            {currency === "USD" ? "$" : "₦"}
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl pl-10 pr-6 py-4 text-2xl font-bold focus:ring-4 ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleDonate}
                                    disabled={loading || !amount}
                                    className="w-full py-4 bg-gradient-to-r from-[var(--accent)] to-blue-600 text-white text-base font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-[var(--accent)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {loading ? "Processing..." : `Donate ${currency === "USD" ? "$" : "₦"}${amount || "0"} via ${currency === "USD" ? "Stripe" : "Flutterwave"}`}
                                </button>

                                <div className="text-center">
                                    <p className="text-xs text-[var(--muted)]">
                                        <FiCheck className="inline mr-1 text-emerald-500" />
                                        Secure payment processing by {currency === "USD" ? "Stripe" : "Flutterwave"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center">
                    <p className="text-xs text-[var(--muted)]">
                        Have questions? Reach out to us at {" "}
                        <Link href="/contact" className="text-[var(--accent)] hover:underline font-bold">our contact page</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SponsorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SponsorContent />
        </Suspense>
    );
}
