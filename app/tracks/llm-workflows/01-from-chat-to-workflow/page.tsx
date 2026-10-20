import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { Categorize, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'From Chatting to a Workflow — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-workflows', '01-from-chat-to-workflow');
  return (
    <LessonShell
      lessonId="llm-workflows/01-from-chat-to-workflow"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="From Chatting to a Workflow"
      estMinutes={12}
      nav={nav}
    >
      <p>
        The literacy track ended with a decision framework: four questions you
        ask before you rely on an LLM output. This track starts where that one
        stopped. You have decided an LLM is worth using for some task. Now what,
        concretely, do you do?
      </p>
      <p>
        The honest answer is that &ldquo;open a chat window and describe the
        task&rdquo; is where most people stop, and it is why most people get
        inconsistent results. A chat is a conversation. A workflow is a
        sequence of steps with a defined input, a defined output, and a defined
        way to tell whether each step worked. The difference is not the tool.
        It is whether you decided in advance what the model is for.
      </p>

      <h2>Why &ldquo;just chat with it&rdquo; fails quietly</h2>
      <p>
        Picture a common case: you paste a 40-message email thread into a chat
        and type &ldquo;what should I reply?&rdquo; The model produces a
        fluent reply. It is probably fine. But notice everything you skipped:
      </p>
      <ul>
        <li>You never said what a good reply needs to contain, so you cannot tell whether this one does.</li>
        <li>You never checked whether the model read the thread correctly, so if it missed the one message where the deadline moved, you will too.</li>
        <li>You never separated &ldquo;what was decided&rdquo; (a factual question with a right answer) from &ldquo;how should I phrase my response&rdquo; (a judgment call that is yours).</li>
      </ul>
      <p>
        None of this produces a visible error. It produces a reply that is
        plausibly right, sent by someone who did not actually check. That is
        the pattern the whole literacy track warned about, and it happens
        one chat at a time.
      </p>

      <h2>Three kinds of step</h2>
      <p>
        Almost any knowledge-work task can be broken into steps of three
        kinds. Naming them is the first move in designing a workflow.
      </p>
      <h3>Generate</h3>
      <p>
        Produce candidates: a draft, a list of options, a first-pass summary,
        a proposed table. Generation is what LLMs are genuinely good at. It
        is fast, cheap, and the cost of a bad candidate is low <em>if</em>
        someone filters it afterwards.
      </p>
      <h3>Judge</h3>
      <p>
        Decide. Which option is right for this audience? Is this tone
        appropriate given what happened last quarter? Does this
        recommendation fit the constraints nobody wrote down? Judgment needs
        context the model does not have and accountability the model cannot
        carry. This is the step you keep.
      </p>
      <h3>Verify</h3>
      <p>
        Check an output against ground truth: does the summary match the
        source, do the numbers add up, does the extracted date match the
        document. Verification is sometimes mechanical (run the formula,
        diff the text) and sometimes a human spot check. It is never
        &ldquo;ask the model if it is sure.&rdquo; Lesson 7 of the literacy
        track covered why.
      </p>

      <h2>Worked example: the meeting-notes workflow</h2>
      <p>
        Task: turn a messy transcript of an hour-long planning meeting into
        notes the team will act on. As a single chat prompt this is
        &ldquo;summarize this meeting.&rdquo; As a workflow it looks like this:
      </p>
      <ol>
        <li>
          <strong>Generate:</strong> &ldquo;List every decision stated in this
          transcript. For each, quote the sentence where it was made.&rdquo;
        </li>
        <li>
          <strong>Verify:</strong> you read the quoted sentences (not the
          whole transcript) and confirm each is a decision, not a suggestion
          someone floated and dropped.
        </li>
        <li>
          <strong>Generate:</strong> &ldquo;List every action item with an
          owner and a date, quoting the source sentence.&rdquo;
        </li>
        <li>
          <strong>Verify:</strong> same check. Items with no owner in the
          transcript get flagged, not invented.
        </li>
        <li>
          <strong>Judge:</strong> you decide what goes in the notes, what
          needs a follow-up conversation, and how to phrase the item that
          will annoy the person who missed the meeting.
        </li>
        <li>
          <strong>Generate:</strong> &ldquo;Format these confirmed items as a
          short email in this template.&rdquo;
        </li>
        <li>
          <strong>Verify:</strong> read the email in full before sending. It
          is short, so this is cheap.
        </li>
      </ol>
      <p>
        That is more steps than one prompt. It is also faster than reading the
        transcript yourself, and unlike the single prompt, every model output
        passed through a check before it mattered. The quoting trick in steps
        1 and 3 is doing the heavy lifting: it turns &ldquo;trust the
        summary&rdquo; into &ldquo;read eight sentences.&rdquo;
      </p>

      <h2>Deciding what to hand off</h2>
      <p>
        Once you have the steps, run each one through the{' '}
        <Link href="/tracks/llm-literacy/08-validation-test">four-question test</Link>.
        Can you verify this step&rsquo;s output? What does it cost if it is
        wrong? What does verifying cost? Will you actually do it? The test
        was designed for whole tasks, but it works better on steps, because
        steps are small enough to answer honestly.
      </p>
      <p>
        A rough pattern emerges across most office work:
      </p>
      <ul>
        <li><strong>Hand off</strong> generation steps whose output you can check cheaply: drafts you will read in full, lists you will filter, extractions you can spot-check against quotes.</li>
        <li><strong>Keep</strong> every judgment step. Not because the model cannot produce an opinion, but because nobody can verify an opinion, and you are the one accountable for it.</li>
        <li><strong>Design</strong> the verify steps so they are cheap enough to survive a busy week. If verification means re-reading the whole source, the hand-off has not saved you anything.</li>
      </ul>

      <blockquote>
        <strong>A workflow is a chat where you decided in advance what the
        model is for, what you will check, and what stays yours.</strong>
      </blockquote>

      <h2>The human keeps judgment</h2>
      <p>
        This is worth stating plainly because the tools blur it. A model will
        happily tell you which vendor to pick, which candidate is strongest,
        or whether the complaint is legitimate. Those outputs are fluent and
        sometimes they are right. But a judgment is only as good as the
        context behind it, and the context lives in your head: the history
        with that vendor, the hiring manager&rsquo;s unstated preference, the
        customer who complained last time. Keep the judgment steps. Let the
        model widen your options and shrink your reading. That division of
        labor is the one that holds up.
      </p>

      <Categorize
        exerciseId="llm-workflows/01/categorize"
        prompt={
          <>
            Here are the steps of one workflow: handling a batch of customer
            feedback from a survey. Sort each step into &ldquo;hand off to the
            LLM&rdquo; or &ldquo;keep for a human.&rdquo; Assume the human
            will do cheap verification but not expensive re-reading.
          </>
        }
        items={[
          { id: 's1', text: 'Group 300 free-text responses into rough themes, with example quotes for each', bucket: 'llm' },
          { id: 's2', text: 'Decide which theme the product team should prioritize this quarter', bucket: 'human' },
          { id: 's3', text: 'Draft a one-paragraph summary of each theme for the report', bucket: 'llm' },
          { id: 's4', text: 'Judge whether a specific angry response is a real defect or a misunderstanding', bucket: 'human' },
          { id: 's5', text: 'Pull every response that mentions a refund into a list, quoting the original text', bucket: 'llm' },
          { id: 's6', text: 'Decide how to word the acknowledgement that goes back to the customers', bucket: 'human' },
          { id: 's7', text: 'Suggest five possible titles for the report', bucket: 'llm' },
        ]}
        buckets={[
          { id: 'llm', label: 'Hand off to the LLM', description: 'Generation whose output you can spot-check or filter.' },
          { id: 'human', label: 'Keep for a human', description: 'Judgment that depends on context and accountability.' },
        ]}
      />

      <p className="text-sm text-slate-500">
        Why the grouping step (s1) is a hand-off: the themes are candidates,
        not conclusions, and the example quotes make them cheap to verify. If
        a theme has no convincing quotes, you drop it. Why s4 stays human:
        deciding whether a complaint is a defect needs product knowledge and
        has a real cost if wrong, and no quote makes that judgment checkable.
      </p>

      <Reflection
        exerciseId="llm-workflows/01/reflection"
        prompt={
          <>
            Pick one task you currently do by &ldquo;just chatting&rdquo; with
            an AI tool. Break it into generate / judge / verify steps. Which
            steps were you implicitly handing off that you should keep? Which
            verify steps were you skipping entirely?
          </>
        }
        modelAnswer={
          <>
            <p>
              The most common discovery is a missing verify step. People
              generate a draft, read it for tone, and send it, without ever
              checking the factual claims inside it against the source they
              pasted in. The second most common discovery is a hidden judgment
              step: &ldquo;summarize this&rdquo; quietly includes &ldquo;decide
              what matters,&rdquo; and that decision was made by the model.
            </p>
            <p>
              A decomposition that ends up with <em>more</em> steps than the
              chat version is normal and good. The steps were always there.
              Writing them down is what lets you decide which ones to trust.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: turning the prompts you use repeatedly into templates you can
        test and improve.
      </p>
    </LessonShell>
  );
}
