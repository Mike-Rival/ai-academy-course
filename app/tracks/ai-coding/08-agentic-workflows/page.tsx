import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Agentic Workflows: Plan, Implement, Verify — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '08-agentic-workflows');
  return (
    <LessonShell
      lessonId="ai-coding/08-agentic-workflows"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Agentic Workflows: Plan, Implement, Verify"
      estMinutes={15}
      nav={nav}
    >
      <p>
        An agentic tool does not just propose code; it reads files, edits
        them, runs commands, reads the output, and keeps going until it
        decides it is done. That is a real step up in what you can delegate.
        It is also a step up in how much can go wrong before you look. This
        lesson is about using the extra capability without giving up the
        checks from Lessons 3 and 4.
      </p>

      <h2>What changes when the tool can act</h2>
      <ul>
        <li>
          <strong>It can verify itself, partly.</strong> An agent can run the
          tests and read the result. That closes the &ldquo;does it run&rdquo;
          loop without you. It does not close the &ldquo;is it right&rdquo;
          loop, for the reasons in Lesson 4: it ran the tests it knew about.
        </li>
        <li>
          <strong>It makes many decisions you do not see.</strong> Which files
          to read, which to skip, which approach to take, what to do when a
          command fails. Each one is a place a wrong turn can happen.
        </li>
        <li>
          <strong>The diff is bigger.</strong> Multi-file changes are the
          normal output. Reading every line, which Lesson 3 insisted on, takes
          longer and is skipped more.
        </li>
        <li>
          <strong>It costs more.</strong> Every file read and every command
          output goes through the model. A long agentic run can be tens of
          times the tokens of a chat exchange. Not a reason to avoid it; a
          reason to know when it is worth it.
        </li>
      </ul>

      <h2>The compound-error math, again</h2>
      <p>
        The{' '}
        <Link href="/tracks/llm-literacy/09-mitigations">
          mitigations lesson
        </Link>{' '}
        in the Working with LLMs track works through this for agents in
        general. The coding version: an agentic task is a chain of steps, and
        each step has some chance of a wrong turn. If each of twenty steps is
        right 97% of the time, the whole chain is right about 54% of the
        time. The failures are not random noise; they are usually one early
        wrong assumption (a misread file, a wrong guess about a convention)
        that every later step builds on faithfully.
      </p>
      <p>
        Two things follow. Shorter chains are much more reliable, which is
        the small-units argument from Lesson 3 restated. And the most valuable
        place for a human check is <em>early</em>, before the wrong
        assumption has twenty steps of work stacked on it.
      </p>

      <h2>Plan, implement, verify</h2>
      <p>
        The pattern that addresses both points is to split the run into three
        phases with a checkpoint between each.
      </p>

      <h3>1. Plan (read-only)</h3>
      <p>
        Ask the agent to investigate and produce a plan, with no edits. Which
        files it will change, what approach, what it is unsure about. Read the
        plan. This is the cheap, early check: a wrong assumption in the plan
        costs one paragraph to fix; the same assumption after implementation
        costs a revert.
      </p>
      <p>
        Specifically look for: files it intends to touch that you did not
        expect; conventions it has guessed wrong; scope it has added. Correct
        those in one message and ask for the revised plan if the changes were
        large.
      </p>

      <h3>2. Implement (from a clean checkpoint)</h3>
      <p>
        Commit or stash before you let it run, so the whole implementation is
        one revertible unit. Let it run the plan, including the tests. If the
        plan was good, this phase mostly works, and when it does not, the
        plan tells you where it went wrong.
      </p>

      <h3>3. Verify (you, not the agent)</h3>
      <p>
        Read the diff. Run the tests yourself, plus at least one check the
        agent did not do: an input you chose, a manual exercise of the
        feature, a look at the one file the plan said it would not touch.
        Then commit.
      </p>
      <p>
        The agent will report that it verified its work. Treat that as a
        report of what it ran, which is useful, not as a verdict. The verdict
        is yours.
      </p>

      <h2>Reviewing a multi-file diff</h2>
      <p>
        Reading every line still applies; the question is how to do it
        efficiently when the diff is large.
      </p>
      <ol>
        <li>
          <strong>List the files first.</strong> Before reading any content,
          look at which files changed. Anything unexpected gets read first and
          most carefully. Anything in a directory the plan did not mention is
          a flag.
        </li>
        <li>
          <strong>Read the tests before the code.</strong> They tell you what
          the agent thinks the behavior is. If a test is missing for something
          the spec required, you know before reading the implementation.
        </li>
        <li>
          <strong>Then read the implementation against the catalog</strong>{' '}
          from Lesson 5, one function at a time.
        </li>
        <li>
          <strong>Check for deletions.</strong> Removed tests, removed checks,
          removed error handling. Agents sometimes resolve a failing check by
          removing it. A diff view that shows only additions hides this.
        </li>
      </ol>
      <p>
        If the diff is too large to do this in the time you have, that is
        information: the task was too big for one run. Revert, split, and
        run the halves. The cost of two smaller runs is usually less than the
        cost of one unreviewed large one.
      </p>

      <h2>When to let an agent run, and when not to</h2>
      <p>
        Good fits: mechanical changes across many files (rename, migrate an
        API, add a parameter everywhere), well-specified features with
        existing tests, investigation and summarization of unfamiliar code,
        first drafts of tests for existing behavior.
      </p>
      <p>
        Poor fits: anything where the spec is still forming, changes to code
        with no tests and high stakes, anything touching secrets or
        production infrastructure, tasks where the verification would take
        longer than doing it by hand.
      </p>
      <p>
        The deciding question is the one from the Working with LLMs track:
        <strong> can you verify the output, and at what cost?</strong> If
        verification is cheap (tests exist, the change is mechanical), the
        agent is a large speedup. If verification is expensive or impossible,
        the agent has moved the work from writing to auditing, and auditing
        is slower.
      </p>

      <h2>On cost</h2>
      <p>
        Agentic runs consume tokens in proportion to how much they read and
        how many turns they take. A plan phase is cheap; implementation on a
        large codebase is not; a debugging loop that goes in circles is the
        most expensive thing you can do. The habits in this track reduce
        cost as a side effect: small units, a plan before implementation,
        fresh sessions, and resetting when stuck all shorten the chain.
      </p>

      <MultipleChoice
        exerciseId="ai-coding/08/quiz-1"
        prompt={
          <>
            An agent finishes a feature touching nine files and reports:
            &ldquo;Implemented and verified. All tests pass.&rdquo; What is
            the best first step in your review?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Read the agent’s summary of changes and spot-check two files.',
            rationale:
              'The summary is the agent describing its own work. Spot-checking two of nine files leaves seven unreviewed, and the problem file is usually the one you did not expect.',
          },
          {
            id: 'b',
            text: 'List the changed files, read any you did not expect first, then read the tests, then the implementation against the failure catalog.',
            correct: true,
            rationale:
              'Right. Unexpected files are the highest-signal place to start, tests tell you what the agent thinks the behavior is, and the catalog gives you a systematic read of the rest.',
          },
          {
            id: 'c',
            text: 'Ask the agent to review its own diff for bugs before you read it.',
            rationale:
              'Self-review by the same model with the same context has the same blind spots. It is not worthless as a first pass, but it does not replace your read and it should not come first.',
          },
          {
            id: 'd',
            text: 'Merge it, since the tests pass, and review later if something breaks.',
            rationale:
              '"All tests pass" means the pre-existing tests still pass and whatever new tests the agent wrote pass. Neither tells you the feature is right. Review before merge is the whole point.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai-coding/08/quiz-2"
        prompt={
          <>
            Which task is the best candidate to hand to an agent and let run
            with minimal supervision?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Rename a function used in 40 files and update every call site; the test suite is comprehensive.',
            correct: true,
            rationale:
              'Right. Mechanical, well-specified, and cheaply verified: the tests and a grep for the old name tell you whether it worked.',
          },
          {
            id: 'b',
            text: 'Design the data model for a new feature whose requirements are still being discussed.',
            rationale:
              'The spec is not fixed. The agent will fix it for you, confidently, and you will be reviewing a design you never agreed to. Ask for options instead.',
          },
          {
            id: 'c',
            text: 'Rotate the production API keys and update the deployment config.',
            rationale:
              'Secrets and production infrastructure. The downside of a wrong turn is severe and verification after the fact is not enough. Lesson 9.',
          },
          {
            id: 'd',
            text: 'Fix a flaky integration test in a module with no other tests.',
            rationale:
              'Low verifiability. There is no safety net to tell you whether the "fix" fixed the flake or just made the test pass. This needs a hypothesis-first debugging session, not an autonomous run.',
          },
        ]}
      />

      <Reflection
        exerciseId="ai-coding/08/reflection"
        prompt={
          <>
            Pick a task from your current backlog that you would consider
            handing to an agent. Write the plan phase prompt: what should it
            investigate, what should the plan include, and what must it not do
            before you have read the plan? Then name the one verification step
            you will do yourself after implementation that the agent cannot do
            for you.
          </>
        }
        modelAnswer={
          <>
            <p>
              A solid plan prompt names the goal in one sentence, points at
              the two or three files that matter, asks for the list of files
              the agent expects to change and why, asks it to flag anything it
              is unsure about, and says explicitly: no edits until I have read
              the plan.
            </p>
            <p>
              The verification step that is yours alone is usually one of:
              exercising the feature by hand on an input the tests do not
              cover; checking that a file the plan promised not to touch is
              unchanged; or reading the diff for deletions. The agent can run
              the suite. It cannot decide whether the suite was the right
              check.
            </p>
          </>
        }
      />

      <h2>Recap</h2>
      <ul>
        <li>Agents can act and partly self-verify. They cannot judge whether their verification was the right one.</li>
        <li>Long chains fail more. The cheapest check is early: read the plan before any edits.</li>
        <li>Plan (read-only) → implement (from a checkpoint) → verify (you). Commit between phases.</li>
        <li>Review multi-file diffs by listing files, reading unexpected ones first, tests before code, and watching for deletions.</li>
        <li>Hand off what is mechanical and cheaply verified. Keep what is still being designed, high-stakes, or untestable.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: secrets, hallucinated packages, prompt injection, and other ways generated code can hurt you.
      </p>
    </LessonShell>
  );
}
