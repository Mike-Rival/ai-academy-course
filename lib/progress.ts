'use client';

// Browser-only progress tracking. localStorage today, swap-in-able later.

const KEY = 'cra:progress:v1';

type ProgressShape = {
  exercises: Record<string, { completedAt: string }>;
  lessons: Record<string, { visitedAt: string }>;
};

function read(): ProgressShape {
  if (typeof window === 'undefined') return { exercises: {}, lessons: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { exercises: {}, lessons: {} };
    return JSON.parse(raw) as ProgressShape;
  } catch {
    return { exercises: {}, lessons: {} };
  }
}

function write(p: ProgressShape) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
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

export function getCompletedExerciseIds(): string[] {
  return Object.keys(read().exercises);
}

export function getVisitedLessonIds(): string[] {
  return Object.keys(read().lessons);
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
