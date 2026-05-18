'use client';

import { useState } from 'react';
import { markExerciseComplete } from '@/lib/progress';

// ---------- Multiple choice ----------

export type MCOption = {
  id: string;
  text: string;
  correct?: boolean;
  rationale: string; // shown after selection — why this is right or wrong
};

export function MultipleChoice({
  exerciseId,
  prompt,
  options,
  multi = false,
}: {
  exerciseId: string;
  prompt: React.ReactNode;
  options: MCOption[];
  multi?: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    if (submitted) return;
    if (multi) {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelected(next);
    } else {
      setSelected(new Set([id]));
    }
  }

  function submit() {
    setSubmitted(true);
    const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
    const right =
      selected.size === correctIds.size &&
      [...selected].every((id) => correctIds.has(id));
    if (right) markExerciseComplete(exerciseId);
  }

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="text-sm font-medium text-slate-500 mb-2">Check your thinking</div>
      <div className="prose-lesson text-[15px] mb-4">{prompt}</div>
      <ul className="space-y-2">
        {options.map((o) => {
          const isSel = selected.has(o.id);
          const reveal = submitted;
          const stateClass = reveal
            ? o.correct
              ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
              : isSel
              ? 'border-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-slate-200 dark:border-slate-800'
            : isSel
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400';
          return (
            <li key={o.id}>
              <button
                onClick={() => toggle(o.id)}
                disabled={submitted}
                className={`w-full text-left border rounded-lg p-3 transition ${stateClass}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-${multi ? 'sm' : 'full'} border ${
                      isSel ? 'bg-brand-600 border-brand-600' : 'border-slate-400'
                    } flex-shrink-0`}
                  />
                  <div>
                    <div>{o.text}</div>
                    {reveal && (
                      <div
                        className={`mt-2 text-sm ${
                          o.correct
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="font-medium">
                          {o.correct ? 'Correct. ' : isSel ? 'Not quite. ' : ''}
                        </span>
                        {o.rationale}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {!submitted && (
        <button
          onClick={submit}
          disabled={selected.size === 0}
          className="mt-4 px-4 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50"
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ---------- Categorize (sort items into buckets) ----------

export type CategorizeItem = { id: string; text: string; bucket: string };
export type CategorizeBucket = { id: string; label: string; description?: string };

export function Categorize({
  exerciseId,
  prompt,
  items,
  buckets,
}: {
  exerciseId: string;
  prompt: React.ReactNode;
  items: CategorizeItem[];
  buckets: CategorizeBucket[];
}) {
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    Object.fromEntries(items.map((i) => [i.id, null])),
  );
  const [submitted, setSubmitted] = useState(false);

  const unplaced = items.filter((i) => placements[i.id] == null);

  function place(itemId: string, bucketId: string) {
    if (submitted) return;
    setPlacements({ ...placements, [itemId]: bucketId });
  }

  function clearPlacement(itemId: string) {
    if (submitted) return;
    setPlacements({ ...placements, [itemId]: null });
  }

  function submit() {
    setSubmitted(true);
    const allRight = items.every((i) => placements[i.id] === i.bucket);
    if (allRight) markExerciseComplete(exerciseId);
  }

  function reset() {
    setPlacements(Object.fromEntries(items.map((i) => [i.id, null])));
    setSubmitted(false);
  }

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="text-sm font-medium text-slate-500 mb-2">Sort them out</div>
      <div className="prose-lesson text-[15px] mb-4">{prompt}</div>

      {unplaced.length > 0 && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">To sort</div>
          <div className="flex flex-wrap gap-2">
            {unplaced.map((i) => (
              <div
                key={i.id}
                className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm flex items-center gap-2"
              >
                <span>{i.text}</span>
                <div className="flex gap-1">
                  {buckets.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => place(i.id, b.id)}
                      className="text-xs px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      title={`Put in: ${b.label}`}
                    >
                      → {b.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {buckets.map((b) => {
          const itemsHere = items.filter((i) => placements[i.id] === b.id);
          return (
            <div
              key={b.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 min-h-[80px]"
            >
              <div className="text-sm font-semibold mb-1">{b.label}</div>
              {b.description && (
                <div className="text-xs text-slate-500 mb-2">{b.description}</div>
              )}
              <ul className="space-y-1.5">
                {itemsHere.map((i) => {
                  const correct = i.bucket === b.id;
                  const reveal = submitted;
                  return (
                    <li
                      key={i.id}
                      className={`text-sm px-2 py-1 rounded flex items-center justify-between ${
                        reveal
                          ? correct
                            ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
                            : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      <span>{i.text}</span>
                      {!submitted && (
                        <button
                          onClick={() => clearPlacement(i.id)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          ×
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={unplaced.length > 0}
            className="px-4 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-sm"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Reflection (free text, reveal model answer) ----------

export function Reflection({
  exerciseId,
  prompt,
  modelAnswer,
}: {
  exerciseId: string;
  prompt: React.ReactNode;
  modelAnswer: React.ReactNode;
}) {
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);

  function reveal() {
    setRevealed(true);
    if (text.trim().length > 20) markExerciseComplete(exerciseId);
  }

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="text-sm font-medium text-slate-500 mb-2">Reflect</div>
      <div className="prose-lesson text-[15px] mb-3">{prompt}</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-sm font-sans"
        placeholder="Write your answer here. The point is to commit to a position before you see ours."
      />
      <button
        onClick={reveal}
        disabled={text.trim().length < 10 || revealed}
        className="mt-3 px-4 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50"
      >
        {revealed ? 'Revealed' : "Reveal our take"}
      </button>
      {revealed && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-sm font-semibold mb-2">Our take</div>
          <div className="prose-lesson text-[15px]">{modelAnswer}</div>
          <div className="mt-3 text-xs text-slate-500">
            This is one defensible answer, not the answer. If yours differs and you can
            justify it, that's a sign of engagement, not error.
          </div>
        </div>
      )}
    </div>
  );
}
