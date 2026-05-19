'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { tracks } from '@/lib/curriculum';
import { getCompletedLessonIds, subscribeToProgress } from '@/lib/progress';

export default function HomeTrackCards() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setCompleted(new Set(getCompletedLessonIds()));
    refresh();
    setHydrated(true);
    return subscribeToProgress(refresh);
  }, []);

  const anyProgress = hydrated && completed.size > 0;

  return (
    <section className="grid sm:grid-cols-2 gap-4">
      {tracks.map((t) => {
        const total = t.lessons.length;
        const done = t.lessons.filter((l) =>
          completed.has(`${t.slug}/${l.slug}`),
        ).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        const allDone = done === total && total > 0;
        return (
          <Link
            key={t.slug}
            href={`/tracks/${t.slug}`}
            className={`block border rounded-xl p-5 hover:border-brand-500 transition ${
              allDone
                ? 'border-green-300 dark:border-green-900 bg-green-50/40 dark:bg-green-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold">{t.title}</h2>
              {anyProgress && (
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    allDone
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300'
                      : done > 0
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {allDone ? '✓ complete' : `${done} / ${total}`}
                </span>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300">{t.subtitle}</p>
            <p className="text-sm text-slate-500 mt-2">{t.audience}</p>
            {hydrated && done > 0 && (
              <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    allDone ? 'bg-green-500' : 'bg-brand-600'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}
          </Link>
        );
      })}
    </section>
  );
}
