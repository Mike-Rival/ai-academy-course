import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Fine-Tuning — Concepts — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '06-fine-tuning-concepts');
  return (
    <LessonShell
      lessonId="ai/06-fine-tuning-concepts"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Fine-Tuning — Concepts"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Fine-tuning means continuing to train a pretrained model on examples
        specific to your task. It changes the weights. Done well, it teaches
        the model a style, a format, or a specialized vocabulary. Done poorly,
        it&rsquo;s expensive and gets you something worse than a good prompt.
      </p>

      <h2>What fine-tuning actually does</h2>
      <p>
        You start with a model that has general capability from its
        pretraining. You then train it on (input, output) pairs from your
        task. Each pair nudges the weights to make outputs like yours more
        likely. After enough pairs, the model&rsquo;s default behavior on
        similar inputs has shifted toward your examples.
      </p>

      <h2>Three flavors</h2>

      <h3>1. Full fine-tuning</h3>
      <p>
        Update every weight in the model. Most powerful, most expensive,
        requires the most data, and produces a model file as large as the
        original. Rarely the right choice anymore.
      </p>

      <h3>2. Parameter-efficient fine-tuning (LoRA, adapters)</h3>
      <p>
        Freeze the base model. Add a small number of trainable parameters
        alongside or on top of the existing weights. Train only those. The
        small set is what you&rsquo;ve fine-tuned; you can load multiple sets
        of these for different tasks while reusing the base. Standard practice
        for most fine-tuning today. Cheap, fast, easy to undo.
      </p>

      <h3>3. Instruction / preference tuning</h3>
      <p>
        A special case used by model providers to make base models follow
        instructions or align with human preferences. RLHF (reinforcement
        learning from human feedback) is one method here. Not typically
        something an end user does, but worth knowing about because it&rsquo;s
        what makes chat models behave the way they do — and where sycophancy
        comes from (Lesson 2 of the LLM Literacy track).
      </p>

      <h2>What fine-tuning is good for</h2>
      <ul>
        <li>
          <strong>Style and format consistency.</strong> If you need outputs
          in a very specific structure that prompting can&rsquo;t reliably
          produce.
        </li>
        <li>
          <strong>Specialized vocabulary or jargon</strong> the base model
          handles poorly.
        </li>
        <li>
          <strong>Reducing prompt length</strong> for a high-volume task —
          fold the system prompt into the weights.
        </li>
        <li>
          <strong>Improving on tasks you have a lot of labeled data for</strong>{' '}
          — typically 1,000+ high-quality examples.
        </li>
      </ul>

      <h2>What fine-tuning is <em>not</em> good for</h2>
      <ul>
        <li>
          <strong>Teaching the model new facts.</strong> Fine-tuning is not a
          knowledge update. New facts often don&rsquo;t &ldquo;stick&rdquo;
          reliably, especially in small training sets. If you need the model
          to know something, use RAG.
        </li>
        <li>
          <strong>Fixing reasoning failures.</strong> If the model gets
          arithmetic wrong, fine-tuning on more arithmetic helps only
          marginally — it&rsquo;s a fundamental architecture constraint.
        </li>
        <li>
          <strong>Cheap wins.</strong> The data preparation alone usually
          dominates the cost. Most projects find they should have spent that
          effort on prompt engineering first.
        </li>
      </ul>

      <h2>The order of operations (again)</h2>
      <p>
        Repeated from the LLM Literacy track because it&rsquo;s the most
        commonly skipped step:
      </p>
      <ol>
        <li>Better prompting (specific instructions, format spec, constraints).</li>
        <li>Few-shot examples in the prompt (2–5 worked examples).</li>
        <li>RAG (if missing knowledge is the problem).</li>
        <li>Agentic / tool decomposition (if multi-step or external action is the problem).</li>
        <li>Fine-tuning (last resort, when nothing above closes the gap).</li>
      </ol>
      <p>
        Almost every &ldquo;we should fine-tune&rdquo; project benefits more
        from a serious week on step 1 and 2.
      </p>

      <h2>If you do fine-tune, what to know</h2>
      <ul>
        <li>
          <strong>Data quality dominates.</strong> 500 clean, representative
          examples beat 5,000 noisy ones.
        </li>
        <li>
          <strong>Hold out a real eval set</strong> — examples the model never
          sees during training. Without this you cannot tell if fine-tuning
          helped or just memorized.
        </li>
        <li>
          <strong>Compare fine-tuned to base + prompt.</strong> The fair
          comparison is &ldquo;my fine-tuned small model&rdquo; vs.
          &ldquo;the base model with my best prompt and few-shot
          examples.&rdquo; Not vs. &ldquo;random outputs.&rdquo;
        </li>
        <li>
          <strong>Maintenance cost is real.</strong> When the base model
          improves, your fine-tune is on the old version. You&rsquo;ll need to
          redo it.
        </li>
      </ul>

      <MultipleChoice
        exerciseId="ai/06/quiz"
        prompt={<>A team wants the model to "know about" their internal product details. Best move?</>}
        options={[
          {
            id: 'a',
            text: 'Fine-tune the model on the product documentation.',
            rationale:
              "Wrong tool. Fine-tuning is unreliable at injecting specific facts, especially with limited data. The information may not surface when needed.",
          },
          {
            id: 'b',
            text: 'Retrieve relevant doc passages at query time and put them in the prompt (RAG).',
            correct: true,
            rationale:
              'Right. RAG is the right pattern for "the model should reference these documents." It also lets you update the docs without retraining.',
          },
          {
            id: 'c',
            text: 'Use a bigger model and hope.',
            rationale: 'Bigger models do not know your specific internal product details either.',
          },
          {
            id: 'd',
            text: 'Build an agent that searches the docs.',
            rationale:
              'Closer — search over docs is what you want. The simpler version is RAG (search + include in prompt) without the multi-step agent overhead.',
          },
        ]}
      />

      <Reflection
        exerciseId="ai/06/reflection"
        prompt={
          <>
            If you&rsquo;ve seen a proposal to fine-tune a model at work, walk
            through it with the order-of-operations above. Were the earlier
            steps actually tried first? What evidence is there that fine-tuning
            (rather than prompt engineering or RAG) is the right next move?
          </>
        }
        modelAnswer={
          <>
            <p>
              The honest answer for most proposals is &ldquo;the earlier steps
              were skipped&rdquo; or &ldquo;tried once briefly.&rdquo;
              Fine-tuning sounds impressive in a slide deck; prompt engineering
              feels unserious. But prompt engineering with measurement,
              followed by RAG if knowledge is the gap, solves more problems
              more cheaply than fine-tuning solves on average.
            </p>
            <p>
              The right question to ask: &ldquo;what specific behavior do we
              want that prompting plus examples couldn&rsquo;t produce in a
              measured eval?&rdquo; If no one has run that eval, that&rsquo;s
              the next thing to do.
            </p>
          </>
        }
      />
    </LessonShell>
  );
}
