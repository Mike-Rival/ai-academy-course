'use client';

import { useCallback, useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import {
  preloadPyodide,
  runPython,
  type PyTest,
  type RunResult,
} from '@/lib/pyodide-client';
import { markExerciseComplete } from '@/lib/progress';

export type CodeExerciseProps = {
  exerciseId: string;
  prompt: React.ReactNode;
  starterCode: string;
  solution?: string;
  tests?: PyTest[];
  packages?: string[];
  hint?: React.ReactNode;
};

export default function CodeExercise({
  exerciseId,
  prompt,
  starterCode,
  solution,
  tests = [],
  packages = [],
  hint,
}: CodeExerciseProps) {
  const [code, setCode] = useState(starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [pyReady, setPyReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    preloadPyodide(packages).then(() => setPyReady(true));
    // packages list is read once on mount intentionally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    const res = await runPython({ code, tests, packages });
    setResult(res);
    setRunning(false);
    const allPassed =
      res.ok &&
      (res.testResults === null || res.testResults.every((t) => t.passed));
    if (allPassed && tests.length > 0) {
      markExerciseComplete(exerciseId);
    }
  }, [code, tests, packages, exerciseId]);

  const onReset = useCallback(() => {
    setCode(starterCode);
    setResult(null);
  }, [starterCode]);

  const allPassed =
    result?.ok &&
    (result.testResults === null || result.testResults.every((t) => t.passed));

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="text-sm font-medium text-slate-500 mb-1">Exercise</div>
        <div className="prose-lesson text-[15px]">{prompt}</div>
      </div>

      <CodeEditor value={code} onChange={setCode} />

      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onRun}
          disabled={!pyReady || running}
          className="px-4 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50"
        >
          {!pyReady ? 'Loading Python…' : running ? 'Running…' : 'Run & Check'}
        </button>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Reset
        </button>
        {hint && (
          <button
            onClick={() => setShowHint((s) => !s)}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {showHint ? 'Hide hint' : 'Hint'}
          </button>
        )}
        {solution && (
          <button
            onClick={() => setShowSolution((s) => !s)}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {showSolution ? 'Hide solution' : 'Show solution'}
          </button>
        )}
      </div>

      {showHint && hint && (
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-900 text-sm">
          <span className="font-medium">Hint: </span>
          {hint}
        </div>
      )}

      {showSolution && solution && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm font-medium mb-2">Solution</div>
          <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto">
            <code>{solution}</code>
          </pre>
        </div>
      )}

      {result && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 text-sm">
          {result.stdout && (
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Output</div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                {result.stdout}
              </pre>
            </div>
          )}
          {result.error && (
            <div>
              <div className="text-xs uppercase tracking-wide text-red-500 mb-1">Error</div>
              <pre className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                {result.error}
              </pre>
            </div>
          )}
          {result.testResults && result.testResults.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Checks</div>
              <ul className="space-y-1">
                {result.testResults.map((t, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span
                      className={
                        t.passed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {t.passed ? '✓' : '✗'}
                    </span>
                    <div>
                      <div className={t.passed ? '' : 'text-red-700 dark:text-red-300'}>
                        {t.name}
                      </div>
                      {!t.passed && t.message && (
                        <div className="text-xs text-slate-500 mt-0.5">{t.message}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {allPassed && tests.length > 0 && (
            <div className="p-3 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-200">
              All checks passed. Progress saved.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
