"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiMessageSquare, FiHeart } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: number;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "initial-1",
    role: "ai",
    text: "Welcome to ShepherdAI. How can I support your spiritual journey today?",
    timestamp: Date.now(),
  },
];

export default function ChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(ts);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: input,
      timestamp: Date.now()
    };

    setMessages((m) => [...m, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            text: m.text
          }))
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: data.text,
          timestamp: Date.now(),
        }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: Date.now(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with enhanced blur */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-y-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="w-full max-w-2xl bg-[var(--card)] sm:rounded-3xl border border-[var(--card-border)] shadow-2xl flex flex-col h-[90vh] sm:h-[650px] overflow-hidden relative">
              {/* Premium Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 rotate-3">
                      <FiHeart className="w-6 h-6 fill-current -rotate-3" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[var(--background)] shadow-sm animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight leading-none text-[var(--foreground)]">ShepherdAI</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Faith Companion</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--muted)]/40" />
                      <span className="text-[10px] font-medium text-[var(--muted)]">Always here for you</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-[var(--muted)]"
                  aria-label="Close chat"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Messages Container */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent via-[var(--card)]/10 to-transparent"
              >
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
                      <div
                        className={`px-5 py-3.5 rounded-3xl shadow-sm text-sm leading-relaxed ${m.role === "user"
                          ? "bg-[var(--accent)] text-white font-medium rounded-tr-none shadow-[var(--accent)]/10"
                          : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] rounded-tl-none shadow-black/5"
                          }`}
                      >
                        {m.text}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter text-[var(--muted)] px-1 ${m.role === "user" ? "text-right" : "text-left"}`}>
                        {formatTime(m.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="bg-[var(--background)] border border-[var(--card-border)] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-[bounce_1s_infinite_0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-[bounce_1s_infinite_200ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-[bounce_1s_infinite_400ms]" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Reflecting</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-sm shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="relative flex-1 group">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Share a thought or ask for prayer..."
                      disabled={isTyping}
                      className="w-full bg-[var(--card)]/50 border border-[var(--card-border)] rounded-2xl pl-5 pr-12 py-4 text-sm ring-[var(--accent)]/20 focus:ring-4 focus:border-[var(--accent)] outline-none transition-all disabled:opacity-50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-2 rounded-xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none"
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                  </div>
                </form>
                <div className="mt-3 flex justify-center">
                  <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.2em] opacity-50">
                    Spiritually Inspired Guidance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
