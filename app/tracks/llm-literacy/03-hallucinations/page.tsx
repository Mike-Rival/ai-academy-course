import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Hallucinations in the Wild — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '03-hallucinations');
  return (
    <LessonShell
      lessonId="llm-literacy/03-hallucinations"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Hallucinations in the Wild"
      estMinutes={15}
      nav={nav}
    >
      <p>
        A <strong>hallucination</strong> is a confident, fluent, plausible-looking
        output that is not true. The word is misleading — it suggests a special
        failure mode. The honest framing is that an LLM is <em>always</em> generating
        plausible-looking text; sometimes the plausible thing is also correct, and
        sometimes it isn&rsquo;t.
      </p>

      <h2>Three real cases</h2>

      <h3>Case 1: The fabricated case law</h3>
      <p>
        In 2023, two attorneys filed a brief in <em>Mata v. Avianca</em> citing
        several federal court decisions. The cases didn&rsquo;t exist. The attorneys
        had used ChatGPT to research precedent. When opposing counsel and the court
        could not find the cases, the attorneys asked the model to confirm — it did,
        producing additional fabricated details. The court sanctioned both attorneys.
      </p>
      <p>
        <strong>What looked plausible:</strong> Case names that followed the right
        format. Opinions cited by the model in the right voice. Confirmation when
        challenged.
      </p>
      <p>
        <strong>What was missing:</strong> A check against an external case database.
        That check would have taken minutes.
      </p>
      <p>
        <strong>Cost:</strong> Professional discipline, public sanctions, career
        damage. The downstream cost was wildly disproportionate to the upstream cost
        of verifying.
      </p>

      <h3>Case 2: The summary that flipped a sign</h3>
      <p>
        A representative failure pattern (reconstructed here from the broader
        class of negation-flip and numeric-error reports documented across LLM
        evaluations): a model summarizes a long document correctly except for
        inverting a single critical detail. &ldquo;Patient denies chest
        pain&rdquo; becomes &ldquo;patient reports chest pain.&rdquo; A dosage
        of 50mg is rendered as 5mg. A clause stating one side&rsquo;s position
        gets attached to the other side. The summary otherwise reads as
        competent. The error is buried in plausible context.
      </p>
      <p>
        <strong>What looked plausible:</strong> Correct structure, correct
        terminology, most details right.
      </p>
      <p>
        <strong>Cost in the worst case:</strong> A treatment decision based on the
        inverted detail.
      </p>

      <h3>Case 3: The plausible code that compiles and runs — wrong</h3>
      <p>
        A developer asks an LLM to write a function that computes a financial metric.
        The function compiles, runs, produces a number on every input, and matches
        the colleague&rsquo;s spot-check on three sample rows. In production, on edge
        cases the developer didn&rsquo;t test, it silently uses the wrong formula.
      </p>
      <p>
        <strong>What looked plausible:</strong> Clean code style, matching variable
        names, output of the right type, no errors.
      </p>
      <p>
        <strong>The trap:</strong> &ldquo;It compiled and the example worked&rdquo;
        is the same evidence whether the formula is right or wrong.
      </p>

      <h2>The common shape</h2>
      <p>
        Across all three: the output looked like the right kind of thing. It was
        formatted correctly. It used the right vocabulary. Most of it was even right.
        The failure was a specific detail that needed an external check, and the
        external check was skippable, which made it skipped.
      </p>

      <h2>When are hallucinations more likely?</h2>
      <ul>
        <li>
          <strong>Long-tail facts</strong> the model has seen rarely or inconsistently
          (specific cases, niche people, obscure numbers).
        </li>
        <li>
          <strong>Domains where plausibility is high but verification is hard</strong>
          {' '}(case law, citations, medical detail, financial formulas).
        </li>
        <li>
          <strong>When you push the model toward an answer</strong> by phrasing or
          follow-up.
        </li>
        <li>
          <strong>Long conversations</strong> where earlier context is no longer in
          focus (covered in the next lesson).
        </li>
      </ul>

      <MultipleChoice
        exerciseId="llm-literacy/03/quiz-1"
        prompt={
          <>
            Which of the following is the strongest summary of what
            &ldquo;hallucination&rdquo; means in this context?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'A bug where the model occasionally produces wrong outputs.',
            rationale:
              'It is not a bug or an "occasional" failure — it is what the system does when fluency and correctness diverge. They diverge often.',
          },
          {
            id: 'b',
            text: 'A separate failure mode triggered by certain kinds of prompts.',
            rationale:
              'Some prompts make it more likely, but it is not a separate mode — it is the same generation process producing plausible-but-wrong text.',
          },
          {
            id: 'c',
            text: 'A confident, fluent output that happens to not be true — produced by the same machinery as confident, fluent outputs that are true.',
            correct: true,
            rationale:
              'Correct. The mechanism is the same in both cases. The difference is only whether the plausible-sounding thing is also factually right.',
          },
          {
            id: 'd',
            text: 'A side effect of the model trying to be helpful.',
            rationale:
              'Anthropomorphizes the model. It is not "trying" to anything; it is sampling tokens that maximize plausibility under its learned distribution.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/03/quiz-2"
        multi
        prompt={
          <>
            Select <em>all</em> of the following that would meaningfully reduce
            hallucination risk on a task. (More than one is correct.)
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Asking the model to confirm its own answer.',
            rationale:
              'No — same machinery, same biases, plus sycophancy. The model will often confirm whichever direction you nudged toward.',
          },
          {
            id: 'b',
            text: 'Cross-checking specific facts against a known source.',
            correct: true,
            rationale:
              'Yes. Independent verification is the actual fix. Note: "specific" matters — verify the facts, not the vibe.',
          },
          {
            id: 'c',
            text: 'Running the same prompt three times and going with the majority answer.',
            rationale:
              'Mild help for stochastic noise, but if the model has a systematic wrong belief, all three runs may agree on it. Use as a weak signal, not a check.',
          },
          {
            id: 'd',
            text: 'Picking a task where the cost of being wrong is bounded and small.',
            correct: true,
            rationale:
              'Yes — not a "fix" but a real mitigation. Risk = probability × consequence. Lowering consequence is a valid lever.',
          },
          {
            id: 'e',
            text: 'Using a bigger, newer model.',
            rationale:
              'Bigger models hallucinate less in some benchmarks, but they still hallucinate, and often more convincingly. This is a partial mitigation, not a solution.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/03/reflection"
        prompt={
          <>
            Pick a task at your work where an LLM hallucination could plausibly slip
            through. In a few sentences: what specific detail is most likely to be
            wrong? How would you catch it? Is that catch cheap enough that you would
            actually do it?
          </>
        }
        modelAnswer={
          <>
            <p>
              The shape of a useful answer: name the <em>specific</em> detail (a
              date, a number, a name, a citation, a formula component). Then name
              the specific external source you&rsquo;d compare against. Then
              honestly assess whether you&rsquo;d actually do that comparison every
              time, or only sometimes.
            </p>
            <p>
              The honest &ldquo;only sometimes&rdquo; answer is fine — it just
              tells you the model is appropriate for low-stakes uses of this task,
              not high-stakes ones. The risk literacy is in being able to name
              which is which.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: how long conversations make hallucinations worse.
      </p>
    </LessonShell>
  );
}
