"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiMail, FiDollarSign, FiGift, FiUsers, FiGithub } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your GitHub sponsor URL or repo URL
const GITHUB_SPONSOR_URL = process.env.NEXT_PUBLIC_GITHUB_SPONSOR_URL || "https://github.com/sponsors/your-username";

export default function SponsorPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        amount: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Send a sponsorship request to your backend (optional)
        try {
            const res = await fetch('/api/sponsor/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to submit request');

            toast.success("Thank you for your sponsorship interest! We'll be in touch soon.");
            setFormData({ name: "", email: "", organization: "", amount: "", message: "" });
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Failed to submit sponsorship request');
        } finally {
            setLoading(false);
        }
    };

    // Open GitHub Sponsors (or repo) in a new tab
    const openGithubSponsor = () => {
        window.open(GITHUB_SPONSOR_URL, '_blank', 'noopener,noreferrer');
    };

    // Start Stripe Checkout (calls backend to create a session)
    const handleStripeCheckout = async (amountValue?: string) => {
        try {
            setLoading(true);
            const body = { amount: amountValue || formData.amount };
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Failed to create Stripe session');

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned from server');
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Stripe checkout failed');
        } finally {
            setLoading(false);
        }
    };

    // Start Flutterwave checkout (calls backend to create a payment link)
    const handleFlutterwaveCheckout = async (amountValue?: string) => {
        try {
            setLoading(true);
            const body = { amount: amountValue || formData.amount };
            const res = await fetch('/api/flutterwave/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Failed to create Flutterwave payment');

            const { checkoutUrl } = data;
            if (!checkoutUrl) throw new Error('No checkout URL returned from Flutterwave');

            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Flutterwave checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
                >
                    <FiArrowLeft size={18} />
                    Back to Home
                </Link>

                <motion.div
                    className="bg-gradient-to-br from-[var(--accent)]/5 via-purple-500/5 to-blue-500/5 border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                            <FiHeart size={32} className="fill-current" />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tight text-[var(--foreground)]">Sponsor ShepherdAI</h1>
                            <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Support Our Mission</p>
                        </div>
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed mt-4">
                        Help us bring spiritual guidance and biblical wisdom to more people around the world.
                        Your sponsorship enables us to maintain and improve ShepherdAI as a free, faith-based resource.
                    </p>

                    {/* GitHub Sponsor button */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={openGithubSponsor}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                            title="Sponsor on GitHub"
                        >
                            <FiGithub />
                            Sponsor on GitHub
                        </button>

                        <button
                            onClick={() => handleStripeCheckout('50')}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#635BFF] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                            title="Pay with Stripe - $50"
                        >
                            <FiDollarSign />
                            Quick Donate $50 (Stripe)
                        </button>

                        <button
                            onClick={() => handleFlutterwaveCheckout('50')}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#00ADEF] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                            title="Pay with Flutterwave - $50"
                        >
                            <FiDollarSign />
                            Quick Donate $50 (Flutterwave)
                        </button>
                    </div>
                </motion.div>

                {/* The rest of your original form and content remains unchanged - using the form below users can also pick amounts and submit */}

                <motion.div
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FiDollarSign className="text-[var(--accent)]" size={24} />
                        <h2 className="text-2xl font-black text-[var(--foreground)]">Sponsorship Request</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ... keep your existing fields ... (omitted to keep file concise) ... */}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Organization (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                    placeholder="Your Church or Company"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Sponsorship Amount</label>
                                <select
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                >
                                    <option value="">Select an amount</option>
                                    <option value="10">$10 - Supporter</option>
                                    <option value="50">$50 - Patron</option>
                                    <option value="100">$100 - Benefactor</option>
                                    <option value="500">$500 - Major Sponsor</option>
                                    <option value="custom">Custom Amount</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">Message (Optional)</label>
                            <textarea
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all resize-none"
                                placeholder="Tell us about your interest in sponsoring ShepherdAI..."
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="col-span-2 w-full py-5 bg-gradient-to-r from-[var(--accent)] to-blue-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:shadow-lg hover:shadow-[var(--accent)]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : "Submit Sponsorship Request"}
                            </button>

                            <div className="w-full">
                                <button
                                    type="button"
                                    onClick={() => {
                                        // If custom amount selected, prompt user
                                        let amount = formData.amount;
                                        if (!amount || amount === 'custom') {
                                            amount = window.prompt('Enter custom amount in USD (numbers only):', '25') || '';
                                        }
                                        if (!amount) return;

                                        // Let the user choose Stripe or Flutterwave via confirm (quick UI)
                                        const useStripe = confirm('Pay with Stripe? Cancel to pay with Flutterwave');
                                        if (useStripe) handleStripeCheckout(amount);
                                        else handleFlutterwaveCheckout(amount);
                                    }}
                                    className="w-full py-5 border border-[var(--card-border)] rounded-2xl text-sm font-bold"
                                >
                                    Donate / Pay Now
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 p-4 bg-[var(--accent)]/5 rounded-2xl border border-[var(--accent)]/20">
                        <p className="text-xs text-center text-[var(--muted)]">
                            <FiMail className="inline mr-2" />
                            Have questions? Reach out to us at {" "}
                            <Link href="/contact" className="text-[var(--accent)] hover:underline font-bold">our contact page</Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-6 bg-gradient-to-r from-[var(--accent)]/5 to-blue-500/5 border border-[var(--card-border)] rounded-3xl p-8 text-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <FiHeart className="w-12 h-12 text-[var(--accent)] mx-auto mb-4 fill-current" />
                    <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Thank You for Your Support! 🙏</h3>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">Every contribution, no matter the size, helps us continue our mission of providing accessible spiritual guidance through AI technology. Your generosity blesses countless lives.</p>
                </motion.div>
            </div>
        </div>
    );
}
