import LessonShell from '@/components/LessonShell';
import { Categorize, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Context Engineering for a Codebase — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '07-context-for-repos');
  return (
    <LessonShell
      lessonId="ai-coding/07-context-for-repos"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="Context Engineering for a Codebase"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Lesson 1 established that the model sees only its context window.
        Lessons 2 through 6 were about what to put there for a single task.
        This lesson is about the standing context: the things that are true of
        your project on every task, and how to get them in front of the model
        without re-typing them or drowning the task in them.
      </p>

      <h2>Project instruction files</h2>
      <p>
        Most agentic tools, and many chat tools, read a file at the root of
        the repository at the start of every session. The name varies by tool
        (<code>CLAUDE.md</code>, <code>AGENTS.md</code>, a <code>.cursorrules</code>{' '}
        file, and so on); the idea is the same. It is a short document that
        tells the model how this project works. Think of it as the onboarding
        note you would give a competent contractor on day one.
      </p>
      <p>What belongs in it:</p>
      <ul>
        <li>
          <strong>How to build and test.</strong> The exact commands. If the
          model cannot run the tests, it cannot verify anything.
        </li>
        <li>
          <strong>Conventions that are not obvious from the code.</strong>{' '}
          &ldquo;We use pathlib, never os.path.&rdquo; &ldquo;All money is
          integer cents.&rdquo; &ldquo;Database access goes through the repo
          layer, never raw SQL in handlers.&rdquo;
        </li>
        <li>
          <strong>Layout.</strong> Where things live, in a few lines. Not a
          full tree; the model can list directories. The parts that are
          surprising.
        </li>
        <li>
          <strong>Standing non-goals.</strong> &ldquo;Do not add dependencies
          without asking.&rdquo; &ldquo;Do not modify migrations that have
          shipped.&rdquo; &ldquo;Never commit directly to main.&rdquo;
        </li>
        <li>
          <strong>Known traps.</strong> &ldquo;The tests need the
          TZ=UTC environment variable or three of them fail.&rdquo; Things
          that cost a human an hour the first time.
        </li>
      </ul>
      <p>What does not belong in it:</p>
      <ul>
        <li>
          <strong>Anything the code already says clearly.</strong> The model
          can read the code. Repeating it costs tokens on every task and goes
          stale.
        </li>
        <li>
          <strong>Task-specific detail.</strong> The current feature&rsquo;s
          spec belongs in the task prompt, not the standing file.
        </li>
        <li>
          <strong>Aspirations.</strong> &ldquo;Write clean, maintainable
          code&rdquo; is not an instruction; it is a mood. The model already
          produces clean-looking code. Specific, checkable rules only.
        </li>
        <li>
          <strong>Secrets.</strong> Never. Lesson 9.
        </li>
      </ul>
      <p>
        A good instruction file is short, often under a hundred lines. It
        grows one line at a time, each time the model gets something wrong
        that a sentence would have prevented. It shrinks when a convention
        becomes enforced by a linter instead.
      </p>

      <h2>Point at files; do not paste them</h2>
      <p>
        With an agentic tool, the model can open files itself. &ldquo;The
        validation logic is in <code>app/forms/validate.py</code>; follow the
        pattern there&rdquo; is better than pasting the file into the prompt.
        Three reasons:
      </p>
      <ul>
        <li>
          The model reads the <em>current</em> version, not the one you
          pasted ten minutes ago.
        </li>
        <li>
          It can follow references out of that file to things you did not
          think to include.
        </li>
        <li>
          Your prompt stays short, which keeps the task itself prominent.
        </li>
      </ul>
      <p>
        With a chat tool that cannot read files, you do have to paste. Paste
        the specific function, not the whole module, and say what file it
        came from so the model&rsquo;s answer uses the right path.
      </p>

      <h2>Why long sessions degrade</h2>
      <p>
        Every file the model reads, every command it runs, every failed
        attempt, stays in the context for the rest of the session. Two
        things follow.
      </p>
      <p>
        First, the window fills. Tools handle this by summarizing or dropping
        older content, and the summary loses detail: a constraint you stated
        an hour ago may be gone. Second, even before the window is full, the
        accumulated history biases what comes next. Three failed approaches
        to a problem are three strong hints to try something similar. The
        Working with LLMs track calls this conversation rot; in a coding
        session it shows up as the model &ldquo;forgetting&rdquo; a rule from
        the start of the session, or re-proposing a rejected design.
      </p>
      <p>
        Practical consequences:
      </p>
      <ul>
        <li>
          <strong>One task per session</strong> where you can. Finish the
          unit, commit, start fresh for the next one. The instruction file
          means a fresh session is not starting from zero.
        </li>
        <li>
          <strong>Put durable rules in the file, not the chat.</strong> A rule
          stated in the conversation can be summarized away. A rule in the
          instruction file is re-read every session.
        </li>
        <li>
          <strong>When the model starts violating a rule you stated earlier,
          that is the signal</strong> to either move the rule into the file or
          start a fresh session with a summary, not to restate it a fourth
          time.
        </li>
      </ul>

      <h2>A sample instruction file</h2>
      <pre><code>{`# Project notes for coding assistants

## Build and test
- Install: npm ci
- Tests:   npm test            (must pass before any commit)
- Lint:    npm run lint
- The test suite needs TZ=UTC; the npm script sets it.

## Layout
- src/api/      HTTP handlers. Thin: validate, call a service, return.
- src/services/ Business logic. All DB access goes through src/repo/.
- src/repo/     The only place SQL lives.
- migrations/   Append-only once merged. Never edit a shipped migration.

## Conventions
- Money is integer cents. Never float.
- Dates in the DB are UTC. Convert at the edge, in src/api/.
- Prefer small PRs. One behavior change per PR.

## Do not
- Add a dependency without asking first.
- Catch broad exceptions. Catch the specific error or let it propagate.
- Edit tests' expected values to make them pass. Ask instead.`}</code></pre>
      <p>
        Every line is specific and checkable. Nothing in it is a description
        of what the code does; that is what the code is for. Several lines
        encode a past mistake.
      </p>

      <Categorize
        exerciseId="ai-coding/07/categorize"
        prompt={
          <>
            For each piece of information, decide where it belongs: in the
            standing project instruction file, in the prompt for the specific
            task you are about to give, or nowhere (because the model can get
            it from the code, or should never see it).
          </>
        }
        items={[
          { id: 'i1', text: 'The command to run the test suite.', bucket: 'file' },
          { id: 'i2', text: 'The spec for the discount function you are adding today.', bucket: 'task' },
          { id: 'i3', text: '"All monetary values are integer cents, never floats."', bucket: 'file' },
          { id: 'i4', text: 'The full source of a 300-line module the model can open itself.', bucket: 'nowhere' },
          { id: 'i5', text: 'The staging database password, so the agent can run integration tests.', bucket: 'nowhere' },
          { id: 'i6', text: '"Do not add a dependency without asking first."', bucket: 'file' },
          { id: 'i7', text: '"Do not change the signature of parse_config in this change."', bucket: 'task' },
          { id: 'i8', text: '"Write clean, readable, maintainable code."', bucket: 'nowhere' },
          { id: 'i9', text: 'A list of every function in the project with a one-line description.', bucket: 'nowhere' },
          { id: 'i10', text: '"Tests fail unless TZ=UTC is set."', bucket: 'file' },
        ]}
        buckets={[
          { id: 'file', label: 'Project instruction file', description: 'True of every task. Short, specific, checkable.' },
          { id: 'task', label: 'This task’s prompt', description: 'Specific to the change you are making now.' },
          { id: 'nowhere', label: 'Nowhere', description: 'Derivable from the code, a vague aspiration, or something the model must never see.' },
        ]}
      />

      <Reflection
        exerciseId="ai-coding/07/reflection"
        prompt={
          <>
            Think of the project you work in most. Write the five lines of a
            project instruction file that would have prevented the last five
            mistakes an assistant (or a new teammate) made there. Specific and
            checkable; no &ldquo;write good code.&rdquo; Which of the five
            could be a linter rule instead?
          </>
        }
        modelAnswer={
          <>
            <p>
              Most people find that two or three of their five lines are
              conventions that live in someone&rsquo;s head and nowhere else:
              the unit money is stored in, which layer is allowed to touch the
              database, the environment variable the tests need. Those are the
              highest-value lines because the model cannot infer them from a
              partial read of the code, and a new human cannot either.
            </p>
            <p>
              The ones that could be linter rules (import restrictions, banned
              functions, formatting) are better as linter rules. A linter
              fails the build; an instruction file is advice the model can
              forget under a long session. Use the file for what tooling
              cannot enforce.
            </p>
          </>
        }
      />

      <h2>Recap</h2>
      <ul>
        <li>A project instruction file is standing context: build and test commands, non-obvious conventions, standing non-goals, known traps. Short and specific.</li>
        <li>Do not put in it what the code already says, what only this task needs, vague aspirations, or secrets.</li>
        <li>Point at files instead of pasting them when the tool can read. The model gets the current version and can follow references.</li>
        <li>Sessions degrade as context accumulates. One task per session; durable rules in the file, not the chat.</li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: agentic workflows — when to let an agent run, and how to check what it did.
      </p>
    </LessonShell>
  );
}
