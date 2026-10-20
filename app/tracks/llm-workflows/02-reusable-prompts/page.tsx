import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Reusable Prompts and Checklists — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-workflows', '02-reusable-prompts');
  return (
    <LessonShell
      lessonId="llm-workflows/02-reusable-prompts"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Reusable Prompts and Checklists"
      estMinutes={14}
      nav={nav}
    >
      <p>
        If you do a task more than twice, you are already using a template.
        It just lives in your head, drifts every time you retype it, and
        cannot be improved because you never wrote the last version down.
        This lesson is about making that template explicit, so the workflow
        from Lesson 1 produces the same quality on a Friday afternoon as it
        did the morning you designed it.
      </p>
      <p>
        Nothing here is a magic phrase. The{' '}
        <Link href="/tracks/llm-literacy/13-prompting-hygiene">prompting hygiene</Link>{' '}
        lesson covered what actually moves output quality: specificity,
        context, examples, format, length. A template is simply those five
        things written down once and reused.
      </p>

      <h2>Anatomy of a reusable prompt</h2>
      <p>
        A good template has four parts. Here is one for the meeting-notes
        workflow from Lesson 1, step 1:
      </p>
      <pre><code>{`TASK
List every decision stated in the transcript below. A decision is
something the group agreed to do or not do, not a suggestion that
was raised and dropped.

OUTPUT FORMAT
A numbered list. Each item: one sentence stating the decision,
then the exact quote from the transcript where it was made,
in quotation marks. If no decisions were made, say so. Do not
include action items; those come in a separate step.

CONSTRAINTS
- Quote verbatim. Do not paraphrase inside the quotation marks.
- If a decision is implied but never stated, list it under a
  separate heading "Possibly implied" so I can check.

TRANSCRIPT
{{transcript}}`}</code></pre>
      <p>
        Notice what each part does:
      </p>
      <ul>
        <li><strong>Task</strong> defines the job and the one term (&ldquo;decision&rdquo;) that would otherwise be interpreted loosely.</li>
        <li><strong>Output format</strong> makes the result checkable. The verbatim quote is the verification hook: it lets you confirm each item in seconds without re-reading the source.</li>
        <li><strong>Constraints</strong> name the failure modes you have actually seen. The &ldquo;possibly implied&rdquo; bucket exists because models otherwise either invent decisions or silently drop them.</li>
        <li><strong>Slots</strong> like <code>{'{{transcript}}'}</code> mark what changes each time. Everything outside the slots stays fixed.</li>
      </ul>

      <h2>Explicit output formats</h2>
      <p>
        The single most useful habit is specifying the format precisely
        enough that a wrong output is visibly wrong. &ldquo;Summarize
        this&rdquo; can produce anything. &ldquo;Produce a table with columns
        Claim, Source page, Confidence (quoted / inferred / absent)&rdquo;
        produces something you can scan, and the third column forces the
        model to separate what the document says from what it guessed.
      </p>
      <p>
        Formats that make verification cheap:
      </p>
      <ul>
        <li>Numbered lists where each item carries a verbatim quote or a page reference.</li>
        <li>Tables with a column that records <em>where</em> each value came from.</li>
        <li>An explicit &ldquo;not found&rdquo; or &ldquo;unclear&rdquo; value, so absence is reported instead of filled in.</li>
        <li>A fixed length. &ldquo;Three sentences&rdquo; is easier to read in full than &ldquo;a brief summary.&rdquo;</li>
      </ul>

      <h2>Checklists are prompts for you</h2>
      <p>
        A template controls what the model does. A checklist controls what
        you do afterwards. They belong together, because the template only
        works if the verify step happens. For the decision-extraction
        template above, the checklist is short:
      </p>
      <ol>
        <li>Read every quote. Does it actually state a decision?</li>
        <li>Skim the &ldquo;possibly implied&rdquo; section. Promote or delete each item.</li>
        <li>Spot-check: pick one section of the transcript at random and confirm nothing in it was missed.</li>
      </ol>
      <p>
        Store the checklist directly under the template. The capstone of the
        literacy track called this a forcing function. The cheapest forcing
        function is a checklist you see every time you open the prompt.
      </p>

      <h2>A personal prompt library</h2>
      <p>
        Keep your templates somewhere you can find them: a notes app, a text
        file, a shared document if a team uses them. Each entry needs the
        template, its checklist, and two more things people skip:
      </p>
      <ul>
        <li><strong>A version or date.</strong> You will change the template. Knowing which version produced which results is how you tell whether a change helped.</li>
        <li><strong>A note on known failures.</strong> &ldquo;Tends to merge two decisions into one when they were made in the same sentence.&rdquo; This is the most valuable line in the library, and it only exists if you write it down when you see it.</li>
      </ul>

      <h2>Test every change on five real cases</h2>
      <p>
        Here is the discipline that separates a prompt library from a
        folder of superstitions. When you change a template, run the old
        version and the new version on five real inputs from your actual
        work, and compare the outputs side by side. Not one input. Not a toy
        example. Five real ones, including at least one that was awkward
        last time.
      </p>
      <p>
        Why five, and why real: LLM output varies from run to run, and a
        change that looks like an improvement on one example is often noise.
        Five is not a rigorous sample either, but it is enough to catch a
        change that makes things worse on the inputs you actually see, which
        is the common case. The literacy track&rsquo;s lesson on reading
        claims applies to your own claims too: &ldquo;the new prompt is
        better&rdquo; needs evidence, and one impressive output is not it.
      </p>
      <p>
        If the new version is better on four of five and worse on one, look
        hard at the one. It usually reveals a constraint you had not written
        down.
      </p>

      <blockquote>
        <strong>A template is a hypothesis about what produces good output.
        Version it, test it on real cases, and keep the notes on when it
        fails.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-workflows/02/quiz-1"
        prompt={
          <>
            A colleague shares a prompt template that opens with: &ldquo;You
            are a world-class executive assistant with 20 years of experience.
            Summarize the attached email thread.&rdquo; Based on this lesson
            and the prompting hygiene lesson, what is the most useful
            improvement?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Make the persona more impressive: "world-class" is not strong enough.',
            rationale:
              'Role-play preambles have weak and inconsistent evidence behind them. Escalating the adjectives does not add information the model can use.',
          },
          {
            id: 'b',
            text: 'Replace the persona with a precise output format: what the summary must contain, how long it is, and a quoted source line for each claim.',
            correct: true,
            rationale:
              'Right. The persona tells the model nothing about what a good summary looks like for you. An explicit format does, and the quoted lines turn the summary into something you can verify in a minute.',
          },
          {
            id: 'c',
            text: 'Add "think step by step" before the task.',
            rationale:
              'This phrase does not reliably improve output on its own, and it does nothing to make the summary checkable. The prompting hygiene lesson covered why it is folklore, not technique.',
          },
          {
            id: 'd',
            text: 'Nothing. If the colleague says it works, it works.',
            rationale:
              '"It works" from one person on an unknown number of cases is exactly the kind of claim the literacy track taught you to question. Test it on five real threads before adopting it.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/02/quiz-2"
        prompt={
          <>
            You tweak your decision-extraction template and the very next
            transcript produces a noticeably better list. What should you
            conclude?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The change worked. Save the new version and move on.',
            rationale:
              'One output is one sample from a stochastic process. The improvement could be the change, the transcript, or luck. You cannot tell from n=1.',
          },
          {
            id: 'b',
            text: 'Run both versions on four or five more real transcripts, including a difficult one, before deciding.',
            correct: true,
            rationale:
              'Right. Side-by-side on several real inputs is the cheapest evidence that holds up. It also catches the case where the change helps on easy transcripts and hurts on messy ones.',
          },
          {
            id: 'c',
            text: 'Ask the model which version of the prompt is better.',
            rationale:
              'Models cannot reliably judge their own outputs or the prompts that produced them. The literacy track’s self-judgment lesson covered this; the model will give you a confident answer either way.',
          },
          {
            id: 'd',
            text: 'Revert the change. Improvements that appear this fast are suspicious.',
            rationale:
              'Overcorrecting. The change may well be good. The point is to find out with a small test rather than to assume either way.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-workflows/02/reflection"
        prompt={
          <>
            Write a template for one task you do repeatedly. Include all four
            parts: task, output format, constraints, and at least one slot.
            Then write the two- or three-item checklist you would run on its
            output. Be concrete enough that a colleague could use it tomorrow.
          </>
        }
        modelAnswer={
          <>
            <p>
              A reasonable first draft for &ldquo;triage my inbox each
              morning&rdquo;:
            </p>
            <pre><code>{`TASK
Sort the emails below into three groups: needs a reply from me
today, needs a reply this week, no reply needed.

OUTPUT FORMAT
Three headed lists. Each item: sender, subject, and the one
sentence from the email that justifies the grouping, quoted.

CONSTRAINTS
- Anything mentioning a date within 2 days goes in "today".
- If unsure, put it in "today" and mark it "(unsure)".

EMAILS
{{pasted email list}}

CHECKLIST
1. Read every quoted sentence in "today". Agree with each?
2. Skim "no reply needed" subjects for anything from my manager
   or a customer. Promote if found.
3. Anything marked (unsure): decide now.`}</code></pre>
            <p>
              What makes this usable is not the wording. It is that the
              output format makes each grouping checkable from one quoted
              sentence, the constraints encode the failure you care most
              about (missing something urgent), and the checklist points at
              the two places errors cost the most. Your template will differ.
              The structure should not.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: the document workflow. Summarizing, extracting, and comparing
        with verification built in.
      </p>
    </LessonShell>
  );
}
