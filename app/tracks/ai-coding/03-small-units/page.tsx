import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'The Loop: Ask, Read the Diff, Run, Repeat — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '03-small-units');
  return (
    <LessonShell
      lessonId="ai-coding/03-small-units"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="The Loop: Ask, Read the Diff, Run, Repeat"
      estMinutes={12}
      nav={nav}
    >
      <p>
        There is a working rhythm that experienced users of these tools
        converge on, whichever tool they use. It is not clever. It is small
        steps with a check after each one. This lesson lays it out and explains
        why each part is there, because every part is the kind of thing people
        skip when they are in a hurry.
      </p>

      <h2>The loop</h2>
      <ol>
        <li>
          <strong>Ask for one small, testable unit.</strong> A function. A
          single endpoint. One migration. Something whose diff fits on a screen
          and whose done-criteria you can state.
        </li>
        <li>
          <strong>Read the diff. Every line.</strong> Not the summary the tool
          prints. The actual changed lines, including the ones in files you did
          not expect it to touch.
        </li>
        <li>
          <strong>Run it.</strong> Tests, the script, the endpoint with a real
          request. Something that executes the code on inputs you chose.
        </li>
        <li>
          <strong>Checkpoint.</strong> If it is right, commit. If it is not,
          revert to the last checkpoint rather than patching a patch.
        </li>
        <li>
          <strong>Repeat</strong> with the next unit.
        </li>
      </ol>

      <h2>Why small units</h2>
      <p>
        Suppose the model gets a self-contained unit right nine times out of
        ten. One ask covering ten units is right about a third of the time
        (0.9<sup>10</sup> ≈ 0.35), and when it is wrong you have a large diff
        with an unknown number of problems in unknown places. Ten asks of one
        unit each produce the same expected number of errors, but each one is
        isolated: you know which step failed, the diff is small enough to read,
        and the fix does not disturb the nine good steps.
      </p>
      <p>
        The big ask feels faster because the prompt is shorter. The time goes
        into the review and the debugging afterwards, which is slower and less
        pleasant. The Working with LLMs track covers this compound-error math
        in its lesson on agents; here it is the practical reason to resist
        &ldquo;build the whole feature.&rdquo;
      </p>
      <p>
        A second reason: the model&rsquo;s accuracy on a unit depends on how
        much it has to hold in its head. A fifty-line function with a clear
        spec is near the sweet spot. A change touching eight files is where
        the partial-read failures from Lesson 1 show up.
      </p>

      <h2>Read every line you accept</h2>
      <p>
        This is the step people drop first, and it is the one that matters
        most. When you accept a diff you did not read, you have taken
        ownership of code with no evidence beyond &ldquo;it looked fine
        scrolling past.&rdquo; Three things to look for on every read:
      </p>
      <ul>
        <li>
          <strong>Changes you did not ask for.</strong> A renamed variable in
          another function. A &ldquo;cleanup&rdquo; of unrelated code. A new
          dependency. These are the non-goals from Lesson 2 leaking in, and
          they are where regressions hide because nobody is testing them.
        </li>
        <li>
          <strong>Deleted or weakened checks.</strong> A removed assertion, a
          broadened exception handler, a test case that quietly changed its
          expected value to match the new output.
        </li>
        <li>
          <strong>Anything you cannot explain.</strong> If a line is there and
          you do not know why, ask the model why, then decide. Do not accept it
          on faith. Confident, clean, unexplained code is the hallmark of the
          failure catalog in Lesson 5.
        </li>
      </ul>
      <p>
        A useful habit: narrate the diff to yourself as if explaining it in
        code review. If you cannot narrate a hunk, you have not read it.
      </p>

      <h2>Run it, on inputs you chose</h2>
      <p>
        The model will often run the tests itself and report success. That is
        useful, and it is not sufficient. The model ran the tests it knew
        about, on the inputs it or the suite already had. You want at least one
        execution on an input <em>you</em> picked, preferably an ugly one. If
        there is no test, run the function in a REPL with an empty list, a
        negative number, a string with a trailing newline. It takes a minute
        and it is where most &ldquo;it worked on my machine&rdquo; bugs are
        caught.
      </p>

      <h2>Checkpoint with git</h2>
      <p>
        Commit after each unit that passes. Small, frequent commits are not
        tidiness for its own sake; they are what makes &ldquo;revert and
        re-ask&rdquo; cheap. When a step goes wrong, the right move is usually
        <code>git checkout .</code> back to the last good state and a better
        prompt, not three rounds of &ldquo;no, fix that too.&rdquo; Each patch
        on a patch adds context the model has to carry, and the quality of
        later patches drops. A clean reset with a clearer spec usually
        produces a better result in fewer turns.
      </p>
      <p>
        If you are using an agentic tool, this matters more. Agents can make
        many edits before you look. A checkpoint before you let one run means
        the worst case is a <code>git reset</code>, not an archaeological dig
        through a dirty working tree.
      </p>

      <h2>A worked example of the rhythm</h2>
      <pre><code>{`# Unit 1
Ask:    "Add parse_duration(s) -> int seconds. Accepts '90s', '5m', '2h'.
         Raise ValueError on anything else. Examples: '90s'->90, '5m'->300,
         '2h'->7200, '5'->ValueError, '5 m'->ValueError."
Read:   one new function, one new test file. Nothing else touched. Good.
Run:    tests pass. Also try parse_duration('0s') in the REPL -> 0. Fine.
Commit: "Add parse_duration"

# Unit 2
Ask:    "Use parse_duration in load_config for the 'timeout' field.
         Do not change any other field. Do not change parse_duration."
Read:   load_config changed as expected... and a default elsewhere was
        changed from 30 to '30s'. Not asked for. Could be right, could break
        a caller.
Decide: revert, re-ask with "leave the existing default alone; I will
        handle defaults separately."`}</code></pre>
      <p>
        The second unit shows the loop paying off. The unrequested change
        was caught in a four-file diff. In a forty-file diff, it would have
        shipped.
      </p>

      <MultipleChoice
        exerciseId="ai-coding/03/quiz-1"
        prompt={
          <>
            You asked an assistant to add input validation to one function. The
            diff also reformats two unrelated files and renames a helper used
            elsewhere. The validation itself looks correct and the tests pass.
            What is the best next step?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Accept it. The tests pass and the extra changes are probably improvements.',
            rationale:
              'The tests cover the validation, not the rename. "Probably improvements" is exactly the untested surface where regressions live.',
          },
          {
            id: 'b',
            text: 'Revert, and re-ask with an explicit non-goal: change only this function, do not rename or reformat anything.',
            correct: true,
            rationale:
              'Right. The unit you asked for was small; the diff is not. A clean re-ask with a non-goal is cheaper and safer than untangling the extra changes by hand or trusting them.',
          },
          {
            id: 'c',
            text: 'Ask the model to explain why it made the extra changes, then accept if the explanation sounds reasonable.',
            rationale:
              'The explanation will sound reasonable. That is what models do. The question is not whether there is a rationale but whether you want to review and own those changes right now. Usually not.',
          },
          {
            id: 'd',
            text: 'Keep the diff but manually undo the rename, since the reformatting is harmless.',
            rationale:
              'Workable but slow and error-prone, and you still have to check the reformat did not change behavior. A revert and re-ask is usually faster.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/03/quiz-2"
        prompt={
          <>
            The assistant reports: &ldquo;Implemented the feature. All 42 tests
            pass.&rdquo; Which of the following is the weakest link in that
            evidence?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Whether the tests actually ran, since the model might be making the number up.',
            rationale:
              'Possible with some tools, and worth confirming once, but most agentic tools show the real command output. This is not usually the weak link.',
          },
          {
            id: 'b',
            text: 'Whether the 42 tests cover the new behavior at all.',
            correct: true,
            rationale:
              'Right. Pre-existing tests passing tells you the change did not break what was already tested. It says nothing about whether the new feature works unless tests for the new feature were added, and you read them.',
          },
          {
            id: 'c',
            text: 'Whether 42 is enough tests for a project of this size.',
            rationale:
              'Test count is not the issue. One test that exercises the new behavior on an ugly input is worth more than forty that do not touch it.',
          },
          {
            id: 'd',
            text: 'Whether the model used the right test framework.',
            rationale:
              'Framework choice is a style question. It does not bear on whether the evidence supports "the feature works."',
          },
        ]}
      />

      <Reflection
        exerciseId="ai-coding/03/reflection"
        prompt={
          <>
            Think of the last time you accepted AI-generated code that later
            turned out to be wrong. Which step of the loop was skipped: was the
            unit too big to read, did you skip reading, did you skip running on
            your own input, or was there no checkpoint to fall back to? What
            would the same task look like done in the loop?
          </>
        }
        modelAnswer={
          <>
            <p>
              The most common answer is &ldquo;I read the summary, not the
              diff.&rdquo; The second most common is that the ask was large
              enough that reading the whole diff felt impractical, so it did
              not happen. Both have the same fix: make the unit small enough
              that reading every line is a two-minute job, not a twenty-minute
              one you will skip.
            </p>
            <p>
              If your answer was &ldquo;I ran it and it worked, but on the
              model&rsquo;s inputs,&rdquo; the fix is one extra minute: pick an
              input the model did not, ideally an edge case from the spec, and
              run that.
            </p>
          </>
        }
      />

      <h2>Recap</h2>
      <ul>
        <li>Ask for one small unit. Read every line of the diff. Run it on an input you chose. Commit. Repeat.</li>
        <li>Big asks are not faster; they move the time into review and debugging where it is less visible.</li>
        <li>Unrequested changes are where regressions hide. Revert and re-ask with a non-goal.</li>
        <li>Checkpoints make &ldquo;revert and re-ask&rdquo; cheap, which is usually better than patching a patch.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: tests as the verification layer, and why the model never grades its own work.
      </p>
    </LessonShell>
  );
}
