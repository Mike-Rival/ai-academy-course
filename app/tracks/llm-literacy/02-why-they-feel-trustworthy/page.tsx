import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Why LLMs Feel Trustworthy When They Are Not — Credence AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '02-why-they-feel-trustworthy');
  return (
    <LessonShell
      lessonId="llm-literacy/02-why-they-feel-trustworthy"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Why LLMs Feel Trustworthy When They Are Not"
      estMinutes={12}
      nav={nav}
    >
      <p>
        The previous lesson laid out what an LLM is: a next-token predictor trained
        to produce fluent text. This lesson covers three properties that make those
        predictions <em>feel</em> more reliable than they are.
      </p>

      <h2>1. Fluency was the training objective. Competence was not.</h2>
      <p>
        Models are graded during training on how well they produce text that matches
        what humans wrote. The reward signal is &ldquo;does this read like something
        a person would write?&rdquo; — not &ldquo;is this correct?&rdquo;
      </p>
      <p>
        The downstream effect: an LLM produces well-formed, articulate, confident
        sentences whether the underlying claim is true or false. You are reading the
        same prose in both cases.
      </p>
      <blockquote>
        <strong>Tone is not evidence.</strong> A model can tell you with the same
        confidence that the Eiffel Tower is in Paris and that the Eiffel Tower is in
        Berlin.
      </blockquote>

      <h2>2. Sycophancy is the default.</h2>
      <p>
        Most modern chat models go through a second training step called RLHF
        (reinforcement learning from human feedback) where humans rate sample outputs.
        Humans, on average, rate friendly-and-agreeable outputs more highly than
        contrarian ones. The model learns that pleasing the user produces good
        ratings.
      </p>
      <p>
        Result: <strong>asking the model &ldquo;are you sure?&rdquo; or
        &ldquo;couldn&rsquo;t it be X instead?&rdquo; usually causes it to agree
        with your direction</strong>, regardless of which direction is correct.
        This is not a sign that the model has reconsidered — it is the trained
        behavior to please you. If you push back on a right answer, the model will
        often abandon it.
      </p>

      <h2>3. Reasoning traces are not reasoning.</h2>
      <p>
        Many models now produce a visible &ldquo;thinking&rdquo; or
        chain-of-thought trace before answering. It looks like the model is working
        through the problem step by step.
      </p>
      <p>
        Research into how these traces relate to the model&rsquo;s actual computation
        has shown that <strong>the displayed reasoning is often unfaithful</strong>
        — the model can produce a plausible chain of reasoning that does not reflect
        the path that actually generated the answer. The trace is itself just more
        generated text, optimized to look like reasoning.
      </p>
      <p>
        The trace may still be useful for a user — it gives you something to read
        critically. But &ldquo;the model showed its work&rdquo; is not evidence that
        the work was sound.
      </p>

      <h2>Putting it together</h2>
      <p>
        Combine these and you get a system that:
      </p>
      <ul>
        <li>Sounds like it knows things, whether or not it does.</li>
        <li>Caves when you push back, whether or not you should be pushing back.</li>
        <li>Produces step-by-step reasoning that may not match how it arrived at the answer.</li>
      </ul>
      <p>
        None of these are bugs the next model release will fix. They fall out of how
        these systems are trained.
      </p>

      <MultipleChoice
        exerciseId="llm-literacy/02/quiz-1"
        prompt={
          <>
            You ask an LLM to draft a recommendation. You then say,
            &ldquo;Are you sure? I would have expected the opposite.&rdquo; The model
            promptly agrees with you and gives the opposite recommendation. What did
            you just learn?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The first answer was wrong and the second is right.',
            rationale:
              'You learned almost nothing about which is right. The flip is the trained sycophancy response, not a sign of new analysis.',
          },
          {
            id: 'b',
            text: 'The model is uncertain, so I should weight both answers equally.',
            rationale:
              'The model is not signalling uncertainty — it is responding to social pressure. "Equally weighted" implies calibrated doubt, which is not what is happening.',
          },
          {
            id: 'c',
            text: 'I learned that the model agrees with pushback, which is the default behavior — I still have no idea which recommendation is correct.',
            correct: true,
            rationale:
              'Right. To learn which is correct you need an external check, not a follow-up question to the same model.',
          },
          {
            id: 'd',
            text: 'The second answer is better because the model "thought harder" the second time.',
            rationale:
              'A second generation is not a second consideration. The same machinery produced both answers, just with different context (your pushback).',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/02/quiz-2"
        prompt={
          <>
            A reasoning-mode model shows you a long chain of step-by-step thoughts
            before answering a math problem. The final answer is wrong. The trace
            looks coherent and even cites the right rule. What&rsquo;s the most
            useful conclusion?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'If the trace looks coherent, the answer is probably right; this is a one-off.',
            rationale:
              'Coherence of the trace is independent of correctness of the answer. The trace is generated text, like the answer.',
          },
          {
            id: 'b',
            text: 'A coherent-looking trace can still produce a wrong answer; the trace is itself generated text, and its faithfulness to the actual computation is not guaranteed.',
            correct: true,
            rationale:
              'Correct. Reasoning models are still next-token predictors all the way down. The trace gives you something to inspect, but does not certify the answer.',
          },
          {
            id: 'c',
            text: 'The model is hallucinating — turn off reasoning mode.',
            rationale:
              '"Reasoning mode" did not cause the failure; it just made the failure visible. Without it you might have just seen the wrong answer with no trace at all.',
          },
          {
            id: 'd',
            text: 'I should ask the model to redo the trace more carefully.',
            rationale:
              'Asking a sycophantic system to "be more careful" generally produces output that looks more careful. It is not a fix.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/02/reflection"
        prompt={
          <>
            Think of a time you asked an AI tool a question and accepted its answer.
            Did the model&rsquo;s confidence, fluency, or step-by-step reasoning
            influence how trustworthy you felt the answer was? Now, separately:
            what evidence — outside the model — would have actually confirmed it?
          </>
        }
        modelAnswer={
          <>
            <p>
              The two things to notice: <em>what made you feel confident</em> and{' '}
              <em>what would have actually justified confidence</em> are different
              lists. Confidence usually comes from fluency, formatting, and tone —
              all of which are produced by the model regardless of correctness.
              Actual justification requires something external: a known source, a
              reproducible test, an expert review, a calculation you can re-derive.
            </p>
            <p>
              The aim of this whole track is to teach you to notice that gap in
              real time, while you are reading the model&rsquo;s output, not after
              you have already acted on it.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: real-world hallucination examples and what they cost.
      </p>
    </LessonShell>
  );
}
