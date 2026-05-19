import LessonShell from '@/components/LessonShell';
import { Categorize, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'The Validation Test — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-literacy', '08-validation-test');
  return (
    <LessonShell
      lessonId="llm-literacy/08-validation-test"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="The Validation Test"
      estMinutes={12}
      nav={nav}
    >
      <p>
        This lesson pulls the previous ones together into a single decision
        framework you can apply, in real time, before you use an LLM output.
      </p>

      <h2>The four questions</h2>

      <h3>Q1: Can I verify the output?</h3>
      <p>
        Not &ldquo;could a domain expert,&rdquo; not &ldquo;could I if I had
        time&rdquo; — can <em>you</em>, with the time and tools you actually have,
        check the output against some external ground truth?
      </p>
      <ul>
        <li><strong>Yes, fully:</strong> the output is short and you can read both it and the source.</li>
        <li><strong>Yes, partially:</strong> you can sample-check a slice.</li>
        <li><strong>No:</strong> the answer is opaque, the source unreadable, or you have no ground truth at all.</li>
      </ul>

      <h3>Q2: What&rsquo;s the cost if the output is wrong and I act on it?</h3>
      <ul>
        <li><strong>Negligible:</strong> minor rework, embarrassment at most.</li>
        <li><strong>Bounded:</strong> some recoverable cost — wasted time, a redo.</li>
        <li><strong>Significant or unbounded:</strong> harm to a customer, legal exposure, a decision that&rsquo;s hard to reverse, reputational damage.</li>
      </ul>

      <h3>Q3: What&rsquo;s the cost of verifying?</h3>
      <ul>
        <li><strong>Trivial:</strong> read the output, click a link, compare two numbers.</li>
        <li><strong>Moderate:</strong> a sample check, a focused re-read.</li>
        <li><strong>Prohibitive:</strong> the verification is the same effort as doing the task without the LLM (this is the unverifiability regime).</li>
      </ul>

      <h3>Q4: Will I actually do the verification?</h3>
      <p>
        The most honest question. If verifying costs 30 seconds you will do it.
        If it costs an hour you might. If it costs the rest of the afternoon you
        won&rsquo;t — no matter how much you intend to.
      </p>
      <p>
        <strong>Plan the workflow for the verification you&rsquo;ll actually do,
        not the one you wish you would.</strong>
      </p>

      <h2>Putting it together: the decision</h2>
      <table className="border-collapse my-4">
        <thead>
          <tr>
            <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">If verifiable AND…</th>
            <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Cost if wrong</th>
            <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Use the LLM?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border border-slate-300 dark:border-slate-700 p-2">Verification is cheap, you&rsquo;ll do it</td><td className="border border-slate-300 dark:border-slate-700 p-2">Any</td><td className="border border-slate-300 dark:border-slate-700 p-2"><strong>Yes</strong></td></tr>
          <tr><td className="border border-slate-300 dark:border-slate-700 p-2">Verification is moderate, you&rsquo;ll do it</td><td className="border border-slate-300 dark:border-slate-700 p-2">Bounded</td><td className="border border-slate-300 dark:border-slate-700 p-2"><strong>Yes</strong></td></tr>
          <tr><td className="border border-slate-300 dark:border-slate-700 p-2">Verification is moderate, you&rsquo;ll do it</td><td className="border border-slate-300 dark:border-slate-700 p-2">Significant</td><td className="border border-slate-300 dark:border-slate-700 p-2"><strong>Yes — and double-check the verification rigor</strong></td></tr>
          <tr><td className="border border-slate-300 dark:border-slate-700 p-2">Verification is prohibitive</td><td className="border border-slate-300 dark:border-slate-700 p-2">Negligible</td><td className="border border-slate-300 dark:border-slate-700 p-2"><strong>Use as triage</strong> — output is input to further work, not the answer</td></tr>
          <tr><td className="border border-slate-300 dark:border-slate-700 p-2">Verification is prohibitive</td><td className="border border-slate-300 dark:border-slate-700 p-2">Significant or unbounded</td><td className="border border-slate-300 dark:border-slate-700 p-2"><strong>No</strong>, or: shrink the task until verification becomes feasible</td></tr>
        </tbody>
      </table>

      <h2>The escape hatch</h2>
      <p>
        Most &ldquo;don&rsquo;t use the LLM here&rdquo; cases have a third option:
        <strong> shrink the task</strong> until it moves into a regime you can
        verify. Instead of asking the model to read 500 documents and summarize
        them, ask it to flag the 10 documents most likely to mention a specific
        thing — then you read those 10. The model is still useful; the part you
        rely on is now small enough to verify.
      </p>

      <Categorize
        exerciseId="llm-literacy/08/categorize"
        prompt={
          <>
            For each task, apply the framework. Where does this task land?
          </>
        }
        items={[
          { id: 't1', text: '"Draft a 200-word intro for this blog post."', bucket: 'use' },
          { id: 't2', text: '"Decide which job applicants to advance to interview, based on their resumes."', bucket: 'avoid' },
          { id: 't3', text: '"Suggest three test cases for this function I just wrote."', bucket: 'use' },
          { id: 't4', text: '"Write the patient discharge instructions based on this medical record."', bucket: 'avoid' },
          { id: 't5', text: '"From these 100 product reviews, surface the top complaints I should read myself."', bucket: 'use-as-triage' },
          { id: 't6', text: '"Write a SQL query for this table; I will run it on a copy and check the output."', bucket: 'use' },
          { id: 't7', text: '"Summarize a 100-page deposition for trial prep; I will use it to decide cross-examination strategy."', bucket: 'avoid' },
          { id: 't8', text: '"Skim this email thread and tell me roughly what was decided so I can confirm with the team."', bucket: 'use-as-triage' },
        ]}
        buckets={[
          { id: 'use', label: 'Use it', description: 'Verifiable cheaply, you will actually verify.' },
          { id: 'use-as-triage', label: 'Use as triage only', description: 'Output guides further (verifiable) work; consequence bounded.' },
          { id: 'avoid', label: 'Avoid or restructure', description: 'Load-bearing and unverifiable; shrink the task or do it by hand.' },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/08/reflection"
        prompt={
          <>
            Pick three specific tasks you do regularly at work. For each, walk
            through the four questions above. Did any of them end up in a
            different bucket than you expected?
          </>
        }
        modelAnswer={
          <>
            <p>
              The two most common surprises are:
            </p>
            <ol>
              <li>
                <strong>A task you thought was &ldquo;just drafting&rdquo; turns out
                to be load-bearing</strong> — the draft gets sent without serious
                editing, so its quality matters more than you assumed.
              </li>
              <li>
                <strong>A task you thought required AI is actually small enough to
                do yourself</strong> — the AI version was tempting because it felt
                faster, but the verification cost erases the savings.
              </li>
            </ol>
            <p>
              Both surprises are useful. The point of the framework is not to keep
              you from using AI — it&rsquo;s to make the decision conscious.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: RAG, agents, fine-tuning — and what they don&rsquo;t fix.
      </p>
    </LessonShell>
  );
}
