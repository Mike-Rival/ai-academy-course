import LessonShell from '@/components/LessonShell';
import { Categorize, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'The Unverifiability Trap — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-literacy', '06-unverifiability-trap');
  return (
    <LessonShell
      lessonId="llm-literacy/06-unverifiability-trap"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="The Unverifiability Trap"
      estMinutes={15}
      nav={nav}
    >
      <p>
        This is the most important lesson in the track. It deserves your attention
        even if you skim the rest.
      </p>

      <h2>The argument you&rsquo;ll hear</h2>
      <blockquote>
        &ldquo;AI lets us read documents we never could have read before. That has
        to be a net win.&rdquo;
      </blockquote>
      <p>
        It&rsquo;s a strong argument on its surface. You couldn&rsquo;t personally
        read 500 case files, 200 customer emails, or a 300-page contract. Now you
        get a useful-looking summary in minutes. The volume of material that was
        previously inaccessible to you is now apparently accessible.
      </p>

      <h2>The hidden problem</h2>
      <p>
        <strong>The property that makes the LLM valuable here is the same property
        that makes its output unverifiable.</strong> You asked for a summary of 500
        case files <em>because you couldn&rsquo;t read 500 case files</em>. That
        means you also can&rsquo;t verify the summary. You have no way to know
        whether the model missed the load-bearing detail, fabricated a pattern, or
        emphasized a minority view as if it were the majority. The thing that gave
        the LLM value is the thing that ate your verification path.
      </p>
      <p>
        This is not a model quality issue. A perfectly accurate summary and a wrong
        summary look identical to you, because you don&rsquo;t have ground truth.
        You&rsquo;ve traded one situation for a strictly different one — but not
        obviously better.
      </p>

      <h2>Honest ignorance vs. confident ignorance</h2>
      <p>
        Before the LLM, you had <strong>honest ignorance</strong>: &ldquo;I
        haven&rsquo;t read these files. I don&rsquo;t know what they say.&rdquo;
        You knew the boundary of your knowledge. You acted accordingly.
      </p>
      <p>
        After the LLM, you have <strong>confident ignorance</strong>: &ldquo;I have
        a fluent, structured-looking summary in front of me. I think I know what
        these files say.&rdquo; You will act on this belief, and you will be wrong
        in proportion to how often the summary missed something — which you have
        no way to measure.
      </p>
      <p>
        Confident ignorance is often <em>worse</em> than honest ignorance, because
        honest ignorance leads to caution and confident ignorance leads to action.
        &ldquo;I read it&rdquo; (with an asterisk you forget) is more dangerous
        than &ldquo;I haven&rsquo;t read it.&rdquo;
      </p>

      <h2>The diagnostic question</h2>
      <p>
        For any LLM output, ask: <strong>can I verify this output, in principle, at
        a cost I&rsquo;d actually pay?</strong>
      </p>
      <p>If the answer is no, you are in the unverifiability regime. That is not always wrong to be in, but you must be in it deliberately, with the right kind of use.</p>

      <h2>Three legitimate uses in the unverifiable regime</h2>
      <ol>
        <li>
          <strong>Triage</strong> — &ldquo;does this folder of 500 cases probably
          contain the kind of thing I&rsquo;m looking for? Worth digging into?&rdquo;
          The model&rsquo;s answer guides further work; it isn&rsquo;t the answer.
          Cost of being wrong is &ldquo;I spent more time looking through cases
          than I needed to,&rdquo; which is bounded.
        </li>
        <li>
          <strong>Sample-verified summarization</strong> — accept the summary, then
          spot-check 5–10% of source material against the summary&rsquo;s claims.
          If the sample looks right, you have probabilistic confidence (not
          certainty). If the sample is wrong, throw out the whole summary.
        </li>
        <li>
          <strong>Hypothesis generation</strong> — the model proposes themes or
          questions that you then investigate by hand. The model&rsquo;s output is
          input to your investigation, not a substitute for it.
        </li>
      </ol>

      <h2>And the use that doesn&rsquo;t work</h2>
      <p>
        <strong>Treating an unverifiable summary as ground truth in a decision that
        will harm someone if wrong.</strong> A medical chart summary that determines
        treatment. A legal brief that determines a client&rsquo;s case. A
        compliance review of 10,000 invoices. A vendor evaluation that determines a
        contract worth millions. These call for either real human review, narrower
        retrieval-backed claims with citations you actually verify, or an explicit
        acceptance of the risk by the person making the decision.
      </p>

      <Categorize
        exerciseId="llm-literacy/06/categorize"
        prompt={
          <>
            For each task, decide which regime it sits in. Use the principles from
            this lesson: can the user verify the output? At what cost? What&rsquo;s
            the consequence of being wrong?
          </>
        }
        items={[
          {
            id: 't1',
            text: '"Convert this CSV of 50 rows into JSON."',
            bucket: 'verifiable',
          },
          {
            id: 't2',
            text: '"Refactor this 30-line function for readability."',
            bucket: 'verifiable',
          },
          {
            id: 't3',
            text: '"Summarize this 800-page contract for the deal review meeting."',
            bucket: 'unverifiable-decision',
          },
          {
            id: 't4',
            text: '"Skim these 50 customer emails and tell me roughly what topics come up."',
            bucket: 'unverifiable-triage',
          },
          {
            id: 't5',
            text: '"Find the relevant clauses about indemnification in these 200 vendor agreements; I will read the ones it flags."',
            bucket: 'sample-verifiable',
          },
          {
            id: 't6',
            text: '"Diagnose what is in this radiology image."',
            bucket: 'unverifiable-decision',
          },
          {
            id: 't7',
            text: '"Draft a cover email I will edit before sending."',
            bucket: 'verifiable',
          },
          {
            id: 't8',
            text: '"Pull the total spend from this expense report PDF."',
            bucket: 'sample-verifiable',
          },
        ]}
        buckets={[
          {
            id: 'verifiable',
            label: 'Verifiable',
            description: 'You can check the entire output yourself, cheaply.',
          },
          {
            id: 'sample-verifiable',
            label: 'Sample-verifiable',
            description: 'You can spot-check a slice; reject the whole if the sample fails.',
          },
          {
            id: 'unverifiable-triage',
            label: 'Unverifiable but OK for triage',
            description: 'Output guides further work; consequence of error is bounded.',
          },
          {
            id: 'unverifiable-decision',
            label: 'Unverifiable AND load-bearing — needs human review',
            description: "You can't check it, and being wrong has real cost.",
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/06/reflection"
        prompt={
          <>
            Pick one task in your work where you currently use (or are tempted to
            use) an LLM in a way that&rsquo;s effectively unverifiable. Be honest:
            which of the regimes above does that use actually fall into? If
            it&rsquo;s the &ldquo;load-bearing&rdquo; one, what would it take to
            move it into a different regime — sample verification, narrower scope,
            or genuine human review?
          </>
        }
        modelAnswer={
          <>
            <p>
              Most workplaces have at least one of these creeping in. The pattern
              is usually:
            </p>
            <ol>
              <li>A task is too big to do by hand.</li>
              <li>An LLM does a fast version of it that looks fine.</li>
              <li>The output gets used downstream without anyone reading the source.</li>
              <li>
                Errors only surface much later (or never), and only when the
                downstream consequence is bad enough that someone goes back to
                check.
              </li>
            </ol>
            <p>
              The move that works most often: <strong>shrink the task</strong>.
              Don&rsquo;t ask the model for a summary of 500 cases. Ask it to
              flag the 10–20 cases most likely to contain a specific pattern, and
              then read those 10–20 yourself. You&rsquo;ve moved from
              unverifiable-decision to sample-verifiable, and the model is still
              doing the work it&rsquo;s actually good at.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: why you can&rsquo;t ask the model itself to grade its work.
      </p>
    </LessonShell>
  );
}
