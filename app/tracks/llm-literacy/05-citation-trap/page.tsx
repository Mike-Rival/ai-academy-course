import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'The Citation Trap — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-literacy', '05-citation-trap');
  return (
    <LessonShell
      lessonId="llm-literacy/05-citation-trap"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="The Citation Trap"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Many LLM tools now show citations: links to documents, URLs, or page numbers
        next to claims in the answer. This feels like a strong signal — &ldquo;the
        model showed where it got this from.&rdquo; It is a weaker signal than it
        looks.
      </p>

      <h2>Three things a &ldquo;citation&rdquo; can actually be</h2>

      <h3>1. A fabricated reference</h3>
      <p>
        Plain hallucination of the citation itself. URLs that 404, papers with real
        authors but wrong titles, court cases that don&rsquo;t exist. We covered
        this in the hallucinations lesson — citations get fabricated just like any
        other content.
      </p>

      <h3>2. A real source that wasn&rsquo;t actually consulted</h3>
      <p>
        The model attaches a real, accessible URL or page number that exists, but
        whose contents the model never actually read in a way that meaningfully
        constrained the answer. The citation is plausible-looking decoration. The
        answer was generated from training data, not from that source.
      </p>

      <h3>3. A real source that <em>was</em> consulted, but misread</h3>
      <p>
        Even in retrieval-augmented systems where the model is given the source
        text in its context, the model can still misread it: invert a conclusion,
        miss a qualification, attribute one party&rsquo;s position to another,
        mention a number from one paragraph in the context of an unrelated point.
        The cited page exists. The cited claim is not in it.
      </p>

      <h2>Why this matters more than it should</h2>
      <p>
        Citations create a strong sense of verifiability without actually providing
        verification. The reader rarely clicks through. The reader rarely re-reads
        the cited page to confirm the claim is in it. The presence of citations
        becomes a stand-in for fact-checking, which is the exact opposite of what
        citations are supposed to do.
      </p>
      <blockquote>
        A citation is a <em>pointer to where you can verify</em>. It is not itself
        verification. The verification only happens if a human reads both the claim
        and the source and confirms they match.
      </blockquote>

      <h2>A concrete pattern to watch for</h2>
      <p>
        The model produces five bullet points, each with a footnote-style citation.
        Three of the bullets summarize the source correctly. One bullet
        substitutes a similar-looking number from a different paragraph. One bullet
        states a conclusion the source explicitly argues <em>against</em>. Skimmed
        at a glance, the bullet list reads like a faithful summary. The mismatch is
        only visible if you read the source yourself.
      </p>

      <h2>What to do</h2>
      <ul>
        <li>
          <strong>For claims that matter, click through and read the cited
          passage</strong>. Match it to the claim word by word.
        </li>
        <li>
          <strong>For long lists of citations, sample a few</strong>. If a
          5%-sampled spot check fails, treat the whole list as suspect.
        </li>
        <li>
          <strong>For numbers and quotes, treat the citation as a hint, not a
          guarantee</strong>. Pull the actual number from the actual source.
        </li>
        <li>
          <strong>If you can&rsquo;t verify a citation cheaply, the citation
          doesn&rsquo;t help you</strong>. It is not adding accuracy — it is just
          adding the feeling of accuracy.
        </li>
      </ul>

      <MultipleChoice
        exerciseId="llm-literacy/05/quiz-1"
        prompt={
          <>
            An AI tool produces a research summary with eight citations. You don&rsquo;t
            have time to read the cited papers in full. What&rsquo;s the most
            useful next step before sending the summary upward?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Send it. The citations show the work was grounded in real sources.',
            rationale:
              'Citations are not verification. Their presence alone tells you the format is right, nothing else.',
          },
          {
            id: 'b',
            text: 'Pick two or three citations at random and check whether the claim attached to each actually appears in the source.',
            correct: true,
            rationale:
              'Right. A small sample check is cheap and surfaces both fabrication (no such source) and misreading (real source, wrong claim).',
          },
          {
            id: 'c',
            text: 'Ask the AI to double-check its citations.',
            rationale:
              'Same machinery, same blind spots. The model will often confirm its own citations even when they are wrong.',
          },
          {
            id: 'd',
            text: 'Add a footer noting "AI-generated" and send it.',
            rationale:
              'Disclosure does not fix accuracy. You are still the one putting your name on the summary.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/05/quiz-2"
        prompt={
          <>
            An LLM with retrieval cites the right source for a claim — the source
            exists and is on-topic. But when you actually read it, the source argues
            something subtly different. What category of failure is this?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Fabrication — the source was made up.',
            rationale:
              'No. The source is real and was actually consulted. The failure is in interpreting it.',
          },
          {
            id: 'b',
            text: 'Hallucination — same as making up a citation.',
            rationale:
              "Related but not identical. This is a more dangerous variant because the surface signals are stronger — the source is real.",
          },
          {
            id: 'c',
            text: 'A real source, misread or misrepresented — arguably more dangerous than fabrication because the surface signal (real URL) is stronger.',
            correct: true,
            rationale:
              'Correct. The reader sees a real URL and a real-looking summary and is less likely to verify than they would be for an obvious fabrication.',
          },
          {
            id: 'd',
            text: 'A retrieval error, not a model error.',
            rationale:
              'Retrieval delivered the right document. The model interpreted it wrong. The error is in the generation step.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/05/reflection"
        prompt={
          <>
            Recall the last AI-generated summary or research synthesis you read with
            citations. Did you click through to verify any of them? If not, what
            would have prompted you to? If yes — did the citations actually match
            the claims?
          </>
        }
        modelAnswer={
          <>
            <p>
              The honest answer for most people is &ldquo;I didn&rsquo;t click
              through.&rdquo; That&rsquo;s the trap working as designed: citations
              shifted the apparent verification burden onto a future-you who never
              actually does the verifying.
            </p>
            <p>
              A practical rule of thumb: if the output is consequential enough to
              forward, it&rsquo;s consequential enough to spot-check at least two
              citations. If it isn&rsquo;t consequential enough for that, you
              didn&rsquo;t need it cited in the first place.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: the centerpiece — the unverifiability trap.
      </p>
    </LessonShell>
  );
}
