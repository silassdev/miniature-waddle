"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPlus } from "react-icons/fi";
import ChatModal from "@/app/components/ChatModal";

const INITIAL_MESSAGES = [
  { role: "user", text: "How can I find peace during a stressful week?" },
  {
    role: "ai",
    text: "Philippians 4:6-7 reminds us: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' Would you like to pray through this together?",
  },
];

export default function Home() {
  const [messages] = useState(INITIAL_MESSAGES);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="container py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
          Your Spiritual <span className="text-[var(--accent)]">Companion.</span>
        </motion.h1>
        <p className="text-[var(--muted)] text-sm md:text-base">
          ShepherdAI combines scriptural wisdom with modern AI to guide your daily walk with Christ.
        </p>

        {/* START CHAT BUTTON — opens modal (NO ROUTE) */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-6">
          <motion.button
            onClick={() => setChatOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--accent)] text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
            aria-label="Start chat with ShepherdAI"
          >
            <FiPlus />
            Start Chat
          </motion.button>
        </motion.div>
      </section>

      {/* Chat preview (no navigation) */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full">
        <div className="card shadow-2xl shadow-blue-500/5 overflow-hidden border-[var(--card-border)] flex flex-col h-[450px]">
          {/* header, messages, input (unchanged) */}
          <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">ShepherdAI Active</span>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--card-border)]" />
              <div className="w-2 h-2 rounded-full bg-[var(--card-border)]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[var(--card)]/30">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[var(--accent)] text-white rounded-tr-none" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] rounded-tl-none shadow-sm"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-[var(--background)] border-t border-[var(--card-border)]">
            <div className="relative flex items-center bg-[var(--card)] border border-[var(--card-border)] rounded-full px-4 py-2 focus-within:ring-2 ring-[var(--accent)]/20 transition-all">
              <FiPlus className="text-[var(--muted)] mr-2 cursor-pointer hover:text-[var(--foreground)]" />
              <input type="text" placeholder="Ask for wisdom, prayer, or scripture..." className="bg-transparent border-none outline-none text-sm w-full py-1" aria-label="Chat input preview" onKeyDown={(e) => { if (e.key === "Enter") { setChatOpen(true) } }} />
              <button className="ml-2 p-2 bg-[var(--accent)] text-white rounded-full hover:opacity-90 transition-opacity" onClick={() => setChatOpen(true)} aria-label="Open full chat">
                <FiSend size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick action pills */}
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {["Morning Prayer", "Study John 3", "Stress Relief", "Bible Trivia"].map((pill) => (
          <button key={pill} className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-xs font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all" onClick={() => setChatOpen(true)}>
            {pill}
          </button>
        ))}
      </div>

      {/* Modal (client) */}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
