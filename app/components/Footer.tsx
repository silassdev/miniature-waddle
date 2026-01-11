"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiHeart } from "react-icons/fi";

export default function Footer() {
    const { data: session } = useSession();
    if (session) return null;

    return (
        <footer className="mt-20 py-12 glass border-t-0">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[var(--card-border)] pb-12">
                    <div className="space-y-4">
                        <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                            <FiHeart className="text-[var(--accent)] fill-current" size={24} />
                            ShepherdAI<span className="text-[var(--accent)]">.</span>
                        </div>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                            Your faith companion for spiritual guidance, prayer support, and biblical wisdom.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-xs uppercase tracking-widest text-[var(--muted)]">Quick Links</h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/about" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                Contact
                            </Link>
                            <Link href="/sponsor" className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-2">
                                <FiHeart className="fill-current" size={14} />
                                Sponsor Us
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-xs uppercase tracking-widest text-[var(--muted)]">Legal</h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/privacy" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <div className="text-xs text-[var(--muted)]">
                        © {new Date().getFullYear()} ShepherdAI. All rights reserved.
                    </div>

                    <div className="text-xs text-[var(--muted)]">
                        Made with <FiHeart className="inline text-[var(--accent)] fill-current" size={12} /> for the faith community
                    </div>
                </div>
            </div>
        </footer>
    );
}
