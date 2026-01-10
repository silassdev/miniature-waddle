"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleSignIn = async () => {
        setLoading("google");
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            toast.error("Failed to sign in with Google");
            setLoading(null);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading("email");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        if (result?.error) {
            toast.error(result.error || "Invalid email or password");
            setLoading(null);
        } else {
            toast.success("Welcome back!");
            window.location.href = "/";
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '1s' }} />
            </div>

            <div className="container py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass border border-white/20 backdrop-blur-sm shadow-sm"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Welcome Back</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                        >
                            Shepherd<span className="text-[var(--accent)]">AI</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-[var(--muted)]"
                        >
                            Your spiritual companion for a prayerful life
                        </motion.p>
                    </div>

                    {/* Login Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card p-8 shadow-2xl relative overflow-hidden"
                    >
                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] outline-none focus:ring-2 ring-[var(--accent)]/20 transition-all text-sm"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] outline-none focus:ring-2 ring-[var(--accent)]/20 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading !== null}
                                className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm shadow-lg hover:shadow-[var(--accent)]/20 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading === "email" ? "Signing In..." : "Log In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--card-border)]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="px-4 bg-[var(--card)] text-[var(--muted)]">
                                    Or
                                </span>
                            </div>
                        </div>

                        {/* Google Sign-in */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading !== null}
                            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--card-border)]/5 transition-all disabled:opacity-50"
                        >
                            <FcGoogle size={20} />
                            {loading === "google" ? "Connecting..." : "Continue with Google"}
                        </button>

                        <p className="mt-8 text-center text-xs text-[var(--muted)] font-medium">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-[var(--accent)] hover:underline">
                                Terms
                            </Link>{" "}
                            &{" "}
                            <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                                Privacy
                            </Link>
                        </p>
                    </motion.div>

                    {/* Help/Support */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10 text-center space-y-4"
                    >
                        <p className="text-sm text-[var(--muted)]">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-[var(--accent)] font-bold hover:underline">
                                Create account
                            </Link>
                        </p>
                        <Link
                            href="/"
                            className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
