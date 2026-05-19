'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TrackMeta } from '@/lib/curriculum';
import {
  getCompletedLessonIds,
  getTrackProgress,
  subscribeToProgress,
} from '@/lib/progress';

export default function TrackProgressView({ track }: { track: TrackMeta }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const lessonSlugs = track.lessons.map((l) => l.slug);

  useEffect(() => {
    const refresh = () => setCompleted(new Set(getCompletedLessonIds()));
    refresh();
    return subscribeToProgress(refresh);
  }, []);

  const progress = getTrackProgressLocal(track.slug, lessonSlugs, completed);

  return (
    <div>
      {progress.completed > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Your progress</span>
            <span className="text-slate-600 dark:text-slate-300">
              {progress.completed} of {progress.total} lessons · {progress.percent}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      <ol className="space-y-2">
        {track.lessons.map((lesson, i) => {
          const isAvailable = lesson.status === 'available';
          const lessonId = `${track.slug}/${lesson.slug}`;
          const isComplete = completed.has(lessonId);
          const className = `flex items-start gap-4 p-4 border rounded-lg transition ${
            isAvailable
              ? isComplete
                ? 'border-green-300 dark:border-green-900 bg-green-50/40 dark:bg-green-950/20 hover:border-brand-500'
                : 'border-slate-200 dark:border-slate-800 hover:border-brand-500'
              : 'border-slate-100 dark:border-slate-900 opacity-60'
          }`;
          const content = (
            <>
              <div className="text-slate-400 font-mono text-sm pt-0.5 w-8 flex-shrink-0">
                {isComplete ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{lesson.title}</span>
                  <span className="text-xs text-slate-500">~{lesson.estMinutes} min</span>
                  {!isAvailable && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      coming soon
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {lesson.summary}
                </div>
              </div>
            </>
          );
          return (
            <li key={lesson.slug}>
              {isAvailable ? (
                <Link href={`/tracks/${track.slug}/${lesson.slug}`} className={className}>
                  {content}
                </Link>
              ) : (
                <div className={className}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function getTrackProgressLocal(
  trackSlug: string,
  lessonSlugs: string[],
  completed: Set<string>,
) {
  const total = lessonSlugs.length;
  const done = lessonSlugs.filter((s) => completed.has(`${trackSlug}/${s}`)).length;
  return {
    completed: done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
