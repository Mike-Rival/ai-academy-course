import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'What LLMs Actually Do — Credence AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '01-what-llms-actually-do');
  return (
    <LessonShell
      lessonId="llm-literacy/01-what-llms-actually-do"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="What LLMs Actually Do"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Before we talk about when to trust an LLM, we need to be specific about what
        one is. The short version:
      </p>

      <blockquote>
        An LLM is a function that takes a sequence of text and predicts the next chunk
        of text most likely to follow, based on patterns in the data it was trained on.
      </blockquote>

      <p>
        That is the entire mechanism. It is not consulting a knowledge base. It is not
        reasoning step by step the way a person does. It is producing the next token,
        then the next, then the next, conditioned on everything it has seen so far in
        the conversation.
      </p>

      <h2>Three properties that fall out of this</h2>

      <h3>1. It was trained to <em>speak well</em>, not to <em>know things</em></h3>
      <p>
        The training objective rewards producing fluent, plausible-sounding text. A
        well-formed sentence is the goal, not a correct one. Correctness only emerges
        as a side effect when the training data was correct <em>and</em> the model
        generalized that pattern. Neither is guaranteed.
      </p>
      <p>
        The practical consequence: <strong>confident-sounding output is not evidence
        of correctness</strong>. Tone is not information. You will hear an LLM
        confidently state a wrong fact in exactly the same voice it uses to state a
        right one, because to the model these are the same task — produce the
        plausible next token.
      </p>

      <h3>2. The output is <em>stochastic</em></h3>
      <p>
        Most LLMs sample from a probability distribution at each step. Run the same
        prompt twice and you will often get different answers. This is not a bug; it
        is built into the system.
      </p>
      <p>
        The practical consequence: <strong>one good output is not evidence of reliable
        output</strong>. If a colleague says &ldquo;I tried it and it worked,&rdquo;
        ask how many times they tried it, and what fraction of those tries were right.
      </p>

      <h3>3. The model has no idea what is true</h3>
      <p>
        The model has no separate &ldquo;is this true?&rdquo; module that it consults.
        Asking the model &ldquo;are you sure?&rdquo; runs the <em>same machinery</em>{' '}
        that produced the original answer, just with a different prompt. If it was
        wrong before, the follow-up has no privileged access to ground truth — it just
        produces more plausible-sounding text, often agreeing with whichever direction
        you nudged it.
      </p>

      <MultipleChoice
        exerciseId="llm-literacy/01/quiz-1"
        prompt={
          <>
            You ask an LLM for the population of a small town. It answers immediately,
            with two decimal places and a confident tone. Which of the following is
            the best read of that signal?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The tone and precision suggest it pulled this from a reliable source.',
            rationale:
              'Tone and precision are produced by the same mechanism whether or not the answer is correct. Plausibility ≠ accuracy.',
          },
          {
            id: 'b',
            text: 'Confidence is meaningful — if the model were unsure, it would hedge.',
            rationale:
              'Hedging is a learned style, not a calibrated signal. Models hedge inconsistently and can be confidently wrong.',
          },
          {
            id: 'c',
            text: 'Tone tells me nothing about accuracy. I should check the number against a source I trust.',
            correct: true,
            rationale:
              'Correct. The training objective rewards fluent, plausible text — not accurate text. Verify against a known source.',
          },
          {
            id: 'd',
            text: 'If I run it twice and get the same number, that proves it is correct.',
            rationale:
              'Two matching wrong answers are still wrong. Consistency across runs is weak evidence at best, and stochasticity means it can also flip.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/01/quiz-2"
        prompt={
          <>
            A teammate runs a prompt once, likes the answer, and uses it. They tell
            you, &ldquo;it&rsquo;s reliable, I tested it.&rdquo; What&rsquo;s the
            strongest critique of that claim?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'They should have used a more advanced model.',
            rationale:
              'Maybe, but the bigger issue is the test itself — n=1 is not evidence of reliability regardless of model.',
          },
          {
            id: 'b',
            text: 'A single sample from a stochastic system tells you almost nothing about its reliability.',
            correct: true,
            rationale:
              'Right. To say something is "reliable" you need repeated trials and a ground-truth check on each, not one good-feeling output.',
          },
          {
            id: 'c',
            text: 'They should have asked the model to double-check itself.',
            rationale:
              'The model cannot validate its own output — the same machinery that produced the answer produces the self-check. Independent verification is what counts.',
          },
          {
            id: 'd',
            text: 'Nothing — if it worked once it will probably work again.',
            rationale:
              'This is exactly the failure mode this lesson is warning against.',
          },
        ]}
      />

      <h2>Why this lesson is first</h2>
      <p>
        Almost every failure mode covered later in this track — hallucination,
        conversation rot, fake citations, unverifiable summaries — is a special case
        of these three properties. Internalize them now and the rest will be
        applications, not surprises.
      </p>

      <Reflection
        exerciseId="llm-literacy/01/reflection"
        prompt={
          <>
            Think about the last time you used an LLM for work. Pick one specific
            output you accepted. In a few sentences: what would you have had to do to{' '}
            <em>verify</em> it was correct, rather than just plausible-sounding? Was
            that check feasible? Did you actually do it?
          </>
        }
        modelAnswer={
          <>
            <p>
              The honest answer for most people, most of the time, is some version of:
              &ldquo;I didn&rsquo;t verify it, because verification would have cost
              more than the value of the task.&rdquo; That&rsquo;s sometimes a
              reasonable trade — for low-stakes drafting, for instance.
            </p>
            <p>
              The point is to <em>notice that you made that trade</em>. The danger
              isn&rsquo;t skipping verification for a low-stakes task; the danger is
              skipping it for a high-stakes task while believing the output is
              trustworthy because it sounded confident.
            </p>
            <p>
              Later lessons will give you a framework for making this trade-off
              explicitly rather than by reflex.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: <em>Why LLMs feel trustworthy when they aren&rsquo;t</em> — fluency
        as a trained skill, sycophancy as a default behavior, and why reasoning
        traces are not the same as reasoning.
      </p>
    </LessonShell>
  );
}
