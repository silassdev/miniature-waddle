"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        setLoading("google");
        await signIn("google", { callbackUrl: "/" });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading("register");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            // Success! auto login or redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
            setLoading(null);
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
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Join Community</span>
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
                            Start your spiritual journey today
                        </motion.p>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card p-8 shadow-2xl relative overflow-hidden"
                    >
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 ml-1">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] outline-none focus:ring-2 ring-[var(--accent)]/20 transition-all text-sm"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] outline-none focus:ring-2 ring-[var(--accent)]/20 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                {loading === "register" ? "Creating Account..." : "Sign Up"}
                            </button>
                        </form>

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

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading !== null}
                            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--card-border)]/5 transition-all disabled:opacity-50"
                        >
                            <FcGoogle size={20} />
                            Continue with Google
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10 text-center space-y-4"
                    >
                        <p className="text-sm text-[var(--muted)]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[var(--accent)] font-bold hover:underline">
                                Log in
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
