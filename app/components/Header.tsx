"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiMessageSquare } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useChat } from "@/app/components/chat/ChatContext";

export default function Header() {
  const { data: session } = useSession();
  const { openChat } = useChat();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  return (
    <header className={`header transition-all duration-300 ${isScrolled ? "shadow-sm" : "bg-transparent border-transparent"}`}>
      <div className="container flex items-center justify-between h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--accent)] text-white shadow-md">
            <FiHeart className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight block leading-none">ShepherdAI</span>
            <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">Assistant</span>
          </div>
        </Link>


        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={openChat}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 transition"
          >
            <FiMessageSquare size={14} />
            Start Chat
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-[var(--card-border)]" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-xs flex items-center gap-2">
              <FiUser className="w-3 h-3" /> Sign In
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--card)] border-b border-[var(--card-border)]"
          >
            <div className="container py-4 flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openChat();
                }}
                className="text-left text-sm font-bold py-2 text-[var(--accent)]"
              >
                Start Chat
              </button>

              <hr className="border-[var(--card-border)]" />

              {session ? (
                <button onClick={() => signOut()} className="text-left text-sm text-red-500 font-medium py-2">
                  Sign Out
                </button>
              ) : (
                <Link href="/login" className="text-sm font-medium py-2">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
