import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Evaluating AI Systems — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '09-evaluation');
  return (
    <LessonShell
      lessonId="ai/09-evaluation"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Evaluating AI Systems"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Evaluation is where most AI projects fall down. The system &ldquo;works
        in demos,&rdquo; ships, and then quietly underperforms in ways no one
        measures. This lesson covers what real evaluation looks like.
      </p>

      <h2>The three kinds of metric</h2>

      <h3>1. Deterministic (best)</h3>
      <p>
        The output is right or wrong by a programmable rule. Examples:
      </p>
      <ul>
        <li>&ldquo;Does this generated SQL run without error?&rdquo;</li>
        <li>&ldquo;Does this code pass the unit tests?&rdquo;</li>
        <li>&ldquo;Is the JSON parseable and conform to schema?&rdquo;</li>
        <li>&ldquo;Did the classifier match the labeled answer?&rdquo;</li>
      </ul>
      <p>
        Use this whenever you can. Cheap, fast, repeatable, doesn&rsquo;t
        depend on a human.
      </p>

      <h3>2. Reference-based (good)</h3>
      <p>
        You have a known-correct output to compare against. Metrics for text:
      </p>
      <ul>
        <li>
          <strong>Exact match</strong>: did the output match the reference word
          for word? Useful for short answers (entity extraction, multiple
          choice).
        </li>
        <li>
          <strong>F1 over tokens</strong>: overlap of words between output and
          reference. More forgiving than exact match.
        </li>
        <li>
          <strong>BLEU, ROUGE</strong>: traditional translation/summarization
          metrics. Reasonable proxies, but they reward surface similarity, not
          meaning.
        </li>
        <li>
          <strong>Embedding similarity</strong>: cosine between the embeddings
          of output and reference. Captures &ldquo;said the same thing
          differently.&rdquo;
        </li>
      </ul>

      <h3>3. Human / LLM-as-judge (last resort)</h3>
      <p>
        For open-ended outputs (long summaries, creative drafts, conversation),
        no deterministic check works and no reference is canonical. You fall
        back to human raters, or — with caveats — to an LLM acting as a judge.
        Both are expensive, slow, and noisy. Use them where you have to, and
        validate the judges against humans periodically.
      </p>
      <p>
        Remember from the LLM Literacy track: an LLM judging another LLM has
        no privileged access to ground truth. It can be wrong, biased toward
        verbose outputs, or sycophantic. Use it as a weak signal.
      </p>

      <h2>Compute classification metrics</h2>

      <CodeExercise
        exerciseId="ai/09/conf-matrix"
        prompt={
          <>
            Given true labels and predicted labels (both binary), compute
            true positives, false positives, true negatives, and false
            negatives. Store them as <code>tp</code>, <code>fp</code>,{' '}
            <code>tn</code>, <code>fn</code>.
          </>
        }
        starterCode={`y_true = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1]
y_pred = [1, 0, 0, 1, 1, 0, 1, 1, 0, 1]

tp = 0
fp = 0
tn = 0
fn = 0

# count each case

print(f"TP={tp} FP={fp} TN={tn} FN={fn}")
`}
        tests={[
          { name: 'tp == 4', code: 'assert tp == 4' },
          { name: 'fp == 2', code: 'assert fp == 2' },
          { name: 'tn == 2', code: 'assert tn == 2' },
          { name: 'fn == 2', code: 'assert fn == 2' },
        ]}
        hint={
          <>
            Loop over <code>zip(y_true, y_pred)</code>; for each pair,
            increment the right counter.
          </>
        }
        solution={`y_true = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1]
y_pred = [1, 0, 0, 1, 1, 0, 1, 1, 0, 1]

tp = fp = tn = fn = 0
for t, p in zip(y_true, y_pred):
    if t == 1 and p == 1: tp += 1
    elif t == 0 and p == 1: fp += 1
    elif t == 0 and p == 0: tn += 1
    else: fn += 1

print(f"TP={tp} FP={fp} TN={tn} FN={fn}")
`}
      />

      <h2>Token-overlap F1</h2>

      <CodeExercise
        exerciseId="ai/09/token-f1"
        prompt={
          <>
            Write <code>token_f1(reference, prediction)</code> that computes
            F1 over whitespace tokens. F1 = 2·P·R / (P+R), where P is
            (overlap tokens / predicted tokens) and R is (overlap tokens /
            reference tokens). Return 0 if either is empty.
          </>
        }
        starterCode={`def token_f1(reference, prediction):
    pass  # replace

print(token_f1("the cat sat on the mat", "the cat sat there"))
print(token_f1("hello world", ""))
`}
        tests={[
          { name: 'identical strings → 1.0', code: 'assert abs(token_f1("a b c", "a b c") - 1.0) < 1e-9' },
          { name: 'empty prediction → 0', code: 'assert token_f1("a b c", "") == 0' },
          { name: 'partial overlap', code: 'r = token_f1("the cat sat", "the cat ran")\nassert abs(r - 2/3) < 1e-9' },
        ]}
        hint={
          <>
            Use <code>set</code> intersection for overlap. Guard against empty
            tokens before dividing.
          </>
        }
        solution={`def token_f1(reference, prediction):
    ref_tokens = reference.split()
    pred_tokens = prediction.split()
    if not ref_tokens or not pred_tokens:
        return 0
    overlap = len(set(ref_tokens) & set(pred_tokens))
    if overlap == 0:
        return 0
    p = overlap / len(pred_tokens)
    r = overlap / len(ref_tokens)
    return 2 * p * r / (p + r)

print(token_f1("the cat sat on the mat", "the cat sat there"))
`}
      />

      <h2>What a real eval looks like</h2>
      <p>
        A real evaluation suite typically has:
      </p>
      <ul>
        <li>
          <strong>A held-out test set</strong> of 200–2000 examples. Diverse,
          covers edge cases, never used in development.
        </li>
        <li>
          <strong>A specific metric per task</strong>. Not &ldquo;quality.&rdquo;{' '}
          &ldquo;Exact match on the entity field.&rdquo;
        </li>
        <li>
          <strong>A confidence interval or stability estimate.</strong> Run
          the eval multiple times if there&rsquo;s randomness. Report{' '}
          <code>mean ± std</code>.
        </li>
        <li>
          <strong>A baseline</strong> to beat. Random predictions. Yesterday&rsquo;s
          model. The simplest possible system.
        </li>
        <li>
          <strong>Slice-level breakdowns</strong>. Overall accuracy can hide
          terrible performance on a specific subgroup. Always look at slices
          (by user type, by language, by document length, etc.).
        </li>
      </ul>

      <h2>Recap</h2>
      <ul>
        <li>Prefer deterministic metrics. Use reference-based next. Use human / LLM judges last.</li>
        <li>Always have a baseline and a held-out set. Always look at slices.</li>
        <li>An AI system without an eval suite is operating on vibes.</li>
      </ul>
    </LessonShell>
  );
}
