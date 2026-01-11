"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHeart, FiShield, FiCheck } from "react-icons/fi";

export default function TermsPage() {
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
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 mb-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                            <FiShield size={32} />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tight text-[var(--foreground)]">Terms of Service</h1>
                            <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Last updated: January 10, 2026</p>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 shadow-lg space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <section>
                        <h2 className="text-xl font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
                            <FiHeart className="text-[var(--accent)]" />
                            Welcome to ShepherdAI
                        </h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            ShepherdAI is a faith-based conversational AI companion designed to provide spiritual guidance,
                            prayer support, and scripture-inspired comfort. By using our service, you agree to these terms.
                        </p>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">1. Acceptance of Terms</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            By accessing and using ShepherdAI, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">2. Service Description</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FiCheck className="text-[var(--accent)] mt-1 flex-shrink-0" />
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Faith Companion:</strong> AI-powered conversations focused on Christian values and biblical wisdom
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiCheck className="text-[var(--accent)] mt-1 flex-shrink-0" />
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Prayer Support:</strong> Guidance for prayer and spiritual reflection
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiCheck className="text-[var(--accent)] mt-1 flex-shrink-0" />
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Scripture Insights:</strong> References and reflections based on biblical teachings
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">3. User Responsibilities</h2>
                        <ul className="space-y-2 text-[var(--muted)] list-disc list-inside">
                            <li>Use the service respectfully and in accordance with Christian values</li>
                            <li>Do not use the service for harmful, illegal, or inappropriate purposes</li>
                            <li>Keep your account credentials secure and confidential</li>
                            <li>Understand that AI guidance is supplementary to, not a replacement for, professional spiritual counseling</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">4. Content and Intellectual Property</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            All conversations are private between you and ShepherdAI. We respect the sanctity of your spiritual
                            journey and maintain strict confidentiality of your chats. Biblical content and scripture references
                            remain the property of their respective sources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">5. Limitation of Liability</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            ShepherdAI provides spiritual support and guidance powered by AI technology. While we strive for
                            accuracy and helpfulness, we are not a substitute for professional religious counseling, therapy,
                            or medical advice. For serious spiritual or mental health concerns, please consult qualified professionals.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">6. Modifications to Service</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
                            We will notify users of significant changes to these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">7. Termination</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            Users may delete their account at any time through the settings page. We reserve the right to
                            terminate accounts that violate these terms or misuse the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">8. Contact Us</h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                            If you have questions about these Terms of Service, please reach out via our{" "}
                            <Link href="/contact" className="text-[var(--accent)] hover:underline font-bold">
                                contact page
                            </Link>.
                        </p>
                    </section>

                    <div className="mt-8 p-6 bg-[var(--accent)]/5 rounded-2xl border border-[var(--accent)]/20">
                        <p className="text-xs text-[var(--muted)] text-center">
                            By continuing to use ShepherdAI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
