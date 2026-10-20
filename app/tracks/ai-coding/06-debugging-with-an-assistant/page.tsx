import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Debugging Without Being Led in Circles — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '06-debugging-with-an-assistant');
  return (
    <LessonShell
      lessonId="ai-coding/06-debugging-with-an-assistant"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Debugging Without Being Led in Circles"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Assistants are genuinely useful for debugging. They have seen a great
        many error messages and the code that caused them. They are also the
        source of a specific, recognizable bad afternoon: you paste an error,
        get a confident fix, apply it, get a new error, paste that, get another
        fix, and forty minutes later the code is covered in patches and the
        original bug is still there. This lesson is about getting the first
        kind of session and not the second.
      </p>

      <h2>Give it the evidence, not the story</h2>
      <p>
        Lesson 1 applies with full force here. The model can only reason about
        what is in front of it. &ldquo;It crashes sometimes when the list is
        big&rdquo; is a story. The evidence is:
      </p>
      <ul>
        <li>
          <strong>The full error.</strong> The complete traceback, not the last
          line. The frames above the crash are where the cause usually is.
        </li>
        <li>
          <strong>The code that ran.</strong> The actual function, not a
          paraphrase. If it calls helpers, include them or say what they
          return.
        </li>
        <li>
          <strong>A minimal reproduction.</strong> The smallest input that
          triggers the problem. Producing this is work, and it is work that
          often finds the bug on its own, before you ask anyone.
        </li>
        <li>
          <strong>What you expected instead.</strong> &ldquo;Returns 4, should
          return 5&rdquo; beats &ldquo;gives the wrong answer.&rdquo;
        </li>
      </ul>
      <p>
        When you cannot produce a minimal repro, say so, and say what you have
        tried. The model will fill any gap in the evidence with the most
        typical cause for that symptom, and typical is not the same as yours.
      </p>

      <h2>Hypothesis before fix</h2>
      <p>
        The single most useful change to how you phrase debugging requests:
        <strong> ask for a testable hypothesis, not a fix.</strong>
      </p>
      <pre><code>{`Not this:
  "Here's the error. Fix it."

This:
  "Here's the error, the code, and a minimal repro. Before changing
   anything: what do you think the cause is, and what is one thing I
   could run or check that would confirm or rule it out?"`}</code></pre>
      <p>
        This does three things. It forces the model to commit to a claim you
        can check. It gives you a cheap experiment to run instead of a diff to
        review. And it keeps the code clean while you are still finding the
        cause, which matters because every speculative patch that stays in
        the code is one more thing to reason about.
      </p>
      <p>
        If the hypothesis is confirmed, ask for the fix for <em>that cause</em>.
        If it is ruled out, say so and ask for the next hypothesis. You are now
        doing the scientific method with a fast, well-read lab partner,
        instead of accepting patches from an oracle.
      </p>

      <h2>Recognizing a plausible-but-wrong fix</h2>
      <p>
        The characteristic wrong fix makes the symptom go away without
        addressing the cause. Three patterns account for most of them:
      </p>
      <ul>
        <li>
          <strong>Catch and continue.</strong> Wrap the crashing line in a
          <code> try/except</code>. The crash stops. The data that caused it is
          now silently dropped or defaulted, and the bug has moved downstream
          where it is harder to see. Catalog entry 4 from Lesson 5.
        </li>
        <li>
          <strong>Guard the symptom.</strong> Add <code>if x is not None</code>{' '}
          around the failing call. Fine if <code>None</code> is a legitimate
          input. Wrong if <code>None</code> arriving there is itself the bug.
        </li>
        <li>
          <strong>Change the test.</strong> The expected value is edited to
          match the output. Covered in Lesson 4; it comes up in debugging
          sessions constantly.
        </li>
      </ul>
      <p>
        The question to ask of any proposed fix: <em>does this make the
        program correct, or does it make the error message stop?</em> Those are
        different, and the model does not reliably distinguish them because
        both produce a passing run.
      </p>

      <h2>Exercise: the fix that made the crash go away</h2>
      <p>
        Below is a function, the crash it produced, and the fix an assistant
        proposed. The fix stops the crash. It is wrong. Work out what the
        function is supposed to do from its docstring, find the real cause,
        and fix <code>average_scores</code> so the hidden checks pass. You can
        delete the proposed fix entirely.
      </p>

      <CodeExercise
        exerciseId="ai-coding/06/average-scores"
        prompt={
          <>
            <code>average_scores(records)</code> takes a list of dicts like{' '}
            <code>{'{"name": "a", "scores": [1, 2]}'}</code> and returns{' '}
            <code>{'{name: mean}'}</code>. A student with no scores should get{' '}
            <code>0.0</code>. Fix the real bug in <code>average_scores</code>.
            Do not use the assistant&rsquo;s version.
          </>
        }
        starterCode={`def average_scores(records):
    """records: list of dicts like {"name": "a", "scores": [..]}.
    Return {name: mean score}. A student with no scores gets 0.0."""
    result = {}
    for r in records:
        total = 0
        for s in r["scores"]:
            total += s
        result[r["name"]] = total / len(r["scores"])
    return result

# Crash seen in production:
#   ZeroDivisionError: division by zero
#
# Fix suggested by the assistant ("wrap the division so it never crashes"):
def average_scores_fixed(records):
    result = {}
    for r in records:
        try:
            total = 0
            for s in r["scores"]:
                total += s
            result[r["name"]] = total / len(r["scores"])
        except ZeroDivisionError:
            pass
    return result

print(average_scores_fixed([{"name": "a", "scores": [4]}, {"name": "b", "scores": []}]))
`}
        tests={[
          { name: 'Normal case: {"a": [1,2,3]} -> {"a": 2.0}', code: 'assert average_scores([{"name":"a","scores":[1,2,3]}]) == {"a": 2.0}' },
          { name: 'Student with no scores is present with 0.0 (not dropped, no crash)', code: 'assert average_scores([{"name":"b","scores":[]}]) == {"b": 0.0}' },
          { name: 'Mixed input: nobody dropped', code: 'r = average_scores([{"name":"a","scores":[4]},{"name":"b","scores":[]},{"name":"c","scores":[2,4]}]); assert r == {"a":4.0,"b":0.0,"c":3.0}' },
          { name: 'Result keys match the input names exactly', code: 'r = average_scores([{"name":"x","scores":[]},{"name":"y","scores":[1]}]); assert set(r) == {"x","y"}' },
        ]}
        hint={
          <>
            Run the assistant&rsquo;s version on the print line and look at
            the output: student &ldquo;b&rdquo; has vanished. The docstring
            says b should be present with 0.0. The real cause is an unhandled
            empty-list case, and the right fix handles it explicitly rather
            than swallowing the error.
          </>
        }
        solution={`def average_scores(records):
    """records: list of dicts like {"name": "a", "scores": [..]}.
    Return {name: mean score}. A student with no scores gets 0.0."""
    result = {}
    for r in records:
        scores = r["scores"]
        if len(scores) == 0:
            result[r["name"]] = 0.0
            continue
        result[r["name"]] = sum(scores) / len(scores)
    return result

print(average_scores([{"name": "a", "scores": [4]}, {"name": "b", "scores": []}]))
`}
      />

      <p>
        The assistant&rsquo;s fix was not stupid. It was the most common
        response to that traceback in the training data. It was also wrong for
        this function, because the docstring specified what should happen on
        empty input and the fix ignored it. The docstring was in the context;
        the model weighted the error message more heavily. You, reading, can
        weight them correctly.
      </p>

      <h2>When it starts going in circles</h2>
      <p>
        Signs you are in the loop: the model proposes a fix it already
        proposed; each fix introduces a new error in a different place;
        the code is accumulating guards and try/excepts; you are no longer
        sure what the original problem was.
      </p>
      <p>
        The remedy is to stop and reset, not to push harder. The{' '}
        <Link href="/tracks/llm-literacy/04-conversation-rot">
          conversation rot lesson
        </Link>{' '}
        in the Working with LLMs track explains the mechanism: a long thread
        full of failed attempts is context that drags every subsequent answer
        toward the same failed approaches. Concretely:
      </p>
      <ol>
        <li>
          <code>git checkout</code> back to the last known state. Discard the
          patches.
        </li>
        <li>
          Write down what you now know: the repro, what has been ruled out,
          what the hypotheses were.
        </li>
        <li>
          Start a <strong>fresh thread</strong> with that summary and the
          evidence. No history of failed fixes.
        </li>
        <li>
          Ask for a hypothesis, not a fix.
        </li>
      </ol>
      <p>
        Two or three rounds of hypothesis-and-check is normal. Six rounds of
        fix-and-new-error is the signal to reset.
      </p>

      <MultipleChoice
        exerciseId="ai-coding/06/quiz-1"
        prompt={
          <>
            You paste a <code>KeyError: &apos;user_id&apos;</code> traceback.
            The assistant replies: &ldquo;Use <code>.get(&apos;user_id&apos;)</code>{' '}
            instead of <code>[&apos;user_id&apos;]</code> so it returns None
            instead of raising.&rdquo; What is the right response?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Apply it. The crash will stop.',
            rationale:
              'The crash will stop and a None will flow into whatever used user_id next. If the key was supposed to be there, you have converted a loud failure at the cause into a quiet failure somewhere downstream.',
          },
          {
            id: 'b',
            text: 'Ask first: why is the key missing? Is a missing user_id a legitimate case here, or is the real bug upstream where the dict was built?',
            correct: true,
            rationale:
              'Right. The proposed change is a symptom guard. It is correct only if None is a valid state for this code to handle. Establish the cause before choosing a fix.',
          },
          {
            id: 'c',
            text: 'Ask the assistant whether it is sure this is the right fix.',
            rationale:
              'It will say yes. Self-assessment is not evidence. Ask for a testable hypothesis about the cause instead.',
          },
          {
            id: 'd',
            text: 'Reject it, because .get() is bad practice.',
            rationale:
              '.get() is fine when a missing key is a legitimate case. The problem is not the method; it is applying it before knowing whether the missing key is expected or a bug.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/06/quiz-2"
        prompt={
          <>
            You are forty minutes and six patches into a debugging thread. The
            latest suggestion is one you have already tried. What is the most
            effective next move?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Tell the model it already suggested that and ask for something different.',
            rationale:
              'It may comply, but the thread is now full of failed approaches that bias every subsequent answer. You are fighting the context.',
          },
          {
            id: 'b',
            text: 'Revert the patches, write a short summary of the repro and what has been ruled out, and start a fresh thread asking for a hypothesis.',
            correct: true,
            rationale:
              'Right. Clean code, clean context, and a request for a claim you can check rather than a patch you have to review.',
          },
          {
            id: 'c',
            text: 'Keep going; the fix is probably close.',
            rationale:
              'Six patches in with repetition starting is the textbook signal that it is not close. Sunk cost is doing the thinking here.',
          },
          {
            id: 'd',
            text: 'Switch to a different assistant and paste the whole thread.',
            rationale:
              'Pasting the whole thread carries the rot with it. A different model with the same polluted context tends to converge on the same failed approaches.',
          },
        ]}
      />

      <h2>Recap</h2>
      <ul>
        <li>Full traceback, actual code, minimal repro, expected behavior. Evidence, not story.</li>
        <li>Ask for a testable hypothesis before any fix. Run the check. Then fix the confirmed cause.</li>
        <li>A fix that makes the error stop is not the same as a fix that makes the program correct. Catch-and-continue, symptom guards, and edited tests are the usual impostors.</li>
        <li>When it loops: revert, summarize, fresh thread, hypothesis.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: giving an assistant the right context for a whole codebase.
      </p>
    </LessonShell>
  );
}
