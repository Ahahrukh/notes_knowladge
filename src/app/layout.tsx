import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes Knowladge — Hinglish Dev Notes",
  description:
    "Step-by-step AI notes with Python, NumPy, pandas, Matplotlib, ML fundamentals, GenAI topics, projects, and interview questions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800/80 backdrop-blur sticky top-0 z-30 bg-slate-950/60">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-2xl">📚</span>
              <span className="text-white">Notes Knowladge</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                · Hinglish dev notes
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/topics" className="text-slate-300 hover:text-white">
                Topics
              </Link>
              <Link href="/projects" className="text-slate-300 hover:text-white">
                Projects
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-800/80 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-400">
            Built with Next.js + MongoDB · Add new topics by editing
            <code className="mx-1 text-brand-100">scripts/seed.mjs</code>
          </div>
        </footer>
      </body>
    </html>
  );
}
