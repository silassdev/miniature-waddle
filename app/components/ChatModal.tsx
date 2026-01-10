"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend } from "react-icons/fi";
import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    text: "Welcome. How can I support you today?",
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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((m) => [...m, userMessage]);
    setInput("");

    // pessimistic “thinking” message
    const thinkingId = crypto.randomUUID();
    setMessages((m) => [...m, { role: "ai", text: "ShepherdAI is reflecting…" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((m) =>
        m.slice(0, -1).concat({
          role: "ai",
          text: data.text,
        })
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((m) =>
        m.slice(0, -1).concat({
          role: "ai",
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        })
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-x-0 top-[8%] mx-auto max-w-xl w-[92%]"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
          >
            <div className="card h-[520px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
                <strong>ShepherdAI</strong>
                <button onClick={onClose} aria-label="Close chat">
                  <FiX />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--card)]/40">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === "user"
                        ? "bg-[var(--accent)] text-white rounded-tr-none"
                        : "bg-[var(--card)] border border-[var(--card-border)] rounded-tl-none"
                        }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[var(--card-border)]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for prayer, guidance, or scripture…"
                    className="flex-1 rounded-full px-4 py-2 border border-[var(--card-border)] text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-[var(--accent)] text-white"
                  >
                    <FiSend size={14} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
