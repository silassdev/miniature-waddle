import './globals.css';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { ThemeProvider } from './components/ThemeProvider';
import SessionProvider from './providers/SessionProvider';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from './components/chat/ChatContext';

export const metadata = {
  title: 'ShepherdAI',
  description: 'A compassionate Christian conversational assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased text-[var(--foreground)] overflow-x-hidden transition-colors duration-300 bg-[var(--background)]">
        <SessionProvider>
          <ChatProvider>
            <ThemeProvider>
              <Toaster position="top-right" />
              <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-1">
                  {children}
                </main>

                <Footer />
              </div>
            </ThemeProvider>
          </ChatProvider>
        </SessionProvider>
      </body>
    </html>
  );
}