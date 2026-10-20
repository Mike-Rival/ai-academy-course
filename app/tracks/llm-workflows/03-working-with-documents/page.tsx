import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { Categorize, MultipleChoice } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Summarize, Extract, Compare — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-workflows', '03-working-with-documents');
  return (
    <LessonShell
      lessonId="llm-workflows/03-working-with-documents"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Summarize, Extract, Compare"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Documents are where LLMs save the most time and where the errors are
        hardest to see. A summary that drops one clause from a contract looks
        exactly like a summary that did not. This lesson is about the three
        document operations you will use most, and the verification that
        makes each one safe enough to rely on.
      </p>

      <h2>The core problem: silent omission</h2>
      <p>
        When a model summarizes, it chooses what to keep. When it extracts, it
        chooses what counts as a match. When it compares two versions, it
        chooses what counts as a difference. In every case, the thing it left
        out is invisible in the output. You cannot see an omission by reading
        the summary harder. You can only see it by looking back at the source.
      </p>
      <p>
        So every document workflow in this lesson has the same shape:
        <strong> make the model show its work, then check a sample of that
        work against the source.</strong> The specific technique varies. The
        principle does not.
      </p>

      <h2>Summarize: ask for quoted passages</h2>
      <p>
        A plain summary is unverifiable without re-reading. A summary where
        each claim is tied to a verbatim quote is verifiable in minutes. The
        template:
      </p>
      <pre><code>{`Summarize the document below in at most 8 bullet points.
For each bullet, include the exact passage (quoted, verbatim)
that supports it. If a bullet combines two passages, quote both.
Then add a final section titled "Not covered" listing any
headed section of the document that none of the bullets draws on.`}</code></pre>
      <p>
        The &ldquo;not covered&rdquo; section is the important part. It makes
        the model report what it skipped, which turns an invisible omission
        into a visible list you can glance at. If a section called
        &ldquo;Termination&rdquo; shows up under &ldquo;not covered&rdquo; in
        a contract summary, you know to read it yourself.
      </p>
      <p>
        Verification: search the source for two or three of the quotes. If
        they are there verbatim and mean what the bullet says, trust the rest
        provisionally. If a quote is not in the source, or is there but says
        something different, stop trusting the whole summary. One fabricated
        quote means the model was not reading carefully, and you cannot tell
        which other bullets are affected.
      </p>

      <h2>Extract: spot-check a sample</h2>
      <p>
        Extraction is pulling specific fields out of unstructured text: every
        date in a set of letters, every dollar figure in an invoice batch,
        every person named in a report. The output is a list or table. The
        failure modes are misses (a value in the source that is not in the
        list) and inventions (a value in the list that is not in the source).
      </p>
      <p>
        Inventions are easy to check: pick five rows at random and find each
        in the source. Misses are harder, because you are looking for
        something that is not in the output. The practical approach:
      </p>
      <ol>
        <li>Pick one short, randomly chosen section of the source.</li>
        <li>Extract the fields from that section yourself, by hand.</li>
        <li>Compare your list to the model&rsquo;s rows for that section.</li>
      </ol>
      <p>
        If your hand-extracted list matches, you have some evidence the
        model&rsquo;s coverage is good. If you found something the model
        missed, you have learned the miss rate is not zero, and you should
        either tighten the template or sample more. A miss in a one-page
        sample of a 50-page document is a strong signal, not a one-off.
      </p>

      <h2>Compare: diff against the source</h2>
      <p>
        &ldquo;What changed between version 2 and version 3 of this
        policy?&rdquo; is a question people love to hand to a model and a
        question models get subtly wrong. They describe differences in
        meaning, which is useful, but they miss small textual changes
        (&ldquo;may&rdquo; to &ldquo;must,&rdquo; a date, a threshold)
        because those do not feel important in a paraphrase.
      </p>
      <p>
        The better workflow splits the job:
      </p>
      <ul>
        <li><strong>Mechanical diff first.</strong> Most word processors and many free online tools will show every character that changed between two texts. This step has no judgment in it and no error rate. Do it before the model touches anything.</li>
        <li><strong>Model second.</strong> Paste the diff output and ask: &ldquo;For each change in this diff, explain in one sentence what it changes in practice. Flag any change to an obligation, a number, or a date.&rdquo;</li>
      </ul>
      <p>
        Now the model is interpreting a complete list of changes rather than
        producing one. Its job shrank from &ldquo;find and explain&rdquo; to
        &ldquo;explain,&rdquo; and the finding part, where silent omission
        lives, was done by a tool that does not omit.
      </p>
      <p>
        The same trick works for summaries of your own documents: if you
        asked the model to tighten a report, diff the before and after. You
        will often find a sentence that disappeared and should not have.
      </p>

      <h2>Long documents</h2>
      <p>
        Models have a limit on how much text they can take in at once, and
        well before that limit, quality on the middle of a long document
        tends to drop. A 200-page document pasted whole may produce a summary
        that is accurate on the first and last chapters and vague on the
        rest. This is the same mechanism as{' '}
        <Link href="/tracks/llm-literacy/04-conversation-rot">conversation rot</Link>,
        applied to a single input.
      </p>
      <p>
        The workflow fix is to chunk: summarize section by section with the
        quoted-passage template, then summarize the section summaries. You
        get verification hooks at every level, and you can tell which section
        a weak bullet came from. It costs more prompts. It costs less than
        acting on a summary that silently skipped chapter seven.
      </p>
      <p>
        One honest caveat: for a document you must understand completely, a
        contract you are signing, a policy you are accountable for, the
        summary is a reading guide, not a substitute. Use it to decide which
        sections to read closely. Then read them.
      </p>

      <blockquote>
        <strong>Make the model show its work with quotes and a &ldquo;not
        covered&rdquo; list. Then check a sample against the source. The
        omission you cannot see is the one that costs you.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-workflows/03/quiz-1"
        prompt={
          <>
            You asked for a summary of a 30-page vendor proposal with quoted
            passages. You spot-check three quotes. Two are in the source
            verbatim. The third is not in the document anywhere, although it
            sounds like something the proposal would say. What do you do?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Delete that one bullet and use the rest of the summary.',
            rationale:
              'A fabricated quote tells you the model was not reliably reading the source. You have no way to know which of the other bullets were produced the same way. The problem is not the bullet; it is your evidence about the whole output.',
          },
          {
            id: 'b',
            text: 'Treat the whole summary as unverified. Re-run with a tighter template or chunk the document, and check a larger sample next time.',
            correct: true,
            rationale:
              'Right. One invention in a sample of three is a high observed rate. The summary might still be mostly fine, but you no longer have grounds to rely on it. Re-run, and sample more before trusting the result.',
          },
          {
            id: 'c',
            text: 'Ask the model where the quote came from.',
            rationale:
              'It will produce an answer. The answer will be fluent. The literacy track’s self-judgment lesson explains why this answer is not evidence of anything.',
          },
          {
            id: 'd',
            text: 'The quote sounds right, so accept it as a close paraphrase.',
            rationale:
              '"Sounds right" is what fluent fabrication feels like from the inside. The template asked for verbatim quotes precisely so you would not have to rely on that feeling.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/03/quiz-2"
        prompt={
          <>
            Why run a mechanical diff <em>before</em> asking the model to
            explain what changed between two versions of a document?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Because the model cannot read two documents at once.',
            rationale:
              'It can. The problem is not capacity; it is that a model describing differences will paraphrase, and paraphrase drops small textual changes that matter.',
          },
          {
            id: 'b',
            text: 'Because the diff tool finds every change with no error rate, which shrinks the model’s job to explaining a complete list rather than producing one.',
            correct: true,
            rationale:
              'Right. The step where silent omission lives (finding the changes) is handed to a tool that does not omit. The model does the interpreting, which you can check change by change.',
          },
          {
            id: 'c',
            text: 'Because diffs are shorter, so the prompt is cheaper.',
            rationale:
              'Sometimes true, but incidental. The reason is verification, not cost.',
          },
          {
            id: 'd',
            text: 'You should not. The model is better at spotting meaningful changes than a diff tool.',
            rationale:
              'The model is better at explaining why a change matters. It is worse at guaranteeing it noticed every change. Use each for what it is good at.',
          },
        ]}
      />

      <Categorize
        exerciseId="llm-workflows/03/categorize"
        prompt={
          <>
            Sort each verification technique by the document operation it
            best protects.
          </>
        }
        items={[
          { id: 'v1', text: 'Ask for a "Not covered" section listing headed sections the output skipped', bucket: 'summarize' },
          { id: 'v2', text: 'Hand-extract one random page yourself and compare to the model’s rows', bucket: 'extract' },
          { id: 'v3', text: 'Run a character-level diff tool first, then have the model explain each change', bucket: 'compare' },
          { id: 'v4', text: 'Search the source for three of the verbatim quotes', bucket: 'summarize' },
          { id: 'v5', text: 'Pick five output rows at random and locate each one in the source', bucket: 'extract' },
          { id: 'v6', text: 'Flag every change to an obligation, number, or date for human reading', bucket: 'compare' },
        ]}
        buckets={[
          { id: 'summarize', label: 'Summarize', description: 'Catching dropped claims and invented quotes.' },
          { id: 'extract', label: 'Extract', description: 'Catching misses and inventions in a list or table.' },
          { id: 'compare', label: 'Compare', description: 'Catching small textual changes a paraphrase would skip.' },
        ]}
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: writing with a model without ending up with its voice instead
        of yours.
      </p>
    </LessonShell>
  );
}
