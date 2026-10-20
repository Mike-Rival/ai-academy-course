import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Writing a Task the Model Cannot Misread — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '02-writing-the-task');
  return (
    <LessonShell
      lessonId="ai-coding/02-writing-the-task"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Writing a Task the Model Cannot Misread"
      estMinutes={15}
      nav={nav}
    >
      <p>
        A vague task has many plausible interpretations. The model will pick
        one, write confident code for it, and you will discover the mismatch
        later, usually after you have accepted the diff. Most of what people
        call &ldquo;the model got it wrong&rdquo; is the model correctly
        implementing a task that was never pinned down.
      </p>
      <p>
        This lesson is not about prompt tricks. It is the same discipline a good
        ticket or a good function docstring already requires, applied with more
        rigor because the reader cannot ask you a clarifying question in the
        hallway.
      </p>

      <h2>The six parts of a task that cannot be misread</h2>
      <ol>
        <li>
          <strong>Inputs.</strong> Types, shapes, and the ugly cases: empty,
          null, negative, huge, unicode, already-processed.
        </li>
        <li>
          <strong>Outputs.</strong> Exact type and format. &ldquo;Return the
          user&rdquo; is ambiguous. &ldquo;Return a dict with keys id and
          email, or None if not found&rdquo; is not.
        </li>
        <li>
          <strong>Constraints.</strong> Performance, allowed libraries, Python
          version, must-not-mutate-input, must-not-call-the-network.
        </li>
        <li>
          <strong>Examples.</strong> Two or three concrete input → output pairs,
          including at least one edge case. Examples resolve ambiguity that
          prose cannot.
        </li>
        <li>
          <strong>Done-criteria.</strong> How you will know it worked. Ideally:
          these tests pass. If you can state the done-criteria as assertions,
          you have written the tests.
        </li>
        <li>
          <strong>Non-goals.</strong> What not to touch. &ldquo;Do not change
          the function signature.&rdquo; &ldquo;Do not add a dependency.&rdquo;
          &ldquo;Do not refactor the caller.&rdquo; Models expand scope by
          default; non-goals are how you stop them.
        </li>
      </ol>

      <h2>The same function, two specs</h2>
      <p>Here is a task as people usually write it:</p>
      <pre><code>{`Write a function that normalizes usernames.`}</code></pre>
      <p>
        Reasonable interpretations include: lowercase only; lowercase and trim;
        strip all whitespace; replace spaces with underscores; reject invalid
        names by raising; reject them by returning None; reject them by
        returning an empty string; enforce a length limit, or not. Eight
        readings, one of which matches what you meant. The model will choose
        confidently.
      </p>
      <p>Here is the same task written so it cannot be misread:</p>
      <pre><code>{`Write normalize_username(raw) in Python.

Input: raw is a str or None.
Output: a str, or None when the input is unusable.

Rules, applied in this order:
1. If raw is None, return None (do not raise).
2. Strip leading and trailing whitespace, then lowercase.
3. If the result is empty, return None.
4. If the result contains any space character, return None.
5. Truncate the result to at most 20 characters.

Examples:
  "  Alice "        -> "alice"
  "a b"             -> None
  "   "             -> None
  "A" * 21          -> "a" * 20

Constraints: standard library only. Do not change the function name.
Non-goals: do not validate against a list of reserved names;
           do not handle unicode normalization.
Done when: all of the examples above hold as assertions.`}</code></pre>
      <p>
        Notice the second version is longer, but every line removes an
        interpretation. The order of rules matters (truncate after lowercasing,
        not before) and the spec says so. The examples double as tests. The
        non-goals stop the model from helpfully adding a reserved-name check
        you did not ask for and will now have to review.
      </p>

      <h2>The spec is the test</h2>
      <p>
        If the done-criteria are concrete enough, they <em>are</em> the
        tests. That is the goal. A task whose done-criteria you cannot write as
        assertions is a task you are not ready to hand off, to a model or to a
        colleague. The exercise below makes this literal: the checks are the
        spec above, line by line.
      </p>

      <CodeExercise
        exerciseId="ai-coding/02/normalize-username"
        prompt={
          <>
            Implement <code>normalize_username(raw)</code> to the spec above.
            Every check below corresponds to one rule or example in the spec.
            If a check fails, the spec tells you exactly which rule you missed.
          </>
        }
        starterCode={`def normalize_username(raw):
    pass  # replace

print(normalize_username("  Alice "))
print(normalize_username("a b"))
`}
        tests={[
          { name: 'Rule 2: lowercases and trims ("  Alice " -> "alice")', code: 'assert normalize_username("  Alice ") == "alice"' },
          { name: 'Already-clean names pass through unchanged', code: 'assert normalize_username("bob") == "bob"' },
          { name: 'Rule 4: internal space -> None', code: 'assert normalize_username("a b") is None' },
          { name: 'Rule 3: whitespace-only -> None', code: 'assert normalize_username("   ") is None' },
          { name: 'Rule 3: empty string -> None', code: 'assert normalize_username("") is None' },
          { name: 'Rule 1: None input -> None, no exception', code: 'assert normalize_username(None) is None' },
          { name: 'Rule 5: truncates to 20 chars after trimming', code: 'assert normalize_username(" " + "x"*25 + " ") == "x"*20' },
          { name: 'Rule order: truncation happens after lowercasing', code: 'assert normalize_username("A"*21) == "a"*20' },
        ]}
        hint={
          <>
            Follow the rules in order. Handle <code>None</code> first, then
            <code>.strip().lower()</code>, then the two rejection checks, then
            slice to 20.
          </>
        }
        solution={`def normalize_username(raw):
    if raw is None:
        return None
    s = raw.strip().lower()
    if s == "":
        return None
    if " " in s:
        return None
    return s[:20]

print(normalize_username("  Alice "))
print(normalize_username("a b"))
`}
      />

      <h2>What a good spec is not</h2>
      <ul>
        <li>
          <strong>Not a role.</strong> &ldquo;You are a senior Python
          engineer&rdquo; does not add an input, an output, or a constraint.
        </li>
        <li>
          <strong>Not an essay.</strong> Three paragraphs about why the feature
          matters is context the model will mostly ignore. One sentence of
          purpose is enough; the rules carry the weight.
        </li>
        <li>
          <strong>Not a request for the model to decide.</strong> &ldquo;Handle
          edge cases appropriately&rdquo; hands the ambiguity straight back. If
          you do not know what should happen on empty input, decide, then
          write it down.
        </li>
      </ul>

      <h2>When you genuinely do not know yet</h2>
      <p>
        Sometimes you are exploring and cannot write done-criteria. That is
        fine, but name it. Ask for options, not an implementation: &ldquo;List
        three ways to structure this and the trade-offs; do not write code
        yet.&rdquo; Then pick, then specify, then implement. The failure is
        asking for an implementation while still exploring and accepting
        whatever comes back.
      </p>

      <MultipleChoice
        exerciseId="ai-coding/02/quiz-1"
        prompt={
          <>
            Which of these additions to a task description does the most to
            reduce the space of wrong implementations?
          </>
        }
        options={[
          {
            id: 'a',
            text: '"Make sure the code is clean, idiomatic, and well-documented."',
            rationale:
              'This describes style, which the model produces by default anyway. It removes no interpretation of what the code should do.',
          },
          {
            id: 'b',
            text: 'Three concrete input → output examples, one of them an edge case, stated as assertions.',
            correct: true,
            rationale:
              'Right. Examples resolve ambiguity prose cannot, and as assertions they are also the verification. This is the single highest-leverage line in most specs.',
          },
          {
            id: 'c',
            text: '"Think carefully and handle all edge cases."',
            rationale:
              'This hands the decision about which edge cases exist, and what to do with them, back to the model. It feels thorough and specifies nothing.',
          },
          {
            id: 'd',
            text: 'A paragraph explaining the business importance of the feature.',
            rationale:
              'Purpose helps a little with judgment calls, but one sentence does the job. A paragraph is mostly tokens the model will skim past.',
          },
        ]}
      />

      <h2>Recap</h2>
      <ul>
        <li>
          Inputs, outputs, constraints, examples, done-criteria, non-goals. Six
          parts; most vague tasks are missing four of them.
        </li>
        <li>
          Examples stated as assertions are both the clearest spec and the
          verification. Aim for that.
        </li>
        <li>
          Non-goals stop scope creep. Models add things; tell them what not to
          add.
        </li>
        <li>
          If you cannot write the done-criteria, ask for options, not code.
        </li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: the working loop — small units, read the diff, run, repeat.
      </p>
    </LessonShell>
  );
}
