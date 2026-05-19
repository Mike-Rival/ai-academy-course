'use client';

// Browser-only progress tracking. localStorage today, swap-in-able later.

const KEY = 'cra:progress:v1';

type ProgressShape = {
  exercises: Record<string, { completedAt: string }>;
  lessons: Record<string, { visitedAt: string }>;
  // lessonsCompleted is a separate set so we can distinguish "visited but did
  // not finish" from "user explicitly marked done (or hit Next)".
  lessonsCompleted: Record<string, { completedAt: string }>;
};

function read(): ProgressShape {
  if (typeof window === 'undefined') {
    return { exercises: {}, lessons: {}, lessonsCompleted: {} };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { exercises: {}, lessons: {}, lessonsCompleted: {} };
    const parsed = JSON.parse(raw) as Partial<ProgressShape>;
    return {
      exercises: parsed.exercises ?? {},
      lessons: parsed.lessons ?? {},
      lessonsCompleted: parsed.lessonsCompleted ?? {},
    };
  } catch {
    return { exercises: {}, lessons: {}, lessonsCompleted: {} };
  }
}

function write(p: ProgressShape) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  // Notify same-tab listeners. The 'storage' event only fires cross-tab.
  try {
    window.dispatchEvent(new CustomEvent('cra:progress-changed'));
  } catch {
    /* noop */
  }
}

export function markExerciseComplete(id: string) {
  const p = read();
  p.exercises[id] = { completedAt: new Date().toISOString() };
  write(p);
}

export function isExerciseComplete(id: string): boolean {
  return !!read().exercises[id];
}

export function markLessonVisited(id: string) {
  const p = read();
  p.lessons[id] = { visitedAt: new Date().toISOString() };
  write(p);
}

export function markLessonComplete(id: string) {
  const p = read();
  p.lessonsCompleted[id] = { completedAt: new Date().toISOString() };
  // Visiting also implied.
  if (!p.lessons[id]) {
    p.lessons[id] = { visitedAt: new Date().toISOString() };
  }
  write(p);
}

export function isLessonComplete(id: string): boolean {
  return !!read().lessonsCompleted[id];
}

export function getCompletedExerciseIds(): string[] {
  return Object.keys(read().exercises);
}

export function getVisitedLessonIds(): string[] {
  return Object.keys(read().lessons);
}

export function getCompletedLessonIds(): string[] {
  return Object.keys(read().lessonsCompleted);
}

export type TrackProgress = {
  completed: number;
  total: number;
  percent: number;
};

export function getTrackProgress(
  trackSlug: string,
  lessonSlugs: string[],
): TrackProgress {
  const done = read().lessonsCompleted;
  const completed = lessonSlugs.filter(
    (slug) => !!done[`${trackSlug}/${slug}`],
  ).length;
  const total = lessonSlugs.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
  try {
    window.dispatchEvent(new CustomEvent('cra:progress-changed'));
  } catch {
    /* noop */
  }
}

// React-friendly subscription to progress changes (same-tab + cross-tab).
export function subscribeToProgress(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onCustom = () => cb();
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener('cra:progress-changed', onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('cra:progress-changed', onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
