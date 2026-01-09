"use client";

import React from "react";
import type { Session } from "next-auth";
import SessionProvider from "./SessionProvider";
import { ChatProvider } from "@/app/components/chat/ChatContext";

export default function RootProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ChatProvider>{children}</ChatProvider>
    </SessionProvider>
  );
}
