"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPlus, FiHeart, FiLock } from "react-icons/fi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChatModal from "@/app/components/ChatModal";

const TAGLINES = [
  "Scripture-centered guidance for your daily walk.",
  "A peaceful space for prayer and reflection.",
  "Growing in faith with compassionate AI.",
];

export default function Home() {
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const currentFullText = TAGLINES[taglineIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, taglineIndex]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 pb-20 px-4">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-5xl space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative py-12">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-[var(--accent)]/30 rotate-6"
            >
              <FiHeart className="w-8 h-8 fill-current -rotate-6" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
              Shepherd<span className="text-[var(--accent)]">AI</span>
            </h1>
            <div className="h-8 flex justify-center items-center">
              <p className="text-lg md:text-xl font-medium text-[var(--muted)] tracking-tight">
                {displayText}
                <span className="w-0.5 h-6 bg-[var(--accent)] ml-1 animate-pulse inline-block align-middle" />
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => setChatOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--accent)] text-white font-bold shadow-xl shadow-[var(--accent)]/25 hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Start Chatting
            </button>

            {!session && (
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-[var(--card-border)] bg-[var(--card)]/50 backdrop-blur-sm text-[var(--foreground)] font-bold hover:bg-[var(--card-border)]/10 transition-all flex items-center justify-center gap-2"
              >
                <FiLock className="w-4 h-4" />
                Sign in to save history
              </Link>
            )}
          </motion.div>
        </section>

        {/* Premium Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-4xl mx-auto group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-blue-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative card border-[var(--card-border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[500px]">
            {/* Mock Header */}
            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--background)]/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg">
                  <FiHeart className="fill-current w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold tracking-tight leading-none">ShepherdAI</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-[var(--accent)] mt-1">Faith Companion</p>
                </div>
              </div>
              {!session && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20"
                >
                  <FiLock size={12} /> Status: Anonymous
                </motion.div>
              )}
            </div>

            {/* Mock Content */}
            <div className="flex-1 p-8 space-y-6 overflow-hidden relative">
              <div className="flex justify-start">
                <div className="bg-[var(--background)] border border-[var(--card-border)] p-5 rounded-3xl rounded-tl-none max-w-[80%] text-sm shadow-sm leading-relaxed">
                  Hello! I am ShepherdAI. I'm here to provide scripture-inspired comfort and prayer.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[var(--accent)] text-white p-5 rounded-3xl rounded-tr-none max-w-[80%] text-sm shadow-xl shadow-[var(--accent)]/20 font-medium">
                  How do I keep my faith strong during difficult times?
                </div>
              </div>
              <div className="flex justify-start opacity-70">
                <div className="bg-[var(--background)] border border-[var(--card-border)] p-5 rounded-3xl rounded-tl-none max-w-[80%] text-sm shadow-sm leading-relaxed">
                  James 1:2-4 tells us: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds..."
                </div>
              </div>

              {/* Login Overlay Gradient */}
              {!session && (
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/90 to-transparent flex flex-col items-center justify-end pb-12 px-6 text-center">
                  <div className="p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4 max-w-sm shadow-2xl transform translate-y-4">
                    <h4 className="font-bold text-lg tracking-tight italic">"Behold, I stand at the door and knock."</h4>
                    <p className="text-xs text-[var(--muted)] px-4">
                      Log in to unlock your full spiritual history and continue your deep conversations with ShepherdAI.
                    </p>
                    <Link
                      href="/login"
                      className="inline-block w-full py-3 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                    >
                      Sign In Now
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mock Input Area */}
            <div className="p-6 border-t border-[var(--card-border)] bg-[var(--background)]/20">
              <div className="flex items-center gap-3 bg-[var(--card)]/50 border border-[var(--card-border)] rounded-2xl px-5 py-4 opacity-50">
                <span className="text-sm text-[var(--muted)] flex-1 italic">Type your prayer or question...</span>
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white">
                  <FiSend size={14} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {["Morning Reflections", "Prayer Support", "Biblical Wisdom", "Daily Encouragement"].map((p) => (
            <button
              key={p}
              onClick={() => setChatOpen(true)}
              className="px-6 py-2.5 rounded-full border border-[var(--card-border)] bg-[var(--card)]/30 text-xs font-bold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
