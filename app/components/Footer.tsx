"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
    const { data: session } = useSession();
    if (session) return null;

    return (
        <footer className="mt-20 py-12 glass border-t-0">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[var(--card-border)] pb-12">
                    <div className="space-y-4">
                        <div className="font-black text-2xl tracking-tighter">
                            ShepherdAI<span className="text-[var(--accent)]">.</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <div className="text-xs text-[var(--muted)]">
                        © {new Date().getFullYear()}  All rights reserved.
                    </div>

                    <div className="flex gap-6 text-xs text-[var(--muted)] font-bold tracking-tighter">
                        <Link href="/sponsor" className="hover:text-[var(--foreground)]">Privacy</Link>
                        <Link href="/terms" className="hover:text-[var(--foreground)]">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
