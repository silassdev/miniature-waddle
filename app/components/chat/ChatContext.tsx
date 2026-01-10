"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ChatModal from "@/app/components/ChatModal";

type ChatContextType = {
  activeChatId: string | null;
  openChat: (id?: string) => void;
  openHistory: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const openChat = (id?: string) => {
    setActiveChatId(id || null);
    setShowHistory(false);
    setOpen(true);
  };

  const openHistory = () => {
    setShowHistory(true);
    setOpen(true);
  };

  const closeChat = () => {
    setOpen(false);
    setActiveChatId(null);
    setShowHistory(false);
  };

  return (
    <ChatContext.Provider
      value={{
        activeChatId,
        openChat,
        openHistory,
        closeChat,
      }}
    >
      {children}
      <ChatModal
        open={open}
        onClose={closeChat}
        chatId={activeChatId}
        initialView={showHistory ? "history" : "chat"}
      />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
