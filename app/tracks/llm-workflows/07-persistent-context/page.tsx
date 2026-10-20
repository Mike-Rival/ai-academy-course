import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Custom Instructions, Projects, Memory, and Files — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-workflows', '07-persistent-context');
  return (
    <LessonShell
      lessonId="llm-workflows/07-persistent-context"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Custom Instructions, Projects, Memory, and Files"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Every lesson so far assumed a fresh conversation: you paste the
        template, the model sees only what you gave it. Most tools now offer
        ways to make context stick. Custom instructions apply to every chat.
        Projects or workspaces bundle a set of files and instructions. Memory
        features let the model carry facts about you across conversations.
        File uploads let it read your documents directly.
      </p>
      <p>
        These are useful, and they change the verification picture in a way
        that is easy to miss. Context you set once and stop seeing is
        context you stop checking.
      </p>

      <h2>What persistent context is good for</h2>
      <p>
        The honest list is short and the items on it are valuable:
      </p>
      <ul>
        <li><strong>Output preferences.</strong> &ldquo;Use plain language. No bullet lists unless I ask. Dates as YYYY-MM-DD.&rdquo; These are stable, cheap to state, and tedious to repeat. They belong in custom instructions.</li>
        <li><strong>Standing facts about your work.</strong> Your role, your team&rsquo;s product, the audience you usually write for. This saves you re-explaining and reduces generic output.</li>
        <li><strong>A project&rsquo;s reference material.</strong> The style guide, the glossary, the three source documents every question in this project draws on. Uploading them once beats pasting them every time, and it keeps the model&rsquo;s answers anchored to your material rather than its general training.</li>
        <li><strong>Your template library.</strong> The templates from Lesson 2 can live inside a project, so &ldquo;run the decision-extraction template on this transcript&rdquo; becomes the whole prompt.</li>
      </ul>
      <p>
        What persistent context is not good for: anything that changes.
        Project status, who is on the team this quarter, the current price
        list, the deadline. Put a moving fact into standing context and you
        have created a fact that will be wrong soon and will keep being
        asserted confidently after it is.
      </p>

      <h2>How it drifts and goes stale</h2>

      <h3>Stale facts</h3>
      <p>
        You told the model in March that the launch is in June. In August,
        every draft still mentions the June launch, and because the model
        states it as given context rather than as a guess, it reads as
        authoritative. You stop noticing because you set it months ago.
        This is the{' '}
        <Link href="/tracks/llm-literacy/04-conversation-rot">conversation rot</Link>{' '}
        mechanism stretched across months instead of across one long chat.
      </p>

      <h3>Accumulated memory you did not write</h3>
      <p>
        Memory features that learn from your conversations save things you
        said in passing. &ldquo;I prefer short emails&rdquo; was true for
        that one email. A half-remembered aside becomes a standing
        instruction. Worse, the model may infer a fact from something you
        pasted, such as a colleague&rsquo;s opinion in a thread, and store
        it as yours. You cannot verify what you do not know is there.
      </p>

      <h3>Instruction conflicts</h3>
      <p>
        Custom instructions say &ldquo;always be concise.&rdquo; Today&rsquo;s
        template says &ldquo;quote every passage verbatim.&rdquo; The model
        resolves the conflict somehow, often by trimming the quotes, and the
        verification hook you built into the template quietly stops working.
        Standing instructions can override the prompt you are looking at,
        and the override is invisible.
      </p>

      <h3>Outdated files</h3>
      <p>
        The project has version 3 of the pricing sheet. You are on version
        5. The model answers every pricing question from version 3 with full
        confidence, because from its point of view that is the source of
        truth you gave it.
      </p>

      <h3>Privacy drift</h3>
      <p>
        The{' '}
        <Link href="/tracks/llm-literacy/12-privacy">privacy lesson</Link>{' '}
        asked what you should not paste into a chatbot. Persistent features
        raise the stakes: what you upload to a project or let the model
        remember stays there, is visible to every future conversation, and
        may be visible to colleagues if the project is shared. The question
        shifts from &ldquo;should I paste this once&rdquo; to &ldquo;should
        this be standing context for an indefinite period.&rdquo;
      </p>

      <h2>Hygiene: review and prune</h2>
      <p>
        The fix is a habit, not a feature. Treat standing context like a
        shared drive: it needs an owner and a cleanup schedule.
      </p>
      <ol>
        <li><strong>Read your own instructions once a month.</strong> Open the custom-instructions box and the memory list. Delete anything that is no longer true, anything you do not remember adding, and anything that describes a moving fact.</li>
        <li><strong>Date your project files.</strong> Put the version or date in the filename. When you upload a new version, delete the old one rather than adding alongside it. Two versions of the same sheet in a project is a guaranteed source of confident wrong answers.</li>
        <li><strong>Keep standing instructions to preferences, not facts.</strong> If a line in your custom instructions could become false, it should be in the prompt for the task that needs it instead, where you will see it every time.</li>
        <li><strong>Test for conflicts.</strong> When a template stops producing the output format it used to, suspect the standing instructions first. Run the template in a fresh, project-free chat and compare.</li>
        <li><strong>Ask the model what it thinks it knows.</strong> &ldquo;List every fact you have stored about me or this project&rdquo; is one of the few cases where asking the model about itself is useful, because it can read its own context even though it cannot judge its own output. Check the list against reality. Delete what is wrong.</li>
      </ol>

      <blockquote>
        <strong>Persistent context is a convenience that becomes a liability
        the moment you stop reading it. Keep it to preferences and reference
        material, date everything, and prune on a schedule.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-workflows/07/quiz-1"
        prompt={
          <>
            Which of these belongs in standing custom instructions rather
            than in the prompt for a specific task?
          </>
        }
        options={[
          {
            id: 'a',
            text: '"Our Q4 deadline is November 14."',
            rationale:
              'A moving fact. It will be wrong after November 14 and still asserted in every draft. Facts with expiry dates belong in the task prompt, where you see them.',
          },
          {
            id: 'b',
            text: '"Write dates as YYYY-MM-DD and avoid bullet lists unless asked."',
            correct: true,
            rationale:
              'Right. A stable output preference that applies to every task and would be tedious to repeat. This is what standing instructions are for.',
          },
          {
            id: 'c',
            text: '"The current vendor shortlist is A, B, and C."',
            rationale:
              'Will change the moment one vendor drops out. If it lives in standing context, the model will keep recommending a vendor you eliminated weeks ago.',
          },
          {
            id: 'd',
            text: '"Quote every supporting passage verbatim."',
            rationale:
              'Good instruction, wrong place. It conflicts with tasks where you want prose, and the conflict resolution is invisible. Keep it in the templates that need it.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/07/quiz-2"
        prompt={
          <>
            Your decision-extraction template used to return verbatim quotes.
            This week it returns short paraphrases instead. You have not
            changed the template. What is the first thing to check?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Whether the model has been updated.',
            rationale:
              'Possible, and worth knowing, but you cannot control it and it is not the most likely cause. Rule out the thing you can inspect first.',
          },
          {
            id: 'b',
            text: 'Whether a standing instruction (custom instructions, project instructions, or a stored memory) is overriding the template. Run it in a fresh chat with no project and compare.',
            correct: true,
            rationale:
              'Right. Standing context can silently override the prompt in front of you. The fresh-chat comparison isolates the cause in one step and tells you where to look.',
          },
          {
            id: 'c',
            text: 'Add "I really mean verbatim" to the template.',
            rationale:
              'Emphasis is not a fix for a conflict you have not found. If a standing instruction says "be concise," you are now asking the model to pick between two instructions it cannot both follow.',
          },
          {
            id: 'd',
            text: 'Accept paraphrases; they are close enough.',
            rationale:
              'The verbatim quote was the verification hook. A paraphrase cannot be searched for in the source, so your spot-check no longer works. The template’s value just dropped and you would be accepting that silently.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-workflows/07/reflection"
        prompt={
          <>
            Open the custom instructions, memory list, or project files in a
            tool you actually use (or recall them as best you can). Which
            items are preferences, which are facts, and which facts have
            quietly become false? What would you delete today?
          </>
        }
        modelAnswer={
          <>
            <p>
              The typical finding is two or three facts that were true when
              written and are not now: a project that shipped, a role that
              changed, a tool the team stopped using. Each one has been
              shaping output for weeks without anyone noticing, because
              nobody re-reads context they set in the past.
            </p>
            <p>
              The second typical finding is a memory you did not consciously
              add, inferred from something you pasted. That one is worth
              treating seriously, since it is evidence the tool stores more
              than you intend, and it argues for a shorter cleanup interval
              than &ldquo;monthly&rdquo; if you use memory features heavily.
            </p>
            <p>
              The deletion rule: if you cannot say why a line is there and
              that it is still true, remove it. The cost of removing a useful
              preference is retyping it once. The cost of keeping a stale
              fact is every output until you notice.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: agents and automations. What to let run on its own, and how
        to find out when it goes wrong.
      </p>
    </LessonShell>
  );
}
