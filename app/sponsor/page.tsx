"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiMail, FiDollarSign, FiGift, FiUsers } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

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

        // Simulate sponsor request submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Thank you for your sponsorship interest! We'll be in touch soon.");
        setFormData({ name: "", email: "", organization: "", amount: "", message: "" });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-4xl mx-auto">
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
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Why Sponsor */}
                    <motion.div
                        className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-6 shadow-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FiGift className="text-[var(--accent)]" size={24} />
                            <h2 className="text-xl font-black text-[var(--foreground)]">Why Sponsor?</h2>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">
                                    Keep ShepherdAI free for everyone seeking spiritual guidance
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">
                                    Support continuous AI improvements for better conversations
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">
                                    Help expand to multiple languages and regions
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">
                                    Contribute to a growing community of faith-driven technology
                                </p>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Impact */}
                    <motion.div
                        className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-6 shadow-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FiUsers className="text-[var(--accent)]" size={24} />
                            <h2 className="text-xl font-black text-[var(--foreground)]">Our Impact</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-[var(--accent)]/5 p-4 rounded-2xl border border-[var(--accent)]/20">
                                <div className="text-3xl font-black text-[var(--accent)] mb-1">1,000+</div>
                                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Active Users</div>
                            </div>
                            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20">
                                <div className="text-3xl font-black text-blue-500 mb-1">10,000+</div>
                                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Conversations Guided</div>
                            </div>
                            <div className="bg-purple-500/5 p-4 rounded-2xl border border-purple-500/20">
                                <div className="text-3xl font-black text-purple-500 mb-1">24/7</div>
                                <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Spiritual Support</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sponsorship Form */}
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
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">
                                    Your Name *
                                </label>
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
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">
                                    Email Address *
                                </label>
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
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">
                                    Organization (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                    placeholder="Your Church or Company"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">
                                    Sponsorship Amount
                                </label>
                                <select
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all"
                                >
                                    <option value="">Select an amount</option>
                                    <option value="10">$10/month - Supporter</option>
                                    <option value="50">$50/month - Patron</option>
                                    <option value="100">$100/month - Benefactor</option>
                                    <option value="500">$500/month - Major Sponsor</option>
                                    <option value="custom">Custom Amount</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1 mb-2 block">
                                Message (Optional)
                            </label>
                            <textarea
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[var(--accent)]/20 outline-none transition-all resize-none"
                                placeholder="Tell us about your interest in sponsoring ShepherdAI..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-[var(--accent)] to-blue-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:shadow-lg hover:shadow-[var(--accent)]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Sponsorship Request"}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-[var(--accent)]/5 rounded-2xl border border-[var(--accent)]/20">
                        <p className="text-xs text-center text-[var(--muted)]">
                            <FiMail className="inline mr-2" />
                            Have questions? Reach out to us at{" "}
                            <Link href="/contact" className="text-[var(--accent)] hover:underline font-bold">
                                our contact page
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Thank You Note */}
                <motion.div
                    className="mt-6 bg-gradient-to-r from-[var(--accent)]/5 to-blue-500/5 border border-[var(--card-border)] rounded-3xl p-8 text-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <FiHeart className="w-12 h-12 text-[var(--accent)] mx-auto mb-4 fill-current" />
                    <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Thank You for Your Support! 🙏</h3>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Every contribution, no matter the size, helps us continue our mission of providing
                        accessible spiritual guidance through AI technology. Your generosity blesses countless lives.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
