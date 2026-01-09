"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ChatModal from "@/app/components/ChatModal";

type ChatContextType = {
  openChat: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        openChat: () => setOpen(true),
        closeChat: () => setOpen(false),
      }}
    >
      {children}
      <ChatModal open={open} onClose={() => setOpen(false)} />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
