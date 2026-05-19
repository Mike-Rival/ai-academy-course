'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  markLessonVisited,
  markLessonComplete,
  isLessonComplete,
  subscribeToProgress,
} from '@/lib/progress';

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
  const router = useRouter();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    markLessonVisited(lessonId);
    setComplete(isLessonComplete(lessonId));
    const unsub = subscribeToProgress(() =>
      setComplete(isLessonComplete(lessonId)),
    );
    return unsub;
  }, [lessonId]);

  const onNextClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!nav?.nextHref) return;
      e.preventDefault();
      markLessonComplete(lessonId);
      router.push(nav.nextHref);
    },
    [lessonId, nav?.nextHref, router],
  );

  const onMarkComplete = useCallback(() => {
    markLessonComplete(lessonId);
  }, [lessonId]);

  return (
    <article>
      <div className="mb-6 text-sm flex items-center justify-between gap-2">
        <Link href={trackHref} className="text-slate-500 hover:text-brand-600">
          ← {trackLabel}
        </Link>
        {complete && (
          <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900">
            ✓ Lesson complete
          </span>
        )}
      </div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {estMinutes && (
          <div className="text-sm text-slate-500 mt-1">~{estMinutes} min</div>
        )}
      </header>
      <div className="prose-lesson max-w-none">{children}</div>

      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
        {!complete && (
          <div className="mb-6 flex items-center justify-center">
            <button
              onClick={onMarkComplete}
              className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
            >
              {nav?.nextHref ? 'Mark this lesson complete' : 'Mark lesson complete'}
            </button>
          </div>
        )}

        {nav && (nav.prevHref || nav.nextHref) && (
          <div className="flex justify-between gap-4 text-sm">
            <div className="flex-1">
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
            <div className="flex-1">
              {nav.nextHref && (
                <Link
                  href={nav.nextHref}
                  onClick={onNextClick}
                  className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-right"
                >
                  <div className="text-xs text-slate-500">Next →</div>
                  <div className="font-medium">{nav.nextTitle}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    (also marks this lesson complete)
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
