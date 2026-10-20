import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { VERSION, UPDATED } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI Academy',
  description:
    'Interactive Python, ML, AI, and LLM-literacy training — runs in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              AI Academy
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/tracks/python" className="hover:text-brand-600">Python</Link>
              <Link href="/tracks/ai-coding" className="hover:text-brand-600">Coding with AI</Link>
              <Link href="/tracks/ml" className="hover:text-brand-600">ML</Link>
              <Link href="/tracks/ai" className="hover:text-brand-600">AI</Link>
              <Link href="/tracks/llm-literacy" className="hover:text-brand-600">LLM Literacy</Link>
              <Link href="/tracks/llm-workflows" className="hover:text-brand-600">LLM Workflows</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-x-4 gap-y-1">
            <span>Runs entirely in your browser. No code is sent to a server.</span>
            <span>
              v{VERSION} · updated {UPDATED}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
