"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ChatModal from "@/app/components/ChatModal";

type ChatContextType = {
  activeChatId: string | null;
  openChat: (id?: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const openChat = (id?: string) => {
    setActiveChatId(id || null);
    setOpen(true);
  };

  const closeChat = () => {
    setOpen(false);
    setActiveChatId(null);
  };

  return (
    <ChatContext.Provider
      value={{
        activeChatId,
        openChat,
        closeChat,
      }}
    >
      {children}
      <ChatModal open={open} onClose={closeChat} chatId={activeChatId} />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
