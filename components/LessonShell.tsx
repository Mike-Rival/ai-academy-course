'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { markLessonVisited } from '@/lib/progress';

export type LessonNav = {
  prevHref?: string;
  prevTitle?: string;
  nextHref?: string;
  nextTitle?: string;
};

export default function LessonShell({
  lessonId,
  trackLabel,
  trackHref,
  title,
  estMinutes,
  children,
  nav,
}: {
  lessonId: string;
  trackLabel: string;
  trackHref: string;
  title: string;
  estMinutes?: number;
  children: React.ReactNode;
  nav?: LessonNav;
}) {
  useEffect(() => {
    markLessonVisited(lessonId);
  }, [lessonId]);

  return (
    <article>
      <div className="mb-6 text-sm">
        <Link href={trackHref} className="text-slate-500 hover:text-brand-600">
          ← {trackLabel}
        </Link>
      </div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {estMinutes && (
          <div className="text-sm text-slate-500 mt-1">~{estMinutes} min</div>
        )}
      </header>
      <div className="prose-lesson max-w-none">{children}</div>
      {nav && (
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-4 text-sm">
          <div>
            {nav.prevHref && (
              <Link
                href={nav.prevHref}
                className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500"
              >
                <div className="text-xs text-slate-500">← Previous</div>
                <div className="font-medium">{nav.prevTitle}</div>
              </Link>
            )}
          </div>
          <div>
            {nav.nextHref && (
              <Link
                href={nav.nextHref}
                className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-right"
              >
                <div className="text-xs text-slate-500">Next →</div>
                <div className="font-medium">{nav.nextTitle}</div>
              </Link>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
