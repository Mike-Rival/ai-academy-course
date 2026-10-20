import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Is It Actually Helping? — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-workflows', '09-measuring-whether-it-helps');
  return (
    <LessonShell
      lessonId="llm-workflows/09-measuring-whether-it-helps"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Is It Actually Helping?"
      estMinutes={14}
      nav={nav}
    >
      <p>
        Eight lessons of workflows, templates, and verification steps. Here
        is the uncomfortable question: are they saving you time, or do they
        just feel like they are? The two are not the same, and the gap
        between them is larger than most people expect.
      </p>

      <h2>Why your own sense of it is unreliable</h2>
      <p>
        People are poor at estimating how long tasks took them, and worse at
        comparing two ways of doing a task they did on different days. When
        a tool is new and interesting, the time spent using it does not feel
        like work. The verification steps, the re-prompting when the first
        draft missed, the fixing of the one wrong number: those are easy to
        forget when you remember how fast the draft appeared.
      </p>
      <p>
        Published studies of people using AI assistance for real tasks have
        found, more than once, that participants reported feeling faster
        while measured time was flat or slower. The direction is not always
        that way; some tasks show real, measured gains. The point is that
        the feeling and the measurement come apart often enough that the
        feeling is not evidence. The{' '}
        <Link href="/tracks/llm-literacy/10-reading-claims">reading claims</Link>{' '}
        lesson applies to your own experience as much as to a vendor&rsquo;s
        case study.
      </p>

      <h2>Pick a metric that includes the whole job</h2>
      <p>
        The classic mistake is to measure the generation step and ignore the
        rest. &ldquo;The draft took thirty seconds&rdquo; is true and
        irrelevant if the editing took forty minutes. The metric has to span
        from &ldquo;I start the task&rdquo; to &ldquo;the output is done and
        I would stand behind it.&rdquo; For most office work that means
        counting:
      </p>
      <ul>
        <li><strong>Prompting and re-prompting time</strong>, including the second attempt when the first was off.</li>
        <li><strong>Verification time</strong>: the spot-checks, the quote lookups, the reconciling of totals. This is real work and it belongs in the total.</li>
        <li><strong>Rework</strong>: fixing what the model got wrong, and the downstream cost when something slipped through. If a wrong date in an LLM-drafted email caused a 20-minute clarification thread, that is 20 minutes charged to the workflow.</li>
        <li><strong>Quality</strong>, if you can get a rough handle on it. Did a reader ask fewer clarifying questions? Did the table need fewer corrections from whoever used it? This is harder to count, but a workflow that is faster and worse is not a win.</li>
      </ul>
      <p>
        One metric, written down, before you start. &ldquo;Minutes from
        opening the transcript to sending the meeting notes, plus any
        follow-up corrections in the next two days.&rdquo;
      </p>

      <h2>Run a small before/after on yourself</h2>
      <p>
        You do not need a study. You need a few honest data points.
      </p>
      <ol>
        <li><strong>Baseline.</strong> Do the task the old way three to five times and time it with a clock, not memory. Write each number down the moment you finish.</li>
        <li><strong>New way.</strong> Do it with the workflow three to five times. Same clock, same rule: the timer stops when you would stand behind the output, not when the draft appears.</li>
        <li><strong>Count rework.</strong> For both sets, note anything that came back: a correction, a question, a number someone caught. Add the time.</li>
        <li><strong>Compare the middle, not the best.</strong> Look at the typical run from each set, not the fastest. One spectacular LLM run and three slow ones is a workflow that is usually slow.</li>
      </ol>
      <p>
        This is crude. Five runs is a small sample, you are not blind to
        which condition you are in, and tasks vary. But it is enormously
        better than the alternative, which is deciding based on how the
        fastest run felt. And it produces a number you can revisit: if the
        workflow saves eight minutes per meeting and you have four meetings
        a week, you know what it is worth and whether it is worth the
        maintenance.
      </p>
      <p>
        Alternate the two conditions if you can rather than doing all the
        old-way runs first. Otherwise you are also measuring how much easier
        the task got as you practiced it.
      </p>

      <h2>The verification budget</h2>
      <p>
        Here is a way to think about it that makes the trade-off explicit.
        For any workflow, the time saved by the LLM step is the budget you
        have to spend on verification. If the model saves you twenty minutes
        of drafting, and proper verification costs five, you net fifteen. If
        verification costs twenty-five, the workflow is losing money and you
        should either shrink the task so verification gets cheaper, or stop.
      </p>
      <p>
        The budget framing stops two bad habits. The first is skipping
        verification to make the numbers work: if the only way the workflow
        is faster is by not checking, it is not faster, it is riskier. The
        second is over-verifying out of anxiety: if the cost of error is
        small and bounded, spending more on verification than the error would
        cost is also a loss. The{' '}
        <Link href="/tracks/llm-literacy/08-validation-test">four-question test</Link>{' '}
        is how you size the budget. The clock is how you find out whether you
        are staying inside it.
      </p>

      <h2>What to do with the answer</h2>
      <ul>
        <li><strong>It helps, measurably.</strong> Keep it, write down the number, and re-measure in a few months, since models, tools, and your task all change.</li>
        <li><strong>It is a wash.</strong> Ask whether the quality changed. Equal time with fewer errors is a win; equal time with the same errors is a hobby. Either is fine as long as you know which.</li>
        <li><strong>It is slower.</strong> Common, and not a failure of yours. Look at where the time went. Usually it is re-prompting (fix the template) or verification (shrink the task). If neither fixes it, drop the LLM step for this task and move on. The literacy track said this from the start: not every task is a fit.</li>
      </ul>

      <blockquote>
        <strong>Feeling faster is not evidence. Time the whole job with a
        clock, count the rework, and treat the time saved as the budget you
        spend on checking.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-workflows/09/quiz-1"
        prompt={
          <>
            You time your LLM-assisted report workflow: draft generated in
            one minute, your editing and fact-checking took 35 minutes.
            Doing it by hand usually took 40 minutes. A colleague says
            &ldquo;so the AI saved you 39 minutes.&rdquo; What is the honest
            number?
          </>
        }
        options={[
          {
            id: 'a',
            text: '39 minutes. The draft took one minute instead of 40.',
            rationale:
              'This measures the generation step and ignores the rest of the job. The report was not done after one minute; it was done after 36.',
          },
          {
            id: 'b',
            text: 'About 4 minutes, and only if the quality was at least as good and nothing came back for correction.',
            correct: true,
            rationale:
              'Right. Whole-job time went from 40 to 36. That is a real but modest saving, and it only counts if rework did not eat it. Five timed runs would tell you whether four minutes is typical or noise.',
          },
          {
            id: 'c',
            text: 'Zero. Verification always cancels out the savings.',
            rationale:
              'Overcorrecting. Sometimes it does, sometimes it does not. The whole point of measuring is to find out which, rather than assuming either way.',
          },
          {
            id: 'd',
            text: 'Cannot say without knowing how the colleague measured.',
            rationale:
              'You have the measurement; it is your own run. The question is which parts of it count, and the answer is all of them.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/09/quiz-2"
        prompt={
          <>
            Which of these is the strongest evidence that a new workflow is
            saving time?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'It feels much faster, and the drafts appear almost instantly.',
            rationale:
              'This is the feeling that studies have repeatedly found to come apart from measured time. Instant drafts are the most visible part of the job and often the smallest.',
          },
          {
            id: 'b',
            text: 'Your best run with the workflow was 15 minutes; your usual time by hand was 40.',
            rationale:
              'Comparing the best run of one condition to the typical run of the other is the classic way to fool yourself. Compare typical to typical.',
          },
          {
            id: 'c',
            text: 'Five timed runs each way, alternated, with rework counted; the typical workflow run is 28 minutes against 40 by hand.',
            correct: true,
            rationale:
              'Right. Clock-timed, whole-job, several runs, alternated, rework included, compared at the middle. Still a small sample, but every major source of self-deception has been addressed.',
          },
          {
            id: 'd',
            text: 'A vendor case study reports 60% time savings on similar tasks.',
            rationale:
              'The reading-claims lesson covered this. A vendor’s number on someone else’s task tells you little about your task, and you have no way to check how it was measured.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-workflows/09/reflection"
        prompt={
          <>
            Pick one workflow from this track you have started using, or
            intend to. Write down: the metric (start to stand-behind-it,
            plus rework), how you will time the baseline, how many runs of
            each, and the number at which you would decide it is not worth
            it. Then estimate what you expect the result to be, so you can
            check your own calibration later.
          </>
        }
        modelAnswer={
          <>
            <p>
              A workable plan for the meeting-notes workflow: metric is
              minutes from opening the transcript to sending the notes, plus
              any correction thread in the following two days. Baseline is
              the next three meetings done by hand, timed. Then three with the
              workflow, timed the same way. Stop rule: if the typical
              workflow run is not at least five minutes faster with no more
              corrections, drop it.
            </p>
            <p>
              The prediction step matters more than it looks. If you expect
              to save twenty minutes and measure four, that gap is
              information about how much to trust your sense of these tools
              in general. Most people find their estimates run optimistic.
              Knowing your own bias is worth more than any single result.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: the capstone. Take one recurring workflow and redesign it
        end to end.
      </p>
    </LessonShell>
  );
}
