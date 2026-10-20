import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Tests Are the Verification Layer — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '04-tests-are-the-check');
  return (
    <LessonShell
      lessonId="ai-coding/04-tests-are-the-check"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Tests Are the Verification Layer"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Lesson 1 said the model&rsquo;s clean output is weak evidence. Lesson 3
        said to run the code on inputs you chose. This lesson makes that
        systematic: tests are the layer that turns &ldquo;looks right&rdquo;
        into &ldquo;demonstrated right on these cases,&rdquo; and they are the
        one artifact the model cannot talk its way past.
      </p>

      <h2>Tests first, or at least tests separately</h2>
      <p>
        The strongest order is: write the tests (or have the model draft them
        from your spec), read them, <em>then</em> ask for the implementation.
        Two things happen when you do this.
      </p>
      <ul>
        <li>
          You find out whether your spec was actually precise. If you cannot
          write the assertion, the spec was vague, and you found out before any
          implementation existed.
        </li>
        <li>
          The implementation has a fixed target. When the model writes tests
          and code in the same breath, it tends to write tests that pass
          <em> its</em> code, which is not the same as tests that check
          <em> your</em> spec.
        </li>
      </ul>
      <p>
        If you ask the model for tests, read them with the same care as the
        code. Watch for tests that only exercise the happy path, tests whose
        expected value was copied from running the implementation, and tests
        that assert the code does not crash rather than that it returns the
        right answer.
      </p>

      <h2>Adversarial cases</h2>
      <p>
        Happy-path tests confirm the common case. Bugs live at the edges. For
        any function, try to write at least one test from each of these
        families before you accept the implementation:
      </p>
      <ul>
        <li><strong>Empty:</strong> empty list, empty string, zero, None.</li>
        <li><strong>One:</strong> a single element, a single character.</li>
        <li><strong>Boundary:</strong> exactly at the limit, one past it, one short of it.</li>
        <li><strong>Remainder:</strong> sizes that do not divide evenly.</li>
        <li><strong>Order:</strong> unsorted input, duplicates, reversed.</li>
        <li><strong>Type edges:</strong> int where float expected, bytes vs str, naive vs aware datetime.</li>
        <li><strong>Mutation:</strong> does the function change its input? Should it?</li>
      </ul>
      <p>
        The model is good at generating candidates for this list if you ask
        for them explicitly: &ldquo;List eight edge cases for this function;
        do not write code.&rdquo; Then you pick the ones that matter. That is
        the brainstorm-then-filter pattern from the Working with LLMs track,
        and it is one of the places these tools reliably help.
      </p>

      <h2>Never let the model grade its own output</h2>
      <p>
        It is tempting to ask &ldquo;is this correct?&rdquo; or &ldquo;are
        you sure?&rdquo; after the model writes something. The answer will be
        fluent and will usually be yes. It carries almost no information. The{' '}
        <Link href="/tracks/llm-literacy/07-self-judgment">
          self-judgment lesson
        </Link>{' '}
        in the Working with LLMs track covers why in detail; the short version
        is that the same process that produced the code produces the
        assessment of the code, with the same blind spots.
      </p>
      <p>
        What works instead is an external check the model cannot influence: a
        test with an expected value <em>you</em> fixed, run by the test
        runner, with the result read off the output. The model can run that
        check for you. It cannot pass it by being confident.
      </p>
      <p>
        One subtle version of self-grading to watch for: the model writes a
        failing test, then &ldquo;fixes&rdquo; it by changing the expected
        value to whatever the code returns. The test now passes. It has also
        stopped testing anything. Any diff that edits an expected value in an
        existing test deserves a hard look.
      </p>

      <h2>Exercise: a weak test let a bug through</h2>
      <p>
        Below is a function an assistant wrote, with the test it wrote
        alongside. The test passes. The function has a bug. Your job is to
        notice that the test is too weak, work out what case it misses, and
        fix the function so the hidden checks (which cover the adversarial
        families above) pass. Try adding your own assertion for the case you
        suspect before you look at the checks.
      </p>

      <CodeExercise
        exerciseId="ai-coding/04/chunk"
        prompt={
          <>
            <code>chunk(items, size)</code> should split a list into
            consecutive lists of length <code>size</code>, with the last chunk
            allowed to be shorter. The provided test passes. Find the case it
            does not cover, then fix the function.
          </>
        }
        starterCode={`def chunk(items, size):
    """Split items into consecutive lists of length \`size\`. The last chunk may be shorter."""
    result = []
    for i in range(0, len(items) - size, size):
        result.append(items[i:i + size])
    result.append(items[-size:])
    return result

# The test the assistant wrote. It passes.
assert chunk([1, 2, 3, 4], 2) == [[1, 2], [3, 4]]
print("test passed")
`}
        tests={[
          { name: 'Even split: chunk([1,2,3,4], 2) == [[1,2],[3,4]]', code: 'assert chunk([1,2,3,4], 2) == [[1,2],[3,4]]' },
          { name: 'Remainder: chunk([1,2,3,4,5], 2) ends with [5]', code: 'assert chunk([1,2,3,4,5], 2) == [[1,2],[3,4],[5]]' },
          { name: 'Remainder: chunk of 7 by 3 ends with [7]', code: 'assert chunk([1,2,3,4,5,6,7], 3) == [[1,2,3],[4,5,6],[7]]' },
          { name: 'Fewer items than size: one short chunk', code: 'assert chunk([1,2], 5) == [[1,2]]' },
          { name: 'Empty input -> []', code: 'assert chunk([], 3) == []' },
          { name: 'Exactly one full chunk', code: 'assert chunk([1,2,3], 3) == [[1,2,3]]' },
        ]}
        hint={
          <>
            The original test only uses a list whose length divides evenly.
            Try <code>chunk([1,2,3,4,5], 2)</code> and <code>chunk([], 3)</code>.
            The loop bound and the final <code>items[-size:]</code> are both
            wrong; a single <code>range(0, len(items), size)</code> loop does
            the whole job.
          </>
        }
        solution={`def chunk(items, size):
    """Split items into consecutive lists of length \`size\`. The last chunk may be shorter."""
    result = []
    for i in range(0, len(items), size):
        result.append(items[i:i + size])
    return result

assert chunk([1, 2, 3, 4], 2) == [[1, 2], [3, 4]]
assert chunk([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
assert chunk([], 3) == []
print("tests passed")
`}
      />

      <p>
        The original function was written to pass the one test, and it did.
        With a remainder it duplicates elements; with an empty list it returns
        a chunk containing nothing. The test that would have caught both is
        one line long. That is the usual ratio: the adversarial case is cheap
        to write and expensive to skip.
      </p>

      <MultipleChoice
        exerciseId="ai-coding/04/quiz-1"
        prompt={
          <>
            An assistant implements a feature and adds tests. One of the new
            tests fails. The assistant then edits the test&rsquo;s expected
            value and reports that all tests pass. What happened?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The test had a typo in the expected value and the assistant corrected it.',
            rationale:
              'Possible, but you cannot know that without checking the expected value against the spec yourself. Treating this as the default explanation is how broken behavior gets locked in by a passing test.',
          },
          {
            id: 'b',
            text: 'The test was adjusted to match the implementation, so it no longer checks the spec. Verify the expected value against the spec before accepting.',
            correct: true,
            rationale:
              'Right. A test whose expected value tracks the code is grading the code with the code. The expected value must come from the spec, which means from you.',
          },
          {
            id: 'c',
            text: 'Nothing wrong; passing tests are the goal.',
            rationale:
              'Passing tests are the goal only when the tests encode the spec. A test can be made to pass by weakening it, and that is what happened here until proven otherwise.',
          },
          {
            id: 'd',
            text: 'The assistant should be asked whether the change was correct.',
            rationale:
              'That is self-grading. The answer will be yes. The check has to come from outside the model: you, and the spec.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/04/quiz-2"
        prompt={
          <>
            Which ordering gives the implementation the most honest target?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Ask for implementation and tests in one request, then review both.',
            rationale:
              'Workable, but tests written alongside the code tend to be written to pass that code. You have to read them more suspiciously.',
          },
          {
            id: 'b',
            text: 'Write or review the tests from the spec first, then ask for an implementation that passes them.',
            correct: true,
            rationale:
              'Right. The tests then encode the spec rather than the implementation, and a vague spec shows up as an unwritable assertion before any code exists.',
          },
          {
            id: 'c',
            text: 'Ask for the implementation, run it on a few inputs by hand, then ask the model to write tests that match the observed behavior.',
            rationale:
              'This produces tests that lock in whatever the code currently does, bugs included. Observed behavior is not the spec.',
          },
          {
            id: 'd',
            text: 'Skip tests for small functions; read the code instead.',
            rationale:
              'Reading is necessary and not sufficient. Small functions are exactly where a one-line boundary test is cheapest to write and most likely to catch something.',
          },
        ]}
      />

      <h2>Recap</h2>
      <ul>
        <li>Tests are the external check the model cannot pass by sounding confident.</li>
        <li>Tests first, or at least tests you have read, before the implementation. Expected values come from the spec, never from running the code.</li>
        <li>Add adversarial cases: empty, one, boundary, remainder, order, type edges, mutation.</li>
        <li>Never ask the model whether its code is correct. Ask the test runner.</li>
        <li>A diff that changes an existing expected value is a red flag until you have checked it against the spec.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: the failure catalog — what wrong generated code looks like when it looks fine.
      </p>
    </LessonShell>
  );
}
