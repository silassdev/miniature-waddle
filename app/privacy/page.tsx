"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLock, FiEye, FiShield, FiDatabase } from "react-icons/fi";

export default function PrivacyPage() {
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
                            <FiLock size={32} />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tight text-[var(--foreground)]">Privacy Policy</h1>
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
                        <div className="flex items-center gap-3 mb-4">
                            <FiShield className="text-[var(--accent)]" size={24} />
                            <h2 className="text-xl font-black text-[var(--foreground)]">
                                Your Privacy is Sacred
                            </h2>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed">
                            At ShepherdAI, we understand that your spiritual journey is deeply personal. We are committed
                            to protecting your privacy and maintaining the confidentiality of your conversations with our
                            faith-based AI companion.
                        </p>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
                            <FiDatabase size={20} />
                            1. Information We Collect
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-[var(--foreground)] mb-2">Account Information</h3>
                                <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                                    <li>Name and email address (via Google OAuth)</li>
                                    <li>Profile picture (optional, from Google account)</li>
                                    <li>Account creation date and last login time</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[var(--foreground)] mb-2">Conversation Data</h3>
                                <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                                    <li>Your messages and questions to ShepherdAI</li>
                                    <li>AI responses and spiritual guidance provided</li>
                                    <li>Chat history and timestamps</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[var(--foreground)] mb-2">Technical Data</h3>
                                <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                                    <li>Browser type and device information</li>
                                    <li>IP address and general location (country/region)</li>
                                    <li>Session data and usage statistics</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
                            <FiEye size={20} />
                            2. How We Use Your Information
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Provide Spiritual Support:</strong> To deliver personalized, faith-based conversations and prayer guidance
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Maintain Chat History:</strong> To save your conversations so you can reflect on past discussions
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Improve Our Service:</strong> To enhance AI responses and user experience (anonymized data only)
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[var(--accent)] mt-1">✓</span>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    <strong className="text-[var(--foreground)]">Security & Safety:</strong> To protect against abuse and ensure service integrity
                                </p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">3. Data Sharing & Third Parties</h2>
                        <div className="bg-[var(--accent)]/5 p-6 rounded-2xl border border-[var(--accent)]/20 mb-4">
                            <p className="text-[var(--foreground)] font-bold mb-2">We DO NOT sell your personal information.</p>
                            <p className="text-[var(--muted)] text-sm">
                                Your spiritual conversations remain private and confidential.
                            </p>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed mb-3">
                            We only share data with:
                        </p>
                        <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                            <li><strong className="text-[var(--foreground)]">Google OAuth:</strong> For secure authentication</li>
                            <li><strong className="text-[var(--foreground)]">AI Service Providers:</strong> To process your conversations (with strict confidentiality agreements)</li>
                            <li><strong className="text-[var(--foreground)]">Legal Authorities:</strong> Only when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">4. Data Security</h2>
                        <p className="text-[var(--muted)] leading-relaxed mb-4">
                            We implement industry-standard security measures to protect your data, including:
                        </p>
                        <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                            <li>Encrypted connections (HTTPS/TLS)</li>
                            <li>Secure database storage with access controls</li>
                            <li>Regular security audits and updates</li>
                            <li>Authentication via trusted Google OAuth</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">5. Your Rights & Choices</h2>
                        <div className="space-y-3">
                            <p className="text-[var(--muted)] leading-relaxed">You have the right to:</p>
                            <ul className="space-y-2 text-[var(--muted)] list-disc list-inside ml-4">
                                <li><strong className="text-[var(--foreground)]">Access:</strong> View your profile and conversation history anytime</li>
                                <li><strong className="text-[var(--foreground)]">Update:</strong> Modify your display name and preferences</li>
                                <li><strong className="text-[var(--foreground)]">Delete:</strong> Permanently remove your account and all associated data via the{" "}
                                    <Link href="/settings" className="text-[var(--accent)] hover:underline">settings page</Link>
                                </li>
                                <li><strong className="text-[var(--foreground)]">Unlink:</strong> Disconnect your Google account</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">6. Cookies & Tracking</h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                            We use essential cookies for authentication and session management. We do not use tracking
                            cookies for advertising purposes. You can control cookie preferences in your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">7. Children's Privacy</h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                            ShepherdAI is intended for users aged 13 and above. We do not knowingly collect information
                            from children under 13. If you believe a child has provided us with personal information,
                            please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">8. Changes to This Policy</h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                            We may update this Privacy Policy periodically. We will notify users of significant changes
                            via email or through the service. Continued use after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[var(--foreground)] mb-4">9. Contact Us</h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                            If you have questions, concerns, or requests regarding your privacy, please visit our {" "}
                            <Link href="/contact" className="text-[var(--accent)] hover:underline font-bold">
                                contact page
                            </Link> or reach out to support.
                        </p>
                    </section>

                    <div className="mt-8 p-6 bg-gradient-to-r from-[var(--accent)]/5 to-blue-500/5 rounded-2xl border border-[var(--accent)]/20">
                        <p className="text-sm text-[var(--foreground)] font-bold text-center mb-2">
                            🙏 Your Trust is Our Blessing
                        </p>
                        <p className="text-xs text-[var(--muted)] text-center">
                            We honor the sacred trust you place in us by sharing your spiritual journey.
                            Your privacy and spiritual wellbeing are at the heart of everything we do.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
