'use client';

// Client-side wrapper that talks to /pyodide-worker.js. Lazy-initializes a
// single worker per page and serializes run calls through it.

export type PyTest = {
  name: string;
  code: string;
  hint?: string;
};

export type RunRequest = {
  code: string;
  tests?: PyTest[];
  packages?: string[];
};

export type TestResult = {
  name: string;
  passed: boolean;
  message?: string;
};

export type RunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
  testResults: TestResult[] | null;
};

let workerSingleton: Worker | null = null;
let nextId = 1;
const pending = new Map<number, (r: RunResult) => void>();
let preloadOnce: Promise<void> | null = null;

// Respect Next.js basePath so the worker URL works on GH Pages subpath hosting.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getWorker(): Worker {
  if (workerSingleton) return workerSingleton;
  workerSingleton = new Worker(`${BASE_PATH}/pyodide-worker.js`);
  workerSingleton.onmessage = (ev: MessageEvent) => {
    const msg = ev.data as { type: string; id: number } & Partial<RunResult>;
    if (msg.type === 'result') {
      const resolver = pending.get(msg.id);
      if (resolver) {
        pending.delete(msg.id);
        resolver({
          ok: !!msg.ok,
          stdout: msg.stdout ?? '',
          stderr: msg.stderr ?? '',
          error: (msg.error as string | null) ?? null,
          testResults: (msg.testResults as TestResult[] | null) ?? null,
        });
      }
    } else if (msg.type === 'preloaded') {
      // resolved by preload's own listener below
    }
  };
  return workerSingleton;
}

export function preloadPyodide(packages?: string[]): Promise<void> {
  if (preloadOnce) return preloadOnce;
  preloadOnce = new Promise<void>((resolve) => {
    const w = getWorker();
    const id = nextId++;
    const handler = (ev: MessageEvent) => {
      const msg = ev.data as { type: string; id: number };
      if (msg.type === 'preloaded' && msg.id === id) {
        w.removeEventListener('message', handler);
        resolve();
      }
    };
    w.addEventListener('message', handler);
    w.postMessage({ type: 'preload', payload: { id, packages } });
  });
  return preloadOnce;
}

export function runPython(req: RunRequest): Promise<RunResult> {
  const w = getWorker();
  const id = nextId++;
  return new Promise<RunResult>((resolve) => {
    pending.set(id, resolve);
    w.postMessage({ type: 'run', payload: { id, ...req } });
  });
}
