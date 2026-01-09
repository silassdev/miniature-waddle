import './globals.css';
import React from 'react';
import Header from './components/Header';
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

                <footer className="mt-20 py-12 glass border-t-0">
                  <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[var(--card-border)] pb-12">
                      <div className="space-y-4">
                        <div className="font-black text-2xl tracking-tighter">
                          ShepherdAI<span className="text-[var(--accent)]">.</span>
                        </div>
                        <p className="text-[var(--muted)] text-sm leading-relaxed max-w-xs">
                          A compassionate companion for scriptural insight, prayerful reflection, and spiritual growth.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--accent)]">Platform</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted)]">
                          <li>
                            <Link href="/daily" className="hover:text-[var(--foreground)] transition-standard">
                              Daily Bread
                            </Link>
                          </li>
                          <li>
                            <Link href="/prayers" className="hover:text-[var(--foreground)] transition-standard">
                              Prayer Wall
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--accent)]">Support</h4>
                        <ul className="space-y-2 text-sm text-[var(--muted)]">
                          <li>
                            <Link href="/contact" className="hover:text-[var(--foreground)] transition-standard">
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link href="/about" className="hover:text-[var(--foreground)] transition-standard">
                              Our Mission
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                      <div className="text-xs text-[var(--muted)]">
                        © {new Date().getFullYear()} ShepherdAI. All rights reserved.
                      </div>

                      <div className="flex gap-6 text-xs text-[var(--muted)] font-bold uppercase tracking-tighter">
                        <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy</Link>
                        <Link href="/terms" className="hover:text-[var(--foreground)]">Terms</Link>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </ThemeProvider>
          </ChatProvider>
        </SessionProvider>
      </body>
    </html>
  );
}