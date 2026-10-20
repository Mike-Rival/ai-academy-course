import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Capstone: Redesign One Recurring Workflow — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-workflows', '10-capstone');
  return (
    <LessonShell
      lessonId="llm-workflows/10-capstone"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Capstone: Redesign One Recurring Workflow"
      estMinutes={25}
      nav={nav}
    >
      <p>
        Like the literacy capstone, this is not a quiz. It is a structured
        redesign of one real, recurring piece of your work, done in writing,
        using everything in the previous nine lessons. By the end you will
        have a workflow you could start running next week and a plan for
        finding out whether it was worth it.
      </p>

      <h2>Pick the workflow</h2>
      <p>
        Recurring, specific, and yours. Not &ldquo;reporting&rdquo; but
        &ldquo;the monthly status report I send to the steering group.&rdquo;
        Not &ldquo;dealing with email&rdquo; but &ldquo;the twenty or so
        scheduling requests I handle each week.&rdquo; Recurring matters
        because a workflow you run once is not worth designing, and because
        measurement needs repetition. Pick something that happens at least
        weekly if you can.
      </p>
      <p>
        Then work through the six sections below. Commit to each answer in
        the box before reading ours.
      </p>

      <h2>1. Map the steps</h2>

      <Reflection
        exerciseId="llm-workflows/10/q1"
        prompt={
          <>
            Write out the workflow as it exists today, step by step, from the
            moment it starts to the moment the output is in someone
            else&rsquo;s hands. Label each step <strong>generate</strong>,
            <strong> judge</strong>, or <strong>verify</strong>. Include the
            steps you do without thinking about them; those are usually the
            judgment steps.
          </>
        }
        modelAnswer={
          <>
            <p>
              The monthly status report, mapped honestly:
            </p>
            <ol>
              <li>Collect updates from four team leads (generate, by others).</li>
              <li>Read them and decide what is actually news (judge).</li>
              <li>Pull three numbers from the project tracker (generate).</li>
              <li>Check the numbers against last month&rsquo;s report (verify).</li>
              <li>Write the two-paragraph summary (generate).</li>
              <li>Decide how to frame the slipped milestone (judge).</li>
              <li>Format into the template, send (generate).</li>
            </ol>
            <p>
              Most people find more judgment steps than they expected, hidden
              inside what felt like one &ldquo;write the report&rdquo; task.
              Step 2 and step 6 are where the report&rsquo;s value lives. If
              your map has no judge steps at all, look again; you have
              probably folded them into a generate step.
            </p>
          </>
        }
      />

      <h2>2. Assign each step</h2>

      <Reflection
        exerciseId="llm-workflows/10/q2"
        prompt={
          <>
            For every step, decide: human, LLM, or a mechanical tool (a diff,
            a spreadsheet, a search). Apply the{' '}
            <Link href="/tracks/llm-literacy/08-validation-test">four questions</Link>{' '}
            to each LLM candidate. Which steps did you want to hand off that
            failed the test? Which did you assume were yours that could be
            handed off safely?
          </>
        }
        modelAnswer={
          <>
            <p>
              For the status report: steps 1, 3, and 7 are mechanical or
              already done by others. Step 5, the summary draft, is a good
              LLM candidate: short, read in full, cheap to verify. Step 4,
              checking numbers, stays mechanical (a spreadsheet comparison),
              not LLM; the model has nothing to add and would introduce an
              error rate where there was none. Steps 2 and 6 stay human. The
              slipped-milestone framing in particular is exactly the kind of
              judgment where a plausible default from the model is the wrong
              default.
            </p>
            <p>
              A common surprise is that the LLM ends up with fewer steps than
              expected and the mechanical tools with more. That is a good
              sign. Tools with no error rate should take every step they can.
            </p>
          </>
        }
      />

      <h2>3. Define verification for each LLM step</h2>

      <Reflection
        exerciseId="llm-workflows/10/q3"
        prompt={
          <>
            For every step you assigned to an LLM, write the specific
            verification: what you will check, against what source, and how
            long it takes. &ldquo;Read it over&rdquo; is not specific.
            &ldquo;Ask for each claim with its source update quoted, and
            confirm the three numeric claims against the tracker&rdquo; is.
            Then write the template, with its output format and checklist, for
            at least one of these steps.
          </>
        }
        modelAnswer={
          <>
            <p>
              For the summary draft (step 5):
            </p>
            <pre><code>{`TASK
Write a two-paragraph status summary from the lead updates
and numbers below. Use only facts that appear in them.

OUTPUT FORMAT
The two paragraphs, then a section "Claims" listing every
factual statement in the summary with the quoted line from
the source update or the tracker figure it came from.
Mark anything not directly supported as [unsupported].

CONSTRAINTS
- No characterizations of progress ("strong", "on track")
  unless a lead used that word; quote them if so.
- Leave the milestone paragraph as [HUMAN WRITES THIS].

CHECKLIST
1. Read the Claims list (about 2 minutes). Every item sourced?
2. Confirm the three numbers against the tracker (1 minute).
3. Anything [unsupported]: delete or verify.
4. Write the milestone paragraph myself.`}</code></pre>
            <p>
              The verification cost here is about four minutes against a
              drafting step that used to take twenty. That is inside the
              budget. If your verification for a step comes out longer than
              the time the step saves, that step should go back to a human
              or be shrunk until the check gets cheaper.
            </p>
          </>
        }
      />

      <h2>4. Decide what persists and what is automated</h2>

      <Reflection
        exerciseId="llm-workflows/10/q4"
        prompt={
          <>
            What, if anything, belongs in standing context (a project with
            the template and reference files, a custom instruction)? What, if
            anything, should be scheduled or automated, and in which mode:
            draft-for-approval, or fully autonomous? Name the kill switch and
            the monitoring for anything automated. If the answer is
            &ldquo;nothing persists and nothing is automated,&rdquo; say why.
          </>
        }
        modelAnswer={
          <>
            <p>
              For the status report: the template and the report format live
              in a project, dated. No facts about the project go in standing
              context; the lead updates and tracker numbers are pasted fresh
              each month because they change. A scheduled task could collect
              the four lead updates into one document the day before, in
              draft mode: it reads a shared folder and produces a file, and
              the kill switch is deleting the schedule. Monitoring is the
              count: four updates expected, and fewer than four means someone
              did not file, not that the task should proceed.
            </p>
            <p>
              &ldquo;Nothing automated&rdquo; is a perfectly good answer for
              a monthly task. The setup and monitoring cost of an automation
              that runs twelve times a year rarely pays back. Automation
              earns its keep on daily and weekly work.
            </p>
          </>
        }
      />

      <h2>5. The measurement plan</h2>

      <Reflection
        exerciseId="llm-workflows/10/q5"
        prompt={
          <>
            Write the metric (whole job, start to stand-behind-it, plus
            rework), how you will time the baseline, how many runs of each,
            and your prediction. Be specific about what counts as rework for
            this workflow.
          </>
        }
        modelAnswer={
          <>
            <p>
              Status report: metric is minutes from opening the lead updates
              to sending, plus any minutes spent on questions or corrections
              from the steering group in the following week. Baseline is the
              last two reports done the old way, timed from memory of the
              calendar (imperfect, but monthly tasks do not give you many
              runs), and the next one timed with a clock. Then three with the
              workflow. Prediction: from about 90 minutes to about 60.
            </p>
            <p>
              For a monthly task, the sample is going to be small and the
              measurement rough. That is fine. The plan still forces you to
              count the whole job, including the four minutes of
              verification and the time the steering group spends asking
              what &ldquo;on track&rdquo; meant. Rough and honest beats
              precise and partial.
            </p>
          </>
        }
      />

      <h2>6. The stop rule</h2>

      <Reflection
        exerciseId="llm-workflows/10/q6"
        prompt={
          <>
            Write the condition under which you will abandon or roll back
            the redesigned workflow. A number, a kind of error, or a time
            limit. &ldquo;If it does not seem to be working&rdquo; is not a
            stop rule. What specifically would make you stop, and when will
            you check?
          </>
        }
        modelAnswer={
          <>
            <p>
              Status report: after three runs, if the typical whole-job time
              is not at least fifteen minutes under the baseline, or if any
              run produced a factual error that reached the steering group,
              revert to the old process and revisit the template. Check date
              is on the calendar, the day after the third report goes out.
            </p>
            <p>
              The stop rule exists because without one, a workflow that is
              not working gets kept out of sunk cost and novelty. The
              literacy track asked you to decide before you use. This track
              asks you to decide, in advance, what would make you stop. Both
              are the same discipline: make the call while you can still
              think clearly about it, not after you are invested.
            </p>
            <p>
              The error clause matters as much as the time clause. A workflow
              that is faster and has sent one wrong number to a steering
              group is not a success. Name the error that would end it before
              it happens.
            </p>
          </>
        }
      />

      <h2>You&rsquo;ve completed the track</h2>
      <p>
        The literacy track gave you a way to decide whether to use an LLM.
        This track gave you a way to use one: break the work into generate,
        judge, and verify; write the templates down and test them; make the
        model show its work so checking is cheap; keep standing context
        clean; automate only what is harmless when wrong; and measure the
        whole job with a clock instead of trusting the feeling.
      </p>
      <p>
        If you took one thing from this track: <strong>the verification step
        is part of the workflow, not an afterthought to it.</strong> A
        workflow where checking is cheap and built in will keep working as
        models change, tools change, and your tasks change. A workflow that
        depends on the model being right will not.
      </p>
      <p>
        From here, if you want to understand what is happening inside these
        models, the AI &amp; Deep Learning track covers tokenization,
        embeddings, attention, and transformers. If you would rather build
        with data directly, Python Basics and Machine Learning Basics are
        there. Or take the workflow you just designed, run it three times,
        and look at the number. That is the real capstone.
      </p>
    </LessonShell>
  );
}
