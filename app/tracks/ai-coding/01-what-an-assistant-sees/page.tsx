import LessonShell from '@/components/LessonShell';
import { Categorize, MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'What a Coding Assistant Actually Sees — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('ai-coding', '01-what-an-assistant-sees');
  return (
    <LessonShell
      lessonId="ai-coding/01-what-an-assistant-sees"
      trackLabel="Coding with AI Assistants"
      trackHref="/tracks/ai-coding"
      title="What a Coding Assistant Actually Sees"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Most frustration with AI coding tools comes from a mismatch between what
        the developer assumes the tool knows and what it actually has in front
        of it. This lesson fixes the mental model. Everything later in the track
        builds on it.
      </p>
      <p>
        One rule covers it: <strong>the model sees exactly what is in its
        context window — what you typed, what the tool loaded, and what it has
        read or run so far in this session — and nothing else.</strong> It has
        no live model of your running system, your database, your deploy
        pipeline, or the file you have open in another tab unless something put
        that text in front of it.
      </p>

      <h2>Three kinds of tool, three different views</h2>
      <p>
        &ldquo;AI coding assistant&rdquo; covers tools with very different
        amounts of context. It helps to keep them apart.
      </p>

      <h3>1. Inline autocomplete</h3>
      <p>
        <strong>What it sees:</strong> the current file (or part of it), often a
        few recently opened files, and the cursor position. It predicts the next
        lines.
      </p>
      <p>
        <strong>What it does not see:</strong> your test suite, the function
        definition two directories over, your intent beyond the surrounding code.
      </p>
      <p>
        <strong>Typical failure:</strong> plausible-looking calls to functions
        that do not exist, or that exist with a different signature. It is
        pattern-completing from the local text, not looking anything up.
      </p>

      <h3>2. Chat</h3>
      <p>
        <strong>What it sees:</strong> the conversation so far plus whatever you
        paste or attach. Some chat tools let you attach files or a selection
        from the editor.
      </p>
      <p>
        <strong>What it does not see:</strong> anything you described but did
        not paste. &ldquo;The config loader&rdquo; is a phrase to the model, not
        a file, unless the file is in the context.
      </p>
      <p>
        <strong>Typical failure:</strong> confident answers about code it has
        never read, built from what code like that usually looks like.
      </p>

      <h3>3. Agentic tools</h3>
      <p>
        <strong>What it sees:</strong> whatever it chooses to read or run. An
        agent can list directories, open files, run tests, read the output, and
        feed all of that back into its own context. This is the big difference:
        it can go and look.
      </p>
      <p>
        <strong>What it does not see:</strong> anything it did not look at.
        Agents skim. They read the files they guess are relevant, and their
        guesses are good but not complete. They also cannot see what happened
        outside the session: the deploy that failed last night, the Slack thread
        where the requirement changed.
      </p>
      <p>
        <strong>Typical failure:</strong> acting on a partial read of the
        codebase, or declaring a job done because the one command it ran
        succeeded.
      </p>

      <h2>No model of your running system</h2>
      <p>
        A developer carries a rough simulation of the program in their head:
        what state the database is in, which service is slow, what the user
        will click. The model has no such simulation unless the text describing
        it is in context. When it writes code that &ldquo;handles&rdquo; a case,
        it is writing text shaped like handling that case. Whether the case
        actually arises, and whether the handling is right, is something only
        execution can tell you.
      </p>
      <p>
        This is why the model can write a database migration that looks fine
        and would lock your largest table for an hour. It does not know the
        table is large. Nothing told it.
      </p>

      <h2>Why &ldquo;it compiled&rdquo; is weak evidence</h2>
      <p>
        Modern models produce syntactically valid code most of the time. That is
        the easy part: syntax is the most regular pattern in the training data.
        So compiling, type-checking, and even running without an exception tell
        you only that the code is well-formed. They tell you almost nothing
        about whether it does what you asked.
      </p>
      <ul>
        <li>
          A function that returns the wrong number compiles.
        </li>
        <li>
          A loop that skips the last element compiles.
        </li>
        <li>
          A call to a library method that silently does something different
          from what its name suggests compiles.
        </li>
      </ul>
      <p>
        The Working with LLMs track made this point about prose: fluent output is
        the weakest evidence of correctness. Code has its own version.
        <strong> Clean, idiomatic, well-commented code is the weakest evidence
        that the code is right.</strong> The model was trained on a great deal
        of clean code, so it produces clean code regardless of whether the
        logic holds. Your evidence has to come from somewhere else: tests,
        execution on real inputs, and reading.
      </p>

      <h2>What this means in practice</h2>
      <ul>
        <li>
          <strong>If the model needs to know it, put it in front of the model.</strong>
          {' '}The file, the error, the schema, the constraint. Not a description
          of it.
        </li>
        <li>
          <strong>Treat every claim about your system as a guess.</strong>
          {' '}&ldquo;This function is only called from one place&rdquo; is
          something the model inferred from what it read. It may have read
          three of the seven call sites.
        </li>
        <li>
          <strong>Separate &ldquo;runs&rdquo; from &ldquo;correct.&rdquo;</strong>
          {' '}The first is cheap to check and the model will often check it for
          you. The second is your job, and the rest of this track is about how
          to do it efficiently.
        </li>
      </ul>

      <MultipleChoice
        exerciseId="ai-coding/01/quiz-1"
        prompt={
          <>
            You ask a chat assistant: &ldquo;Why does our checkout page sometimes
            double-charge customers?&rdquo; You have not pasted any code. The
            model replies with a confident, detailed explanation involving a
            race condition in the payment handler. What is the most accurate
            description of that reply?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'A diagnosis of your bug, since double-charging is a well-known class of problem.',
            rationale:
              'The model has not seen your code. It cannot diagnose a bug in code it has not read, however common the class of bug.',
          },
          {
            id: 'b',
            text: 'A plausible hypothesis about what double-charge bugs in general tend to look like, which may or may not apply to your code.',
            correct: true,
            rationale:
              'Right. With nothing in context but your question, the model is generating the most typical explanation for that symptom. That can be a useful starting hypothesis, but it is not evidence about your system.',
          },
          {
            id: 'c',
            text: 'Wrong, because the model should have asked for the code first.',
            rationale:
              'The reply may be wrong, but you cannot know that yet. And many tools will answer rather than ask. The point is to recognize the answer as a guess, not to expect the tool to refuse.',
          },
          {
            id: 'd',
            text: 'Reliable, as long as the explanation is internally consistent.',
            rationale:
              'Internal consistency is a property of the text, not of its relationship to your code. Fluent, consistent, and wrong is the normal failure mode.',
          },
        ]}
      />

      <Categorize
        exerciseId="ai-coding/01/categorize"
        prompt={
          <>
            An agentic assistant is working in your repository. It has read the
            files it decided were relevant and run the test suite once. For each
            fact below, decide whether the assistant <em>can</em> know it from
            what is in its context, or <em>cannot</em> know it unless someone
            tells it.
          </>
        }
        items={[
          { id: 'f1', text: 'The signature of a function in a file it opened.', bucket: 'can' },
          { id: 'f2', text: 'That the production database has 400 million rows in the table the migration touches.', bucket: 'cannot' },
          { id: 'f3', text: 'That the test suite passed on its last run.', bucket: 'can' },
          { id: 'f4', text: 'That a teammate changed the requirement in a chat message yesterday.', bucket: 'cannot' },
          { id: 'f5', text: 'The contents of the project instruction file it was given at the start of the session.', bucket: 'can' },
          { id: 'f6', text: 'That a third-party API started rate-limiting your staging environment this morning.', bucket: 'cannot' },
          { id: 'f7', text: 'Which of the seven call sites of a function it did not search for still exist.', bucket: 'cannot' },
          { id: 'f8', text: 'The exact error text from a command it just ran.', bucket: 'can' },
        ]}
        buckets={[
          {
            id: 'can',
            label: 'Can know',
            description: 'It is in the context: typed, loaded, read, or produced by a command this session.',
          },
          {
            id: 'cannot',
            label: 'Cannot know',
            description: 'Lives outside the session, or in files and systems it never looked at.',
          },
        ]}
      />

      <h2>Recap</h2>
      <ul>
        <li>
          The context window is the whole world. Autocomplete sees a file, chat
          sees the conversation, agents see what they chose to read and run.
        </li>
        <li>
          There is no model of your running system. Claims about it are
          inferences from text, and often from a partial read.
        </li>
        <li>
          Compiling and running clean are evidence of form, not correctness.
          Clean code is the weakest evidence that code is right.
        </li>
      </ul>

      <p className="text-sm text-slate-500 mt-8">
        Up next: writing a task so precisely that the spec is also the test.
      </p>
    </LessonShell>
  );
}
