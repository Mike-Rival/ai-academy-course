'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { tracks, getTrackMinutes, type TrackMeta } from '@/lib/curriculum';
import { getCompletedLessonIds, subscribeToProgress } from '@/lib/progress';

type TrackProgress = { done: number; total: number; percent: number; allDone: boolean };

function progressFor(track: TrackMeta, completed: Set<string>): TrackProgress {
  const total = track.lessons.length;
  const done = track.lessons.filter((l) => completed.has(`${track.slug}/${l.slug}`)).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
    allDone: done === total && total > 0,
  };
}

function ProgressBadge({ p }: { p: TrackProgress }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded ${
        p.allDone
          ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300'
          : p.done > 0
          ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-100'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
      }`}
    >
      {p.allDone ? '✓ complete' : `${p.done} / ${p.total}`}
    </span>
  );
}

function ProgressBar({ p }: { p: TrackProgress }) {
  return (
    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all ${p.allDone ? 'bg-green-500' : 'bg-brand-600'}`}
        style={{ width: `${p.percent}%` }}
      />
    </div>
  );
}

function formatHours(minutes: number): string {
  const hours = minutes / 60;
  if (hours < 1) return `~${minutes} min`;
  const rounded = Math.round(hours * 2) / 2; // nearest half hour
  return `~${rounded} ${rounded === 1 ? 'hour' : 'hours'}`;
}

function FeaturedTrackCard({
  track,
  p,
  hydrated,
}: {
  track: TrackMeta;
  p: TrackProgress;
  hydrated: boolean;
}) {
  const started = hydrated && p.done > 0 && !p.allDone;
  const cta = p.allDone
    ? 'Review the track'
    : started
    ? 'Continue the track'
    : 'Start the track';

  return (
    <Link
      href={`/tracks/${track.slug}`}
      className={`block rounded-2xl border-2 p-6 sm:p-8 transition hover:border-brand-500 ${
        p.allDone
          ? 'border-green-300 dark:border-green-900 bg-green-50/40 dark:bg-green-950/20'
          : 'border-brand-500/40 dark:border-brand-500/30 bg-brand-50/60 dark:bg-brand-900/10'
      }`}
    >
      <div className="grid md:grid-cols-5 gap-6 md:gap-10">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-brand-600 text-white">
              Start here
            </span>
            {track.badge && (
              <span className="text-xs px-2 py-0.5 rounded border border-brand-500/40 text-brand-700 dark:text-brand-100">
                {track.badge}
              </span>
            )}
            {hydrated && p.done > 0 && <ProgressBadge p={p} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{track.title}</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mt-2">{track.subtitle}</p>
          <p className="text-sm text-slate-500 mt-2">{track.audience}</p>
          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium">
              {cta} →
            </span>
            <span className="text-sm text-slate-500">
              {track.lessons.length} lessons · {formatHours(getTrackMinutes(track))}
            </span>
          </div>
          {hydrated && p.done > 0 && (
            <div className="mt-4">
              <ProgressBar p={p} />
            </div>
          )}
        </div>
        {track.highlights && track.highlights.length > 0 && (
          <div className="md:col-span-2 md:border-l md:border-brand-500/20 md:pl-8">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              You will learn
            </div>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {track.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-brand-600 flex-shrink-0">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
}

function TrackCard({
  track,
  p,
  hydrated,
  anyProgress,
}: {
  track: TrackMeta;
  p: TrackProgress;
  hydrated: boolean;
  anyProgress: boolean;
}) {
  return (
    <Link
      href={`/tracks/${track.slug}`}
      className={`block border rounded-xl p-5 hover:border-brand-500 transition ${
        p.allDone
          ? 'border-green-300 dark:border-green-900 bg-green-50/40 dark:bg-green-950/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="text-xl font-semibold">{track.title}</h3>
        {anyProgress && <ProgressBadge p={p} />}
      </div>
      <p className="text-slate-700 dark:text-slate-300">{track.subtitle}</p>
      <p className="text-sm text-slate-500 mt-2">{track.audience}</p>
      <p className="text-xs text-slate-500 mt-3">
        {track.lessons.length} lessons · {formatHours(getTrackMinutes(track))}
      </p>
      {hydrated && p.done > 0 && (
        <div className="mt-3">
          <ProgressBar p={p} />
        </div>
      )}
    </Link>
  );
}

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
  const featured = tracks.filter((t) => t.featured);
  const rest = tracks.filter((t) => !t.featured);
  const noCode = rest.filter((t) => t.kind === 'no-code');
  const coding = rest.filter((t) => t.kind === 'coding');

  return (
    <div className="space-y-10">
      {featured.length > 0 && (
        <section className="space-y-4">
          {featured.map((t) => (
            <FeaturedTrackCard
              key={t.slug}
              track={t}
              p={progressFor(t, completed)}
              hydrated={hydrated}
            />
          ))}
        </section>
      )}

      {noCode.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">No coding required</h2>
            <p className="text-sm text-slate-500 mt-1">
              Continue from the literacy track: how to actually design LLM-assisted work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noCode.map((t) => (
              <TrackCard
                key={t.slug}
                track={t}
                p={progressFor(t, completed)}
                hydrated={hydrated}
                anyProgress={anyProgress}
              />
            ))}
          </div>
        </section>
      )}

      {coding.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Coding tracks</h2>
            <p className="text-sm text-slate-500 mt-1">
              Hands-on Python runs in your browser — no installs. New to programming?
              Start with Python Basics; each track builds on the one before it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coding.map((t) => (
              <TrackCard
                key={t.slug}
                track={t}
                p={progressFor(t, completed)}
                hydrated={hydrated}
                anyProgress={anyProgress}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
