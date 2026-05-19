import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Prompting Hygiene Without Overpromising — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '13-prompting-hygiene');
  return (
    <LessonShell
      lessonId="llm-literacy/13-prompting-hygiene"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Prompting Hygiene Without Overpromising"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Prompts matter. Clear inputs produce better outputs more often than vague
        ones. That is the honest version of &ldquo;prompt engineering.&rdquo;
      </p>
      <p>
        The dishonest version is the cottage industry of &ldquo;magic
        prompts&rdquo; — secret phrases, mystical framings, &ldquo;you are an
        expert in X&rdquo; preambles — sold as if they unlock hidden model
        capability. Most of these are weakly supported, don&rsquo;t replicate
        across models, and decay as models change.
      </p>
      <p>
        This lesson covers the moves with real evidence, not the folk
        techniques.
      </p>

      <h2>What actually helps</h2>

      <h3>1. Be specific about the output you want</h3>
      <p>
        Don&rsquo;t ask the model to &ldquo;help with the email.&rdquo; Ask for
        &ldquo;a three-sentence reply, polite tone, declining the request,
        leaving the door open for future requests.&rdquo; The model can&rsquo;t
        read your mind, and it will produce something within the very wide space
        of plausible interpretations if you let it.
      </p>

      <h3>2. Give the model the context it needs</h3>
      <p>
        If you want a decision, give the constraints. If you want a summary,
        give it the source. If you want analysis, give the data and explain the
        question. Vague inputs guarantee vague outputs.
      </p>

      <h3>3. Show examples when possible</h3>
      <p>
        Two to four examples of input → desired output (&ldquo;few-shot
        prompting&rdquo;) is genuinely effective. It anchors the model far more
        than instructions alone. The format is straightforward:
      </p>
      <pre><code>{`Example 1:
Input: ...
Output: ...

Example 2:
Input: ...
Output: ...

Now do this one:
Input: ...
Output:`}</code></pre>

      <h3>4. Ask for the format you want</h3>
      <p>
        If you want bullets, say bullets. If you want JSON, give the schema. If
        you want a table, describe the columns. Format compliance is one of the
        most reliable things to ask for explicitly.
      </p>

      <h3>5. Constrain length</h3>
      <p>
        &ldquo;Three sentences,&rdquo; &ldquo;a single paragraph,&rdquo; &ldquo;a
        list of at most five items&rdquo; — these work. The model doesn&rsquo;t
        count perfectly, but length instructions move the output meaningfully
        in the right direction and avoid the default wall of text.
      </p>

      <h3>6. Iterate, but in a fresh thread for big rewrites</h3>
      <p>
        Small refinements in the same conversation are fine. For substantial
        changes, restart with an updated prompt rather than &ldquo;actually,
        more like this…&rdquo; chains. Lesson 4 explains why.
      </p>

      <h2>What doesn&rsquo;t reliably help</h2>

      <h3>1. Role-play preambles</h3>
      <p>
        &ldquo;You are a world-class expert in cardiology&rdquo; rarely improves
        accuracy in a meaningful way. The model isn&rsquo;t actually consulting
        cardiology knowledge differently because you assigned it a role; it&rsquo;s
        producing the kind of text it&rsquo;s seen labeled &ldquo;expert
        cardiologist response.&rdquo; The role might tweak tone and vocabulary.
        It does not unlock hidden competence.
      </p>

      <h3>2. Threats and incentives</h3>
      <p>
        &ldquo;If you get this wrong, I will lose my job&rdquo; or &ldquo;I will
        tip you $500&rdquo; — these were briefly a meme. Evidence for their
        effectiveness is weak and inconsistent. Save the social-engineering
        energy for actually constraining the task.
      </p>

      <h3>3. &ldquo;Think step by step&rdquo; as a magic phrase</h3>
      <p>
        This used to do real work on smaller, older models. On modern models,
        especially reasoning-mode ones, the model already structures its output
        regardless of whether you add the phrase. It doesn&rsquo;t hurt, but it
        is not the secret it once was.
      </p>

      <h3>4. Extreme detail when the task is simple</h3>
      <p>
        A 500-word prompt for a 20-word task wastes everyone&rsquo;s time. Add
        constraints when they help; resist the urge to over-specify.
      </p>

      <h2>The honest framing</h2>
      <p>
        Better prompts produce better outputs <em>more often</em>. They do not
        eliminate hallucination, fix unverifiability, or bypass the failure modes
        in earlier lessons. A great prompt with no verification step is still
        unverified output.
      </p>
      <blockquote>
        Prompting helps the model do what you asked. It doesn&rsquo;t change
        whether what you asked for is something the model can actually do
        reliably.
      </blockquote>

      <MultipleChoice
        exerciseId="llm-literacy/13/quiz-1"
        prompt={
          <>
            Which of the following changes is most likely to improve output
            quality on a typical task?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Prepending "You are a world-class expert in X" to the prompt.',
            rationale:
              'May tweak tone; rarely changes underlying accuracy in a meaningful way. Folk technique.',
          },
          {
            id: 'b',
            text: 'Adding two to three worked examples of input → desired output.',
            correct: true,
            rationale:
              'Right. Few-shot examples are one of the most consistently effective changes — they anchor format and approach in a way instructions alone cannot.',
          },
          {
            id: 'c',
            text: 'Telling the model you will tip it $500.',
            rationale:
              "Weak and inconsistent evidence. Likely a fad. Don't rely on it.",
          },
          {
            id: 'd',
            text: 'Adding "Think step by step." at the end.',
            rationale:
              "Used to matter more than it does now. Modern models often structure output anyway. Mild help at best.",
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/13/quiz-2"
        prompt={
          <>
            A teammate spent three hours crafting an elaborate prompt for a task
            that previously had a 30% error rate. With the new prompt, error rate
            on a small re-test was 10%. What&rsquo;s the most defensible read?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'The new prompt is dramatically better — adopt it widely.',
            rationale:
              'A small re-test on a stochastic system is weak evidence. The improvement could be real, or noise, or selection bias in which examples were re-tested.',
          },
          {
            id: 'b',
            text: 'The new prompt looks promising; before adopting, expand the test set significantly and verify the improvement is stable across runs.',
            correct: true,
            rationale:
              'Right. Real prompt evaluation needs a larger evaluation set and ideally multiple runs per example.',
          },
          {
            id: 'c',
            text: 'The new prompt is worthless — three hours is too much investment for prompt engineering.',
            rationale:
              'The time investment is a separate question from the result. Prompt engineering can be valuable; what matters is whether the effort produced measurable, stable improvement.',
          },
          {
            id: 'd',
            text: 'The original was already fine; the 30%/10% difference is probably noise.',
            rationale:
              'Possible, but you cannot conclude this from the available evidence either way. The honest answer is "we need to test more before deciding."',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/13/reflection"
        prompt={
          <>
            Pick a prompt you use regularly. Rewrite it: be more specific about
            the desired output, add an example if you don&rsquo;t have one, and
            cut anything that isn&rsquo;t pulling its weight. Try both prompts
            on the same task five times. Did the rewrite actually do better, or
            did it just feel like it should?
          </>
        }
        modelAnswer={
          <>
            <p>
              The instructive part of this exercise is often that the new
              prompt is <em>about the same</em>, not dramatically better. That
              isn&rsquo;t a failure — it&rsquo;s evidence about where the
              quality ceiling is, and a reminder that prompt engineering is one
              lever, not a magic one.
            </p>
            <p>
              When rewrites do help, the gain typically comes from being
              specific about format and adding examples — not from clever
              phrasing.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: the capstone — apply the framework to a real workplace task.
      </p>
    </LessonShell>
  );
}
