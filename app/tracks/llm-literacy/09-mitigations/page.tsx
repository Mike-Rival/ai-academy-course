import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Mitigations and Their Hidden Costs — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '09-mitigations');
  return (
    <LessonShell
      lessonId="llm-literacy/09-mitigations"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Mitigations and Their Hidden Costs"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Three techniques get pitched as fixes for LLM unreliability: RAG, agents,
        and fine-tuning. Each is a real mitigation. None is a fix. This lesson is
        about what each one actually does, what it doesn&rsquo;t do, and the
        right order to try them.
      </p>

      <h2>RAG (retrieval-augmented generation)</h2>
      <p>
        <strong>What it is:</strong> Before answering, the system searches a
        document collection for relevant passages and inserts them into the
        prompt. The model then generates an answer grounded in the retrieved
        material rather than relying purely on its training data.
      </p>
      <p>
        <strong>What it helps with:</strong> Factual recall on topics in your
        document set. Up-to-date information that wasn&rsquo;t in the model&rsquo;s
        training data. The ability to cite specific passages.
      </p>
      <p>
        <strong>What it doesn&rsquo;t fix:</strong>
      </p>
      <ul>
        <li>
          <strong>The model can still hallucinate within the retrieved context.</strong>
          {' '}It can invert claims, attribute one source&rsquo;s position to another,
          or extrapolate beyond what the passages say.
        </li>
        <li>
          <strong>Retrieval coverage is invisible.</strong> If the relevant passage
          wasn&rsquo;t retrieved, the model doesn&rsquo;t know. It will answer
          confidently using whatever was retrieved, even if the actual answer was
          in a document that didn&rsquo;t make the cut. <em>The user has no way to
          tell whether retrieval failed.</em>
        </li>
        <li>
          <strong>It still makes the LLM look more authoritative than it is.</strong>
          {' '}Citations create false confidence (see Lesson 5).
        </li>
      </ul>
      <p>
        <strong>Best uses:</strong> Closed, well-curated document sets where you
        can validate retrieval quality. Q&amp;A over a knowledge base you control.
        Augmenting answers with sources users will actually click through.
      </p>

      <h2>Agents</h2>
      <p>
        <strong>What it is:</strong> A workflow where the LLM doesn&rsquo;t just
        answer in one turn — it plans, calls tools (search, calculators, APIs,
        other LLMs), observes results, and iterates. Multi-step task automation.
      </p>
      <p>
        <strong>What it helps with:</strong> Tasks that require taking action,
        breaking down problems, or composing several capabilities. Lets a model
        do things rather than just describe them.
      </p>
      <p>
        <strong>What it doesn&rsquo;t fix:</strong>
      </p>
      <ul>
        <li>
          <strong>Errors compound across steps.</strong> If each step has a 10%
          error rate, a five-step agent fails ~40% of the time even if every
          single step in isolation is &ldquo;mostly right.&rdquo;
        </li>
        <li>
          <strong>Each step needs its own verification.</strong> An agent without
          per-step checks is a chain of unverified outputs feeding each other.
        </li>
        <li>
          <strong>Cost multiplies.</strong> A 5-step agent makes 5+ model calls
          per user request, often more. This matters at scale.
        </li>
        <li>
          <strong>Debugging gets harder.</strong> When an agent produces a bad
          final answer, locating <em>which</em> step went wrong is a real
          investigation.
        </li>
      </ul>
      <p>
        <strong>Best uses:</strong> Bounded workflows where each tool call is
        verifiable, where failures are recoverable, and where the agent&rsquo;s
        decisions can be audited.
      </p>

      <h2>Fine-tuning</h2>
      <p>
        <strong>What it is:</strong> Further training a model on examples
        specific to your task or domain. Changes the model&rsquo;s weights.
      </p>
      <p>
        <strong>What it helps with:</strong> Style and format consistency (the
        model picks up the voice of your training examples). Specialized
        vocabulary the base model doesn&rsquo;t handle well. Reducing prompt
        length when you have a stable, repeated pattern.
      </p>
      <p>
        <strong>What it doesn&rsquo;t fix:</strong>
      </p>
      <ul>
        <li>
          <strong>Doesn&rsquo;t teach new facts reliably.</strong> Fine-tuning is
          not a knowledge update. Training data needs to be very large and
          well-distributed before facts &ldquo;stick.&rdquo; For knowledge, use
          RAG.
        </li>
        <li>
          <strong>Locks you in.</strong> A fine-tuned model is yours to maintain.
          When the base model improves, your fine-tune is on the old version
          until you redo the work.
        </li>
        <li>
          <strong>Is often unnecessary.</strong> Prompt engineering and few-shot
          examples can frequently achieve the same outcome at a fraction of the
          cost and complexity, with the model staying flexible.
        </li>
      </ul>

      <h2>The order of operations</h2>
      <p>
        For almost any LLM problem, try in this order, stopping when you have
        enough:
      </p>
      <ol>
        <li>
          <strong>Better prompting.</strong> Often dramatically underrated.
          Concrete instructions, explicit constraints, named output format.
        </li>
        <li>
          <strong>Few-shot examples.</strong> Show the model 3–5 examples of
          input → desired output. Cheap; flexible; preserves the option to swap
          models.
        </li>
        <li>
          <strong>RAG.</strong> If the issue is &ldquo;the model doesn&rsquo;t
          know the relevant facts,&rdquo; not &ldquo;the model can&rsquo;t reason
          well about facts it has.&rdquo;
        </li>
        <li>
          <strong>Agentic decomposition.</strong> If the task genuinely requires
          multiple discrete steps or external tools.
        </li>
        <li>
          <strong>Fine-tuning.</strong> Last resort, when the previous steps
          aren&rsquo;t enough and the volume justifies the investment.
        </li>
      </ol>
      <p>
        Most projects benefit from skipping straight to step 4 or 5 prematurely
        and would have been fine at step 1 or 2.
      </p>

      <MultipleChoice
        exerciseId="llm-literacy/09/quiz-1"
        prompt={
          <>
            A vendor tells you their RAG-based product &ldquo;eliminates
            hallucinations because every answer is grounded in your
            documents.&rdquo; What&rsquo;s the strongest critique?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'RAG might miss some retrieval cases, but mostly the claim is right.',
            rationale:
              'Understates the issue. The model can hallucinate within retrieved context, and silent retrieval failures mean the user has no way to know when the system answered without the right material.',
          },
          {
            id: 'b',
            text: '"Eliminates" is too strong. RAG reduces hallucination on retrieved facts but introduces a new silent failure mode: when retrieval misses the relevant passage, the model still answers — confidently — from whatever it did retrieve.',
            correct: true,
            rationale:
              'Correct. RAG trades one failure mode (training-data hallucination) for a different one (retrieval-coverage failure). Neither is zero.',
          },
          {
            id: 'c',
            text: 'Only true if their retrieval is good enough.',
            rationale:
              'Even with perfect retrieval, the generation step can misread the retrieved text. RAG does not bypass the model — it just gives it different inputs.',
          },
          {
            id: 'd',
            text: 'Yes, RAG fully solves hallucination for in-corpus questions.',
            rationale:
              'No. Hallucinations within retrieved context are a documented failure mode of RAG systems.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/09/quiz-2"
        prompt={
          <>
            Your team is unhappy with the quality of LLM output on a task. A
            consultant recommends fine-tuning a custom model. What should you try
            first?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Fine-tune. They are the expert.',
            rationale:
              "Fine-tuning is expensive and locks you in. It is rarely the cheapest fix. Try cheaper steps first.",
          },
          {
            id: 'b',
            text: 'Rewrite the prompt with explicit constraints and 3–5 worked examples; measure whether quality improves.',
            correct: true,
            rationale:
              'Right. Prompt engineering and few-shot examples are step 1 and 2. They are cheap, reversible, and frequently solve the problem alone.',
          },
          {
            id: 'c',
            text: 'Switch to a larger model.',
            rationale:
              'A reasonable secondary lever, but the prompt is usually the cheaper and more diagnostic change first.',
          },
          {
            id: 'd',
            text: 'Add RAG.',
            rationale:
              'Only relevant if the issue is missing factual knowledge. If the issue is style, format, or reasoning, RAG does not help.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/09/reflection"
        prompt={
          <>
            Pick an AI initiative at your organization (real or hypothetical). What
            order would the team approach it in? How many of the cheaper steps
            (prompt engineering, few-shot) get skipped before the heavier
            mitigations (RAG, agents, fine-tuning) get pitched as the answer?
          </>
        }
        modelAnswer={
          <>
            <p>
              In practice, the order often gets reversed: someone proposes
              fine-tuning or an agentic system before anyone has invested
              seriously in prompt engineering. There&rsquo;s a few reasons —
              fine-tuning sounds more impressive to leadership; agents are the
              fashionable architecture this year; prompts feel
              &ldquo;unserious.&rdquo;
            </p>
            <p>
              The underrated move: spend a real week on prompt iteration with
              measurement. Most projects find that gets them most of the way
              there, at a fraction of the cost and with the flexibility to swap
              in a better base model whenever one ships.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: reading bold claims about LLM capabilities skeptically.
      </p>
    </LessonShell>
  );
}
